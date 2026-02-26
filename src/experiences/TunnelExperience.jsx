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
  #define MAX_DIST 40.0
  #define SURF_DIST 0.005

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

  float sdBox(vec3 p, vec3 b) {
      vec3 q = abs(p) - b;
      return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
  }

  // 3D Cyberpunk Tunnel
  vec2 map(vec3 p) {
      vec3 q = p;
      float t = u_time * u_speed;
      
      // Twist
      q.xy *= rot(q.z * 0.05 * u_intensity + t * 0.2);
      
      // Repetition along Z for tunnel panels
      q.z = mod(q.z, 2.0) - 1.0;
      
      // Base Octagon Tunnel
      float tunnel = length(max(abs(q.xy) - vec2(2.5), 0.0)) - 0.5;
      tunnel = max(tunnel, -length(q.xy) + 2.0); // inner carve
  
      float iters = floor(u_complexity);
      
      // Fractal sci-fi panelling (driven by complexity)
      float d = tunnel;
      if (u_complexity > 1.0) {
          vec3 p2 = q;
          for (float i = 0.0; i < 4.0; i++) {
              if (i >= iters) break;
              p2.xy = abs(p2.xy) - 0.5;
              p2.xy *= rot(0.785398); // 45 degrees
              float panel = sdBox(p2, vec3(0.2, 0.2, 1.5));
              d = max(d, -panel);
          }
      }
      
      // Neon Rings
      vec3 pRings = p;
      pRings.z = mod(pRings.z, 4.0) - 2.0;
      float rings = length(vec2(length(pRings.xy) - 2.2, pRings.z)) - 0.05;
      
      float matID = d < rings ? 1.0 : 2.0; // 1: walls, 2: neon rings
      float minDist = min(d, rings);
  
      return vec2(minDist, matID);
  }

  float GetDist(vec3 p) { return map(p).x; }

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

  float hash(vec2 p) { return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5); }
  float rand(float n){return fract(sin(n) * 43758.5);}

  void main() {
      vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
      
      float t = u_time * u_speed * 0.5;

      // Glitch Screen Distortion
      if (u_glitch > 0.0) {
          if (hash(uv * u_time) < u_glitch * 0.05) {
              uv.x += (rand(uv.y * 20.0 + u_time) - 0.5) * u_glitch * 0.2;
          }
      }

      vec3 ro, rd;

      if (u_camera_mode < 0.5) {
          // Cinematic Pan
          ro = vec3(sin(t)*0.5, cos(t*0.7)*0.5, t * 5.0);
          rd = normalize(vec3(uv, 1.5));
          rd.xy *= rot(sin(t*0.5)*0.2);
      } else if (u_camera_mode < 1.5) {
          // Fast flying / Free flow (slowed down)
          ro = vec3(0.0, 0.0, t * 4.0);
          rd = normalize(vec3(uv, 1.2));
          rd.xy *= rot(t*0.3);
      } else {
          // Chaotic Orbit/Bouncy (calmer)
          ro = vec3(sin(t*1.5)*1.0, cos(t*1.0)*1.0, t * 5.0);
          rd = normalize(vec3(uv, 1.2));
          rd.xy *= rot(sin(t*2.0)*0.3);
      }

      float dO = 0.0;
      vec2 dS;
      vec3 p;
      float min_ring_dist = 1000.0;
      
      // Raymarching Loop
      for(int i=0; i<MAX_STEPS; i++) {
          p = ro + rd * dO;
          dS = map(p);
          if (dS.y == 2.0) min_ring_dist = min(min_ring_dist, dS.x);
          dO += dS.x;
          if(dO > MAX_DIST || abs(dS.x) < SURF_DIST) break;
      }

      vec3 col = vec3(0.0);
      
      if(dO < MAX_DIST) {
          vec3 n = GetNormal(p);
          vec3 l = normalize(vec3(0.0, 0.0, 1.0)); // Light points down the tunnel
          
          float dif = clamp(dot(n, l), 0.0, 1.0);
          float ao = clamp(1.0 - dO/MAX_DIST, 0.0, 1.0);
          
          vec3 texCol = palette(p.z * 0.2 + t);
          
          if (dS.y == 2.0) {
              // Neon Rings
              col = texCol * u_intensity * 3.0; // Emissive
          } else {
              // Structural Walls
              if (u_blend_mode < 0.5) {
                  // Additive Neon System
                  col = texCol * dif * ao * u_intensity;
                  col += vec3(0.1) * max(0.0, dot(n, normalize(ro - p))); // Rim light
              } else {
                  // Subtractive Dark Metallic
                  col = texCol * dif * ao * u_intensity * 0.3;
                  col = mix(col, vec3(0.0), 1.0 - dif);
              }
          }
      }
      
      // Add volumetric glow for neon rings (Fake Subsurface / Scatter)
      float ringGlow = clamp(1.0 - min_ring_dist * 1.5, 0.0, 1.0);
      col += palette(dO * 0.1) * pow(ringGlow, 3.0) * u_intensity;

      // Depth Fog / Doppler Light Shift
      float fog = 1.0 - exp(-dO * 0.06);
      vec3 fogColor = palette(t * 2.0); // Colors shift fast indicating high speed
      col = mix(col, fogColor * (u_blend_mode < 0.5 ? 0.3 : 0.05), fog);

      // Cyber Stardust Overlay (Data particles rushing by)
      if (u_stardust > 0.0) {
          vec3 sp = ro + rd * (dO < MAX_DIST ? dO * 0.5 : MAX_DIST);
          float dust = hash(sp.xy * 10.0 + sp.z * 2.0);
          if (dust > 0.98 - u_stardust * 0.02) {
              col += palette(dust * 10.0) * vec3(1.0) * u_stardust * 2.5;
          }
      }

      // RGB Separation Glitch
      if (u_glitch > 0.0 && hash(uv + u_time) > 0.9) {
          col.r += rand(uv.y * 10.0) * u_glitch * 1.5;
          col.b += rand(uv.x * 12.0) * u_glitch * 1.5;
      }

      // Tone mapping
      col = col / (1.0 + col);
      col = pow(col, vec3(0.4545));
      
      gl_FragColor = vec4(col, 1.0);
  }
`;

export default function TunnelExperience() {
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
                    title="Hyper-Space Tunnel"
                    description="A volumetric journey through the architecture of the void. Experience the geometry of a limitless dimension."
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
                    <canvas ref={canvasRef} className="w-full h-full block filter contrast-[1.2] brightness-[1.1]"></canvas>
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
