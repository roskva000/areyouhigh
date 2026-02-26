import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ExperienceLobby from '../components/ExperienceLobby';
import BriefingOverlay from '../components/BriefingOverlay';
import useIdleHide from '../hooks/useIdleHide';

const VERTEX_SHADER = `
  attribute float a_id;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform float u_speed;
  uniform float u_intensity;

  // NEW LOBBY UNIFORMS
  uniform float u_complexity;
  uniform float u_glitch;
  uniform float u_stardust;
  uniform float u_camera_mode;
  uniform float u_blend_mode;

  varying float v_opacity;
  varying float v_depth;
  varying float v_id;

  mat2 rot(float a) {
      float s = sin(a), c = cos(a);
      return mat2(c, -s, s, c);
  }
  
  float hash(float n) { return fract(sin(n) * 1e4); }

  void main() {
    float t = u_time * 0.5 * u_speed;
    float id_seed = a_id * 0.1337;
    v_id = id_seed;
    
    // Scale complexity mapped to particle field radius and density
    float comp = 1.0 + (u_complexity - 1.0) * 0.5;
    
    // Base chaotic orbit
    float r = 15.0 + sin(id_seed * 0.5) * 10.0 * comp;
    float angle = id_seed + t * (0.2 + hash(id_seed) * 0.8);
    
    vec3 p;
    // 3D Spherical Coordinate mapping + Chaos
    p.x = cos(angle) * sin(id_seed * 43.0) * r;
    p.y = sin(angle * 0.7) * cos(id_seed * 17.0) * r * 0.5;
    p.z = sin(angle) * sin(id_seed * 7.0) * r;
    
    // Add high-frequency noise based on intensity
    p.x += sin(t * 2.0 + id_seed * 12.1) * 3.0 * u_intensity;
    p.y += cos(t * 1.3 + id_seed * 8.7) * 3.0 * u_intensity;
    p.z += sin(t * 1.8 + id_seed * 3.1) * 3.0 * u_intensity;

    // Glitch explosion effect
    if (u_glitch > 0.0) {
        if (hash(id_seed + floor(t*5.0)) > 0.95 - u_glitch * 0.05) {
            p += (vec3(hash(id_seed), hash(id_seed*2.0), hash(id_seed*3.0)) - 0.5) * 40.0 * u_glitch;
        }
    }

    // Camera handling
    if (u_camera_mode < 0.5) {
        // Cinematic pan
        p.xy *= rot(sin(t*0.5)*0.5);
        p.xz *= rot(t*0.2);
    } else if (u_camera_mode < 1.5) {
        // Free fall / tunnel effect
        p.z -= mod(t * 40.0, 80.0) - 40.0;
        p.xy *= rot(t);
    } else {
        // Chaotic orbit
        p.xy *= rot(sin(t)*2.0);
        p.yz *= rot(cos(t*1.5)*1.5);
    }

    // Add Stardust field (independent particles scattered far)
    if (u_stardust > 0.0) {
        if (hash(id_seed*5.0) < u_stardust * 0.1) {
             p *= mix(1.0, 3.5, hash(id_seed*7.0)); // spread them wide
        }
    }

    // Project 3D to 2D
    float scale = 0.03 * (1.0 + u_intensity * 0.2);
    vec2 pos = p.xy * scale;
    pos.x *= u_resolution.y / u_resolution.x;
    
    // Perspective Depth
    float depth = p.z * 0.05 + 2.0;
    
    gl_Position = vec4(pos, 0.0, depth);
    
    // Point size depends on depth
    gl_PointSize = max(1.0, (10.0 / max(0.1, depth)) * (0.5 + u_intensity * 0.5) * comp);
    
    v_depth = depth;
    v_opacity = smoothstep(4.0, 0.0, depth);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform vec3 u_color3;
  uniform float u_time;
  uniform float u_blend_mode;
  uniform float u_stardust;
  uniform float u_glitch;

  varying float v_opacity;
  varying float v_depth;
  varying float v_id;

  vec3 palette(float t) {
    t = fract(t + u_time * 0.1);
    if (t < 0.33) return mix(u_color1, u_color2, t * 3.0);
    if (t < 0.66) return mix(u_color2, u_color3, (t - 0.33) * 3.0);
    return mix(u_color3, u_color1, (t - 0.66) * 3.0);
  }

  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    
    vec3 col = palette(v_depth * 0.5 + v_id * 0.1);
    float alpha = smoothstep(0.5, 0.0, r) * v_opacity;
    
    if (u_blend_mode > 0.5) {
        // Subtractive / Dark Mode - make particles dark centers with bright edges
        float edge = smoothstep(0.2, 0.5, r);
        col = mix(vec3(0.0), col, edge);
        alpha *= 0.6; // reduce opacity for dark mode
    } else {
        // Additive Neon - bright glowing core
        col *= mix(2.5, 0.5, r * 2.0); // Boost brightness at center
    }
    
    if (u_glitch > 0.0) {
        if (fract(sin(v_id * 100.0 + u_time)) > 0.95) {
            col.r += u_glitch;
            col.g -= u_glitch * 0.5;
        }
    }

    if (u_blend_mode < 0.5) {
        // Premultiplied Alpha for additive blending
        gl_FragColor = vec4(col * alpha, alpha);
    } else {
        // Standard alpha for subtractive
        gl_FragColor = vec4(col, alpha);
    }
  }
`;

export default function ParticlesExperience() {
    const canvasRef = useRef(null);
    const navigate = useNavigate();
    const [config, setConfig] = useState(null);
    const [briefingDone, setBriefingDone] = useState(false);
    const idle = useIdleHide(5000);

    useEffect(() => {
        if (!config || !briefingDone) return;

        const canvas = canvasRef.current;
        const gl = canvas.getContext('webgl');
        if (!gl) return;

        // Configure blending based on blend mode
        // For particle clouds, Additive blending usually looks much better
        gl.enable(gl.BLEND);
        if (config.blendMode === 'subtractive') {
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        } else {
            gl.blendFunc(gl.ONE, gl.ONE); // Additive blending for glowing particles
        }

        // Disable depth testing to allow particles to overlap and blend color
        gl.disable(gl.DEPTH_TEST);

        let width, height;
        let animationFrameId;

        const createShader = (gl, type, source) => {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        };

        const program = gl.createProgram();
        const vs = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
        const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
        if (!vs || !fs) return;

        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        gl.useProgram(program);

        // Calculate particle count based on complexity (more complex = more particles)
        const densityMultiplier = config.complexity ? Math.floor(config.complexity) : 2;
        const NUM_PARTICLES = 10000 * densityMultiplier;

        const particleIds = new Float32Array(NUM_PARTICLES);
        for (let i = 0; i < NUM_PARTICLES; i++) particleIds[i] = i;

        const idBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, idBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, particleIds, gl.STATIC_DRAW);

        const aId = gl.getAttribLocation(program, 'a_id');
        gl.enableVertexAttribArray(aId);
        gl.vertexAttribPointer(aId, 1, gl.FLOAT, false, 0, 0);

        // Core uniforms
        const uTime = gl.getUniformLocation(program, 'u_time');
        const uRes = gl.getUniformLocation(program, 'u_resolution');
        const uSpeed = gl.getUniformLocation(program, 'u_speed');
        const uIntensity = gl.getUniformLocation(program, 'u_intensity');
        const uCol1 = gl.getUniformLocation(program, 'u_color1');
        const uCol2 = gl.getUniformLocation(program, 'u_color2');
        const uCol3 = gl.getUniformLocation(program, 'u_color3');

        // New Lobby Uniforms
        const uComplexity = gl.getUniformLocation(program, 'u_complexity');
        const uGlitch = gl.getUniformLocation(program, 'u_glitch');
        const uStardust = gl.getUniformLocation(program, 'u_stardust');
        const uCameraMode = gl.getUniformLocation(program, 'u_camera_mode');
        const uBlendMode = gl.getUniformLocation(program, 'u_blend_mode');

        const hexToRgb = (hex) => {
            const r = parseInt(hex.slice(1, 3), 16) / 255;
            const g = parseInt(hex.slice(3, 5), 16) / 255;
            const b = parseInt(hex.slice(5, 7), 16) / 255;
            return [r, g, b];
        };

        const onResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            gl.viewport(0, 0, width, height);
        };
        window.addEventListener('resize', onResize);
        onResize();

        let lastTimestamp = 0;
        let shaderTime = 0;

        const render = (timestamp) => {
            if (!lastTimestamp) lastTimestamp = timestamp;
            const deltaTime = (timestamp - lastTimestamp) * 0.001;
            lastTimestamp = timestamp;

            shaderTime += deltaTime;

            // Clear screen
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            gl.uniform1f(uTime, shaderTime);
            gl.uniform2f(uRes, width, height);
            gl.uniform1f(uSpeed, config.speed);
            gl.uniform1f(uIntensity, config.intensity);

            gl.uniform1f(uComplexity, config.complexity || 2.0);
            gl.uniform1f(uGlitch, config.glitch || 0.0);
            gl.uniform1f(uStardust, config.stardust || 0.0);

            const camModeMap = { 'cinematic': 0.0, 'freefall': 1.0, 'chaotic': 2.0 };
            gl.uniform1f(uCameraMode, camModeMap[config.cameraMode] || 0.0);

            const blendModeMap = { 'additive': 0.0, 'subtractive': 1.0 };
            gl.uniform1f(uBlendMode, blendModeMap[config.blendMode] || 0.0);

            const c1 = hexToRgb(config.palette.colors[0]);
            const c2 = hexToRgb(config.palette.colors[1]);
            const c3 = hexToRgb(config.palette.colors[2]);

            gl.uniform3f(uCol1, c1[0], c1[1], c1[2]);
            gl.uniform3f(uCol2, c2[0], c2[1], c2[2]);
            gl.uniform3f(uCol3, c3[0], c3[1], c3[2]);

            gl.drawArrays(gl.POINTS, 0, NUM_PARTICLES);
            animationFrameId = requestAnimationFrame(render);
        };
        animationFrameId = requestAnimationFrame(render);

        return () => {
            window.removeEventListener('resize', onResize);
            cancelAnimationFrame(animationFrameId);
            // Cleanup WebGL resources
            gl.deleteBuffer(idBuffer);
            gl.deleteProgram(program);
            gl.deleteShader(vs);
            gl.deleteShader(fs);
        };
    }, [config, briefingDone]);

    return (
        <div className="relative w-screen h-[100dvh] overflow-hidden bg-black selection:bg-transparent text-white">
            {!config ? (
                <ExperienceLobby
                    title="Quantum Field"
                    description="Enter the gravitational pull of a 3D strange attractor. Watch as thousands of particles weave a chaotic web of light."
                    onLaunch={(settings) => setConfig(settings)}
                    onBack={() => navigate('/')}
                />
            ) : !briefingDone ? (
                <BriefingOverlay onComplete={() => setBriefingDone(true)} />
            ) : (
                <>
                    <button
                        onClick={() => { setConfig(null); setBriefingDone(false); }}
                        className={`absolute top-6 left-6 z-50 font-mono text-xs text-white/50 hover:text-white transition-all duration-700 uppercase tracking-widest bg-black/20 hover:bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md ${idle ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                    >
                        &larr; Return to Lobby
                    </button>
                    <canvas ref={canvasRef} className="w-full h-full block filter contrast-[1.4] saturate-[1.6]"></canvas>
                    <div className="pointer-events-none fixed inset-0 z-40 opacity-[0.05] contrast-150 brightness-150">
                        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                            <filter id="noiseFilter">
                                <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                            </filter>
                            <rect width="100%" height="100%" filter="url(#noiseFilter)" />
                        </svg>
                    </div>
                </>
            )}
        </div>
    );
}
