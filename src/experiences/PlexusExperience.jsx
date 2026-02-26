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

  vec2 hash22(vec2 p) {
      p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)));
      return fract(sin(p)*43758.5453);
  }

  // 2D Cellular noise for Plexus web / Neural Network
  vec2 voronoi(vec2 x, float t) {
      vec2 n = floor(x);
      vec2 f = fract(x);
      vec2 mg, mr;

      float md = 8.0;
      for (int j=-1; j<=1; j++) {
          for (int i=-1; i<=1; i++) {
              vec2 g = vec2(float(i),float(j));
              vec2 o = hash22(n + g);
              o = 0.5 + 0.5*sin(t + 6.2831*o); // animate nodes
              vec2 r = g + o - f;
              float d = dot(r,r);
              if (d < md) {
                  md = d;
                  mr = r;
                  mg = g;
              }
          }
      }

      // Edge distance calculation (Creates the lines!)
      md = 8.0;
      for (int j=-2; j<=2; j++) {
          for (int i=-2; i<=2; i++) {
              vec2 g = mg + vec2(float(i),float(j));
              vec2 o = hash22(n + g);
              o = 0.5 + 0.5*sin(t + 6.2831*o);
              vec2 r = g + o - f;
              if (dot(mr-r,mr-r)>0.00001) {
                  md = min(md, dot( 0.5*(mr+r), normalize(r-mr) ));
              }
          }
      }
      return vec2(md, length(mr)); // x = edge distance, y = node distance
  }

  void main() {
      vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
      
      float t = u_time * u_speed * 0.5;

      // Glitch Distortion
      if (u_glitch > 0.0) {
          if (fract(sin(dot(uv, vec2(12.9898, 78.233)) + t)*43758.5453) < u_glitch * 0.05) {
              uv.y += (fract(sin(uv.x*20.0+t)) - 0.5) * u_glitch * 0.2;
          }
      }

      // Camera Handling
      float zoom = 1.0;
      vec2 pan = vec2(0.0);

      if (u_camera_mode < 0.5) {
          // Cinematic pan and slow zoom
          uv *= rot(t*0.1);
          zoom = 1.0 + sin(t*0.3)*0.2;
          pan = vec2(sin(t*0.2), cos(t*0.15)) * 0.5;
      } else if (u_camera_mode < 1.5) {
          // Free fall - gentle depth zoom
          uv *= rot(t*0.2);
          zoom = 0.5 + fract(t*0.08)*2.5; 
      } else {
          // Chaotic
          uv *= rot(sin(t)*1.5);
          zoom = 1.0 + sin(t*2.0)*0.5;
          pan = vec2(hash22(vec2(floor(t))), hash22(vec2(floor(t*1.2)))) * 0.2;
      }
      
      uv *= zoom;
      uv += pan;

      // Layered Voronoi for Plexus with Depth
      vec3 col = vec3(0.0);
      float layers = 2.0 + floor(u_complexity); // Scales from 2 to 6 layers
      
      for(float i=1.0; i<=6.0; i++) {
          if (i > layers) break;
          
          float scale = i * 2.5; 
          
          // Parallax effect per layer
          vec2 layerPan = pan * (i * 0.5); 
          vec2 v = voronoi((uv + layerPan) * scale, t * (1.0 + i*0.2));
          
          float edgeDist = v.x;
          float nodeDist = v.y;
          
          // Lines (Edges)
          float lineT = 0.012 / max(edgeDist, 0.001) * u_intensity;
          lineT = smoothstep(0.0, 1.0, lineT);
          
          // Nodes (Points)
          float nodeT = 0.02 / max(nodeDist, 0.001) * u_intensity;
          nodeT = pow(nodeT, 2.0); // Make glowing core intense
          
          vec3 layerCol = palette(i * 0.15 + t * 0.1);
          
          float depthFade = 1.0 / (i * 0.8); // far layers are dimmer and blurrier
          
          if (u_blend_mode < 0.5) {
              // Additive Neon System - Glowing web
              col += layerCol * lineT * depthFade;
              col += layerCol * nodeT * depthFade * 1.5;
              
              // Light connections
              col += layerCol * pow(1.0 - edgeDist, 8.0) * 0.2 * depthFade;
          } else {
              // Subtractive / Neural Dark Mode - dark lines over inverted colors
              vec3 darkBlood = layerCol * 0.4;
              col += darkBlood * lineT * depthFade;
              col = mix(col, vec3(0.0), nodeT * depthFade * 0.5); // Nodes carve out black spots
          }
      }
      
      // Stardust Overlay (Floating data packets)
      if (u_stardust > 0.0) {
          float dust = fract(sin(dot(uv*200.0, vec2(12.9, 78.2)))*43758.5);
          if (dust > 0.99 - u_stardust * 0.01) {
              col += palette(dust*10.0) * mix(0.5, 2.0, u_stardust) * (sin(t*10.0+dust*100.0)*0.5+0.5);
          }
      }

      // RGB Separation Glitch
      if (u_glitch > 0.0 && fract(sin(uv.y*10.0+t)*43758.5) > 0.95) {
          col.b += u_glitch * 0.5;
          col.r -= u_glitch * 0.2;
      }

      // Vignette
      col *= smoothstep(1.8, 0.1, length(uv/zoom - pan)); 

      // Tone mapping
      col = col / (1.0 + col);
      col = pow(col, vec3(0.4545));
      
      gl_FragColor = vec4(col, 1.0);
  }
`;

export default function PlexusExperience() {
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
                    title="Neural Plexus"
                    description="Visualize the interconnected web of thought and data. A multi-layered cellular network of glowing nodes and geometric bonds."
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
                    <canvas ref={canvasRef} className="w-full h-full block filter contrast-[1.25] saturate-[1.3]"></canvas>
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
