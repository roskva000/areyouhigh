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

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  void main() {
      vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
      vec2 uv0 = uv; // Original UV for distance fading
      
      float t = u_time * u_speed * 0.2;
      
      // Glitch Screen Distortion
      if (u_glitch > 0.0) {
          if (hash(uv * t) < u_glitch * 0.05) {
              uv.x += (hash(uv.yy * 20.0 + t) - 0.5) * u_glitch * 0.1;
          }
      }

      // Camera Handling
      if (u_camera_mode < 0.5) {
          // Cinematic pan & zoom
          uv *= 1.5 + sin(t)*0.2;
          uv *= rot(t*0.5);
      } else if (u_camera_mode < 1.5) {
          // Freefall / smooth infinite zoom
          uv *= mix(0.5, 1.5, fract(t * 0.15));
          uv *= rot(t*0.3);
      } else {
          // Chaotic
          uv *= rot(sin(t*2.0));
          uv.x += sin(t)*0.2;
          uv.y += cos(t*1.3)*0.2;
      }
      
      vec3 finalColor = vec3(0.0);
      float iters = 2.0 + floor(u_complexity); // 2 to 6 iterations
      
      // Kaleidoscopic Fractal loop
      for (float i = 0.0; i < 6.0; i++) {
          if (i >= iters) break;
          
          uv = fract(uv * 1.5) - 0.5;
          
          // Kaleidoscopic folding
          float angle = atan(uv.y, uv.x);
          float r = length(uv);
          
          // Segments based on complexity
          float segments = 6.0 + floor(u_complexity) * 2.0; 
          angle = mod(angle, 6.28318 / segments);
          angle = abs(angle - 3.14159 / segments);
          
          uv = r * vec2(cos(angle), sin(angle));
          
          float d = length(uv) * exp(-length(uv0));
          vec3 col = palette(length(uv0) + i * 0.4 + t * 2.0);
          
          d = sin(d * 8.0 + t * 5.0) / 8.0;
          d = abs(d);
          d = pow(0.01 / max(d, 0.001), 1.2) * u_intensity;
          
          if (u_blend_mode < 0.5) {
              // Additive glowing contours
              finalColor += col * d; 
          } else {
              // Subtractive / Dark Geometry
              finalColor += col * d * 0.5;
              finalColor = mix(finalColor, vec3(0.0), smoothstep(0.0, 0.5, length(uv)));
          }
      }

      // Stardust Overlay (Floating particles)
      if (u_stardust > 0.0) {
          float dust = hash(uv0 * 100.0 + t);
          if (dust > 0.98 - u_stardust * 0.02) {
              finalColor += vec3(1.0) * u_stardust * 2.0 * palette(dust);
          }
      }
      
      // RGB Separation Glitch
      if (u_glitch > 0.0 && hash(uv0 + u_time) > 0.95) {
          finalColor.r += u_glitch * 0.5;
          finalColor.b -= u_glitch * 0.5;
      }

      // Vignette
      finalColor *= smoothstep(1.5, 0.1, length(uv0));

      // Tone mapping
      finalColor = finalColor / (1.0 + finalColor);
      finalColor = pow(finalColor, vec3(0.4545));
      
      gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export default function MandalaExperience() {
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
                    title="Infinite Kaleidoscope"
                    description="Lose yourself in the geometry of the mind. An asymmetrical, infinitely repeating neon mandala that responds to your choices."
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
                    <canvas ref={canvasRef} className="w-full h-full block filter contrast-[1.3] saturate-[1.4]"></canvas>
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
