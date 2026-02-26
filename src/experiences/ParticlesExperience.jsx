import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ExperienceLobby from '../components/ExperienceLobby';

const VERTEX_SHADER = `
  attribute float a_id;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform float u_speed;
  uniform float u_intensity;
  varying vec3 v_color;
  varying float v_opacity;

  // Lorenz Attractor Constants
  const float sigma = 10.0;
  const float rho = 28.0;
  const float beta = 8.0 / 3.0;

  void main() {
    float t = u_time * 0.5 * u_speed;
    float id_seed = a_id * 0.1337;
    
    // Create a chaotic orbit based on ID and time
    float r = 20.0 + sin(id_seed * 0.5) * 10.0;
    float angle = id_seed + t * (0.5 + fract(sin(id_seed) * 43758.5453) * 0.5);
    
    vec3 p;
    p.x = cos(angle) * r;
    p.y = sin(angle * 0.7) * r * 0.5;
    p.z = sin(angle) * r;
    
    // Add chaotic noise/storm effect
    p.x += sin(t + id_seed * 2.1) * 5.0 * u_intensity;
    p.y += cos(t * 1.3 + id_seed * 1.7) * 5.0 * u_intensity;
    p.z += sin(t * 1.8 + id_seed * 3.1) * 5.0 * u_intensity;

    // Project 3D to 2D
    float scale = 0.02 * (1.0 + u_intensity * 0.5);
    vec2 pos = p.xy * scale;
    pos.x *= u_resolution.y / u_resolution.x;
    
    // Depth effect
    float depth = p.z * 0.05;
    gl_Position = vec4(pos, 0.0, 1.0 + depth);
    gl_PointSize = (6.0 / (1.0 + depth)) * (0.5 + u_intensity);
    
    v_opacity = smoothstep(2.0, -1.0, depth) * 0.8;
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform vec3 u_color3;
  uniform float u_time;
  varying float v_opacity;

  vec3 palette(float t) {
    t = fract(t + u_time * 0.05);
    if (t < 0.33) return mix(u_color1, u_color2, t * 3.0);
    if (t < 0.66) return mix(u_color2, u_color3, (t - 0.33) * 3.0);
    return mix(u_color3, u_color1, (t - 0.66) * 3.0);
  }

  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    
    vec3 col = palette(v_opacity);
    float alpha = smoothstep(0.5, 0.0, r) * v_opacity;
    
    gl_FragColor = vec4(col, alpha);
  }
`;

export default function ParticlesExperience() {
    const canvasRef = useRef(null);
    const navigate = useNavigate();
    const [config, setConfig] = useState(null);

    useEffect(() => {
        if (!config) return;

        const canvas = canvasRef.current;
        const gl = canvas.getContext('webgl');
        if (!gl) return;

        // Enable Alpha Blending
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

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
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        gl.useProgram(program);

        // Create particles data
        const NUM_PARTICLES = 15000;
        const particleIds = new Float32Array(NUM_PARTICLES);
        for (let i = 0; i < NUM_PARTICLES; i++) particleIds[i] = i;

        const idBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, idBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, particleIds, gl.STATIC_DRAW);

        const aId = gl.getAttribLocation(program, 'a_id');
        gl.enableVertexAttribArray(aId);
        gl.vertexAttribPointer(aId, 1, gl.FLOAT, false, 0, 0);

        const uTime = gl.getUniformLocation(program, 'u_time');
        const uRes = gl.getUniformLocation(program, 'u_resolution');
        const uSpeed = gl.getUniformLocation(program, 'u_speed');
        const uIntensity = gl.getUniformLocation(program, 'u_intensity');
        const uCol1 = gl.getUniformLocation(program, 'u_color1');
        const uCol2 = gl.getUniformLocation(program, 'u_color2');
        const uCol3 = gl.getUniformLocation(program, 'u_color3');

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

            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.uniform1f(uTime, shaderTime);
            gl.uniform2f(uRes, width, height);
            gl.uniform1f(uSpeed, config.speed);
            gl.uniform1f(uIntensity, config.intensity);

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
        };
    }, [config]);

    return (
        <div className="relative w-screen h-[100dvh] overflow-hidden bg-black selection:bg-transparent text-white">
            {!config ? (
                <ExperienceLobby
                    title="Kinetic Storm"
                    description="Enter the gravitational pull of a 3D strange attractor. Watch as thousands of particles weave a chaotic web of light."
                    onLaunch={(settings) => setConfig(settings)}
                    onBack={() => navigate('/')}
                />
            ) : (
                <>
                    <button
                        onClick={() => setConfig(null)}
                        className="absolute top-6 left-6 z-50 font-mono text-xs text-white/50 hover:text-white transition-colors uppercase tracking-widest bg-black/20 hover:bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md"
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
