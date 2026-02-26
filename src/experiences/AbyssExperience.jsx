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

  #define MAX_STEPS 80
  #define MAX_DIST 15.0
  #define SURF_DIST 0.002

  // Palette
  vec3 palette(float t) {
      t = fract(t + u_time * 0.05 * u_speed);
      if (t < 0.33) return mix(u_color1, u_color2, smoothstep(0.0, 0.33, t));
      if (t < 0.66) return mix(u_color2, u_color3, smoothstep(0.33, 0.66, t));
      return mix(u_color3, u_color1, smoothstep(0.66, 1.0, t));
  }

  // Mandelbulb Distance Estimator
  vec2 opMandelbulb(vec3 p) {
      vec3 z = p;
      float dr = 1.0;
      float r = 0.0;
      float iters = 0.0;
      // Complexity controls the power of the bulb
      float power = 3.0 + u_complexity * 2.0 + sin(u_time * 0.1 * u_speed) * 1.5;

      for (int i = 0; i < 12; i++) {
          r = length(z);
          if (r > 2.0) break;
          
          float theta = acos(z.z/r);
          float phi = atan(z.y, z.x);
          dr = pow(r, power-1.0)*power*dr + 1.0;
          
          float zr = pow(r, power);
          theta = theta*power;
          phi = phi*power;
          
          z = zr*vec3(sin(theta)*cos(phi), sin(phi)*sin(theta), cos(theta));
          z += p;
          iters++;
      }
      return vec2(0.5*log(r)*r/dr, iters);
  }

  float GetDist(vec3 p) {
      return opMandelbulb(p).x;
  }

  vec3 GetNormal(vec3 p) {
      float d = GetDist(p);
      vec2 e = vec2(0.005, 0);
      vec3 n = d - vec3(
          GetDist(p-e.xyy),
          GetDist(p-e.yxy),
          GetDist(p-e.yyx)
      );
      return normalize(n);
  }

  float hash(vec2 p) { return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123); }
  float rand(float n){return fract(sin(n) * 43758.5453123);}

  void main() {
      // Glitch Screen Space Distortion
      vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
      
      if (u_glitch > 0.0) {
          if (hash(uv * u_time) < u_glitch * 0.05) {
              uv.x += (rand(uv.y * 20.0 + u_time) - 0.5) * u_glitch * 0.2;
          }
      }

      // Camera Setup
      vec3 ro, rd;
      float t = u_time * u_speed * 0.5;
      
      if (u_camera_mode < 0.5) {
          // Cinematic Pan
          ro = vec3(1.8 * sin(t*0.5), 1.2 * cos(t*0.3), -2.5 + sin(t*0.2));
          vec3 lookat = vec3(0.0);
          vec3 f = normalize(lookat - ro);
          vec3 r = normalize(cross(vec3(0,1,0), f));
          vec3 u = cross(f, r);
          rd = normalize(uv.x * r + uv.y * u + f * 1.5);
      } else if (u_camera_mode < 1.5) {
          // Free Fall (slowed down)
          ro = vec3(0.0, 0.0, 3.0 - t * 0.5);
          ro.z = mod(ro.z + 6.0, 12.0) - 6.0;
          rd = normalize(vec3(uv, -1.5));
          float angle = t * 0.2;
          mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
          rd.xy *= rot;
          ro.xy *= rot;
      } else {
          // Chaotic Orbit
          ro = vec3(sin(t*1.5)*2.0, cos(t*1.7)*2.0, sin(t*0.9)*2.5);
          vec3 lookat = vec3(sin(t*2.0)*0.5, cos(t*1.2)*0.5, 0.0);
          vec3 f = normalize(lookat - ro);
          vec3 r = normalize(cross(vec3(0,1,0), f));
          vec3 u = cross(f, r);
          rd = normalize(uv.x * r + uv.y * u + f * mix(0.8, 1.8, sin(t*3.0)*0.5+0.5));
      }

      // Raymarching Loop
      float dO = 0.0;
      float iters = 0.0;
      vec3 p;
      for(int i=0; i<MAX_STEPS; i++) {
          p = ro + rd * dO;
          vec2 dS = opMandelbulb(p);
          dO += dS.x;
          iters = dS.y;
          if(dO > MAX_DIST || dS.x < SURF_DIST) break;
      }

      vec3 col = vec3(0.0);
      
      if(dO < MAX_DIST) {
          vec3 n = GetNormal(p);
          vec3 l = normalize(vec3(1.0, 1.0, -1.0));
          
          float dif = clamp(dot(n, l), 0.0, 1.0);
          float ao = clamp(1.0 - iters/20.0, 0.0, 1.0);
          
          vec3 baseColor = palette(length(p) * 0.4 + iters*0.08);
          
          if (u_blend_mode < 0.5) {
              // Neon Additive
              col = baseColor * dif * ao * u_intensity * 1.5;
              col += baseColor * pow(iters/12.0, 2.0) * u_intensity * 1.2; // Glowing crevices
          } else {
              // Dark Subtractive
              col = baseColor * dif * ao * u_intensity * 0.8;
              col = mix(col, vec3(0.0), iters/15.0); // Shadowed depths
          }
      } else {
          col = u_blend_mode < 0.5 ? vec3(0.02) : vec3(0.05); // Background
      }
      
      // Stardust Overlay
      if (u_stardust > 0.0) {
          vec3 sp = ro + rd * (dO < MAX_DIST ? dO * 0.5 : 5.0);
          float dust = fract(sin(dot(floor(sp*10.0), vec3(12.9898, 78.233, 45.164))) * 43758.5453);
          if (dust > 0.99 - (u_stardust * 0.05)) {
              float starIntensity = sin(u_time * 10.0 * u_speed + dust * 100.0) * 0.5 + 0.5;
              col += vec3(starIntensity) * u_stardust * palette(dust);
          }
      }

      // RGB Glitch / Chromatic Aberration
      if (u_glitch > 0.0 && hash(uv + u_time) > 0.9) {
          col.r += rand(uv.y * 10.0) * u_glitch * 2.0;
          col.b += rand(uv.y * 12.0) * u_glitch * 2.0;
      }

      // Fog & Depth
      col = mix(col, vec3(0.0), 1.0 - exp(-0.05 * dO * dO));

      // Tone mapping & Gamma
      col = col / (1.0 + col);
      col = pow(col, vec3(0.4545)); 
      
      gl_FragColor = vec4(col, 1.0);
  }
`;

export default function AbyssExperience() {
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

        // Hex to RGB
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
                    title="The Abyss"
                    description="Dive into the infinite depth of the Mandelbrot set. A journey through mathematical beauty and crystalline complexity."
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

                    <canvas ref={canvasRef} className="w-full h-full block filter saturate-150 contrast-125"></canvas>

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
