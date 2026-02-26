import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ExperienceLobby from '../components/ExperienceLobby';

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

  vec2 c_mul(vec2 a, vec2 b) {
    return vec2(a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x);
  }

  vec3 palette(float t) {
    t = fract(t + u_time * 0.02);
    if (t < 0.33) return mix(u_color1, u_color2, t * 3.0);
    if (t < 0.66) return mix(u_color2, u_color3, (t - 0.33) * 3.0);
    return mix(u_color3, u_color1, (t - 0.66) * 3.0);
  }

  vec3 get_mandelbrot_color(vec2 uv, float zoom) {
    vec2 target = vec2(-0.743643887, 0.131825904);
    vec2 c = uv * zoom + target;

    vec2 z = vec2(0.0);
    float iterations = 0.0;
    const float max_iters = 150.0;
    
    for (float i = 0.0; i < max_iters; i++) {
        z = c_mul(z, z) + c;
        if (dot(z, z) > 128.0) break;
        iterations++;
    }
    
    if (iterations == max_iters) return vec3(0.0);

    float smooth_it = iterations - log2(max(1.0, log2(dot(z,z)))) + 4.0;
    vec3 col = palette(smooth_it * 0.02 * u_intensity + u_time * 0.05);
    
    // High-frequency details/veins
    float veins = sin(smooth_it * 0.5 * u_intensity - u_time) * 0.5 + 0.5;
    col += veins * 0.15 * palette(smooth_it * 0.1);

    return col;
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
    
    // Slight swirl rotation over time
    float angle = u_time * 0.05 * u_speed;
    float s = sin(angle), c = cos(angle);
    uv *= mat2(c, -s, s, c);

    // Depth distortion
    float r = length(uv);
    uv *= (1.0 + r * r * 0.2 * u_intensity); 

    float time = u_time * 0.2 * u_speed;

    // SEAMLESS ZOOM
    float cycle = 4.0;
    float t1 = mod(time, cycle);
    float t2 = mod(time + cycle * 0.5, cycle);
    
    float zoom1 = exp(-2.0 - t1 * 3.5);
    float zoom2 = exp(-2.0 - t2 * 3.5);
    
    float w = abs(t1 - cycle * 0.5) / (cycle * 0.5);
    w = smoothstep(0.0, 1.0, w);
    
    vec3 col1 = get_mandelbrot_color(uv, zoom1);
    vec3 col2 = get_mandelbrot_color(uv, zoom2);
    
    vec3 col = mix(col1, col2, w);

    col *= smoothstep(1.8, 0.4, length(uv)); // Vignette
    col = pow(col, vec3(0.85)); // Contrast
    
    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function AbyssExperience() {
    const canvasRef = useRef(null);
    const navigate = useNavigate();
    const [config, setConfig] = useState(null);

    useEffect(() => {
        if (!config) return;

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

        const uTime = gl.getUniformLocation(program, 'u_time');
        const uRes = gl.getUniformLocation(program, 'u_resolution');
        const uSpeed = gl.getUniformLocation(program, 'u_speed');
        const uIntensity = gl.getUniformLocation(program, 'u_intensity');
        const uCol1 = gl.getUniformLocation(program, 'u_color1');
        const uCol2 = gl.getUniformLocation(program, 'u_color2');
        const uCol3 = gl.getUniformLocation(program, 'u_color3');

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
    }, [config]);

    return (
        <div className="relative w-screen h-[100dvh] overflow-hidden bg-black selection:bg-transparent text-white">
            {!config ? (
                <ExperienceLobby
                    title="The Abyss"
                    description="Dive into the infinite depth of the Mandelbrot set. A journey through mathematical beauty and crystalline complexity."
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

                    <canvas ref={canvasRef} className="w-full h-full block filter saturate-150 contrast-125"></canvas>

                    {/* Cinematic Noise */}
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
