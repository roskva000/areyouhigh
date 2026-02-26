import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ExperienceLobby from '../components/ExperienceLobby';
import BriefingOverlay from '../components/BriefingOverlay';
import useIdleHide from '../hooks/useIdleHide';

const VERTEX_SHADER = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform vec3 u_color3;
  uniform float u_speed;
  uniform float u_intensity;

  // NEW LOBBY UNIFORMS
  uniform float u_complexity;
  uniform float u_glitch;
  uniform float u_stardust;
  uniform float u_camera_mode;
  uniform float u_blend_mode;

  mat2 rot(float a) {
      float s = sin(a), c = cos(a);
      return mat2(c, -s, s, c);
  }

  vec3 palette(float t) {
      t = fract(t);
      if (t < 0.33) return mix(u_color1, u_color2, smoothstep(0.0, 0.33, t));
      if (t < 0.66) return mix(u_color2, u_color3, smoothstep(0.33, 0.66, t));
      return mix(u_color3, u_color1, smoothstep(0.66, 1.0, t));
  }

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

  // Simplex noise (2D)
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // Fractional Brownian Motion
  float fbm(vec2 p) {
      float f = 0.0;
      float amp = 0.5;
      float freq = 1.0;
      float iters = 4.0 + floor(u_complexity); // Scales with lobby complexity
      for(float i=0.0; i<12.0; i++) {
          if(i>=iters) break;
          f += amp * snoise(p * freq);
          p *= rot(1.1);
          freq *= 2.0;
          amp *= 0.5;
      }
      return f;
  }

  void main() {
      vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
      
      float t = u_time * u_speed * 0.5;

      // Glitch distortion
      if (u_glitch > 0.0) {
          if (hash(uv * u_time) < u_glitch * 0.05) {
              uv.x += (hash(uv.yy * 20.0 + u_time) - 0.5) * u_glitch * 0.2;
          }
      }

      // Camera Modes
      if (u_camera_mode > 0.5 && u_camera_mode < 1.5) {
          // Free fall - gentle zoom pulse
          uv *= 1.0 / (1.0 + mod(t*0.15, 2.0));
      } else if (u_camera_mode > 1.5) {
          // Chaotic - swirling
          uv *= rot(sin(t)*0.5);
          uv *= 1.0 + sin(t*2.0)*0.2;
      } else {
          // Cinematic - simple rotation
          uv *= rot(t * 0.1);
          uv *= 1.2;
      }

      // Domain Warping for Liquid Chrome
      vec2 q = vec2(fbm(uv + vec2(0.0, t*0.2)), fbm(uv + vec2(5.2, 1.3 - t*0.2)));
      vec2 r = vec2(fbm(uv + 4.0*q + vec2(1.7, 9.2) + t*0.5), 
                    fbm(uv + 4.0*q + vec2(8.3, 2.8) - t*1.2));
      
      // Calculate normal from height map for fake 3D lighting
      float h = fbm(uv + r * u_intensity * 2.0);
      float e = 0.005;
      float hx = fbm(uv + vec2(e,0) + r * u_intensity * 2.0);
      float hy = fbm(uv + vec2(0,e) + r * u_intensity * 2.0);
      vec3 n = normalize(vec3(hx-h, hy-h, e*8.0));
      
      // Lighting
      vec3 lightVec = normalize(vec3(1.0, 1.0, 2.0));
      float dif = clamp(dot(n, lightVec), 0.0, 1.0);
      float spec = pow(clamp(dot(reflect(-lightVec, n), vec3(0,0,1)), 0.0, 1.0), 32.0);
      
      vec3 baseCol = palette(h + t*0.2 + length(q));
      
      vec3 col = vec3(0.0);
      
      if (u_blend_mode < 0.5) {
          // Additive Neon Mode
          col = baseCol * dif * 1.5 + vec3(spec)*u_intensity;
          col += baseCol * h * u_intensity * 1.5; // Emissive liquid core
      } else {
          // Subtractive Dark Chrome Mode
          col = baseCol * dif * 0.8 + vec3(spec)*u_intensity;
          float shadow = smoothstep(0.0, 0.5, h);
          col *= mix(0.1, 1.0, shadow);
      }

      // Stardust Overlay
      if (u_stardust > 0.0) {
          float dust = hash(uv * 100.0 + t);
          if (dust > 0.99 - u_stardust * 0.01) {
              col += vec3(sin(t * 20.0 + dust*100.0)*0.5+0.5) * u_stardust * 2.0 * palette(dust);
          }
      }

      // RGB Separation
      if (u_glitch > 0.0 && hash(uv + u_time) > 0.9) {
          col.r += hash(uv.yx * 15.0) * u_glitch;
          col.b += hash(uv.xy * 17.0) * u_glitch;
      }

      // Tone mapping
      col = col / (1.0 + col);
      col = pow(col, vec3(0.4545));
      
      gl_FragColor = vec4(col, 1.0);
  }
`;

export default function FluidExperience() {
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

        const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const pos = gl.getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(pos);
        gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

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

            gl.uniform1f(uTime, shaderTime);
            gl.uniform2f(uRes, width, height);
            gl.uniform1f(uSpeed, config.speed);
            gl.uniform1f(uIntensity, config.intensity);

            // Lobby Parameter Mappings
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

            gl.drawArrays(gl.TRIANGLES, 0, 6);
            animationFrameId = requestAnimationFrame(render);
        };
        animationFrameId = requestAnimationFrame(render);

        return () => {
            window.removeEventListener('resize', onResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [config, briefingDone]);

    return (
        <div className="relative w-screen h-[100dvh] overflow-hidden bg-black selection:bg-transparent text-white">
            {!config ? (
                <ExperienceLobby
                    title="Liquid Chrome"
                    description="Dive into metallic fluid dynamics. Multi-scale domain warping creates an impossible ocean of liquid color and geometry."
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
                    <canvas ref={canvasRef} className="w-full h-full block filter saturate-150 contrast-[1.15]"></canvas>
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
