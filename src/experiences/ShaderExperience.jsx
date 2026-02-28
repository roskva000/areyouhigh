import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ExperienceLobby from '../components/ExperienceLobby';
import BriefingOverlay from '../components/BriefingOverlay';
import useIdleHide from '../hooks/useIdleHide';
import { EXPERIENCES } from '../data/experiences';
import { MASTER_SHADERS } from '../data/shaders';
import SEO from '../components/SEO';

// Standard Quad Vertex Shader
const QUAD_VERTEX_SHADER = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

export default function ShaderExperience() {
    const { id } = useParams();
    const canvasRef = useRef(null);
    const navigate = useNavigate();
    const [config, setConfig] = useState(null); // 'config' implies the lobby settings
    const [briefingDone, setBriefingDone] = useState(false);
    const [shaderError, setShaderError] = useState(false); // Controls overlay
    const { idle } = useIdleHide(5000);

    const expData = EXPERIENCES.find(e => e.id === id);
    const mode = expData?.mode || 'quad'; // 'quad' (default) or 'points'

    // Smart Shader Resolution
    let shaderSource = null;
    let vertexSource = null;

    if (expData) {
        if (mode === 'points') {
            if (expData.master === 'special_particles') {
                vertexSource = MASTER_SHADERS['special_particles_vertex'];
                shaderSource = MASTER_SHADERS['special_particles_fragment'];
            } else {
                vertexSource = MASTER_SHADERS[expData.master + '_vertex'] || QUAD_VERTEX_SHADER;
                shaderSource = MASTER_SHADERS[expData.master + '_fragment'] || MASTER_SHADERS['abstract'];
            }
        } else {
            vertexSource = QUAD_VERTEX_SHADER;
            shaderSource = MASTER_SHADERS[expData.master] || MASTER_SHADERS['abstract_kaleido'];
        }
    }

    useEffect(() => {
        // Only run WebGL setup if we have config (Lobby submitted) AND briefing is done
        if (!config || !briefingDone || !expData || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const gl = canvas.getContext('webgl');
        if (!gl) return;

        // --- WEBGL SETUP ---
        if (mode === 'points') {
            gl.enable(gl.BLEND);
            const blendMode = config.blendMode || 'additive';
            if (blendMode === 'subtractive') {
                gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            } else {
                gl.blendFunc(gl.ONE, gl.ONE);
            }
            gl.disable(gl.DEPTH_TEST);
        } else {
            gl.disable(gl.BLEND);
            gl.disable(gl.DEPTH_TEST);
        }

        let width, height;
        let animationFrameId;

        const createShader = (gl, type, source) => {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error("Shader compile error:", gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        };

        const program = gl.createProgram();
        const vs = createShader(gl, gl.VERTEX_SHADER, vertexSource);
        const fs = createShader(gl, gl.FRAGMENT_SHADER, shaderSource);

        if (!vs || !fs) {
            console.error("Failed to create shaders");
            setShaderError(true);
            return;
        }

        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        gl.useProgram(program);

        // --- ATTRIBUTE SETUP ---
        let count = 0;

        if (mode === 'points') {
            const densityMultiplier = config.complexity !== undefined ? Math.floor(config.complexity) : 2;
            count = 10000 * densityMultiplier;
            const particleIds = new Float32Array(count);
            for (let i = 0; i < count; i++) particleIds[i] = i;

            const idBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, idBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, particleIds, gl.STATIC_DRAW);

            const aId = gl.getAttribLocation(program, 'a_id');
            gl.enableVertexAttribArray(aId);
            gl.vertexAttribPointer(aId, 1, gl.FLOAT, false, 0, 0);

        } else {
            const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
            const buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

            const positionLocation = gl.getAttribLocation(program, 'position');
            gl.enableVertexAttribArray(positionLocation);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
            count = 6;
        }

        // --- UNIFORM LOCATIONS ---
        const uTime = gl.getUniformLocation(program, 'u_time');
        const uRes = gl.getUniformLocation(program, 'u_resolution');
        const uSpeed = gl.getUniformLocation(program, 'u_speed');
        const uIntensity = gl.getUniformLocation(program, 'u_intensity');
        const uCol1 = gl.getUniformLocation(program, 'u_color1');
        const uCol2 = gl.getUniformLocation(program, 'u_color2');
        const uCol3 = gl.getUniformLocation(program, 'u_color3');
        const uComplexity = gl.getUniformLocation(program, 'u_complexity');
        const uGlitch = gl.getUniformLocation(program, 'u_glitch');
        const uStardust = gl.getUniformLocation(program, 'u_stardust');
        const uCameraMode = gl.getUniformLocation(program, 'u_camera_mode');
        const uBlendMode = gl.getUniformLocation(program, 'u_blend_mode');

        // --- NEW UNIFORMS ---
        const uScale = gl.getUniformLocation(program, 'u_scale');
        const uZoom = gl.getUniformLocation(program, 'u_zoom');
        const uSymmetry = gl.getUniformLocation(program, 'u_symmetry');

        // Extra Params mapping
        const extraParamLocations = {};
        if (expData.params) {
            Object.keys(expData.params).forEach(key => {
                extraParamLocations[key] = gl.getUniformLocation(program, `u_${key}`);
            });
        }

        const hexToRgb = (hex) => {
            if (!hex) return [0, 0, 0];
            const r = parseInt(hex.slice(1, 3), 16) / 255;
            const g = parseInt(hex.slice(3, 5), 16) / 255;
            const b = parseInt(hex.slice(5, 7), 16) / 255;
            return [isNaN(r) ? 0 : r, isNaN(g) ? 0 : g, isNaN(b) ? 0 : b];
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

        // PRE-COMPUTE UNIFORM VALUES BEFORE RENDER LOOP
        // Optimize: compute static configs that don't change frame-to-frame

        const configSpeed = config.speed || 1.0;
        const configIntensity = config.intensity || 1.0;
        const configComplexity = config.complexity || 2.0;
        const configGlitch = config.glitch || 0.0;
        const configStardust = config.stardust || 0.0;
        const configZoom = config.zoom;
        const configSymmetry = config.symmetry;

        const camModeMap = { 'cinematic': 0.0, 'freefall': 1.0, 'chaotic': 2.0 };
        const camModeVal = camModeMap[config.cameraMode] || 0.0;

        const blendModeMap = { 'additive': 0.0, 'subtractive': 1.0 };
        const blendModeVal = blendModeMap[config.blendMode] || 0.0;

        const colors = config.palette?.colors || ['#ffffff', '#888888', '#000000'];
        const c1 = hexToRgb(colors[0]);
        const c2 = hexToRgb(colors[1]);
        const c3 = hexToRgb(colors[2]);

        // Pre-compute extra parameters to avoid iterating Object.keys every frame
        const activeParams = [];
        if (expData.params) {
            Object.keys(expData.params).forEach(key => {
                const loc = extraParamLocations[key];
                if (loc) {
                    // Check if this key is one of our "universal" overrides
                    if (key === 'scale' && config.zoom) return;
                    if (key === 'zoom' && config.zoom) return;
                    if (key === 'symmetry' && config.symmetry) return;
                    if (key === 'complexity' && config.complexity) return;

                    activeParams.push({
                        loc: loc,
                        val: expData.params[key]
                    });
                }
            });
        }

        const render = (timestamp) => {
            if (!lastTimestamp) lastTimestamp = timestamp;
            const deltaTime = (timestamp - lastTimestamp) * 0.001;
            lastTimestamp = timestamp;

            shaderTime += deltaTime;

            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);

            gl.uniform1f(uTime, shaderTime);
            gl.uniform2f(uRes, width, height);
            gl.uniform1f(uSpeed, configSpeed);
            gl.uniform1f(uIntensity, configIntensity);

            if (uComplexity) gl.uniform1f(uComplexity, configComplexity);
            if (uGlitch) gl.uniform1f(uGlitch, configGlitch);
            if (uStardust) gl.uniform1f(uStardust, configStardust);

            // --- PASS NEW UNIFORMS ---
            if (uScale && configZoom !== undefined) gl.uniform1f(uScale, configZoom);
            if (uZoom && configZoom !== undefined) gl.uniform1f(uZoom, configZoom);
            if (uSymmetry && configSymmetry !== undefined) gl.uniform1f(uSymmetry, configSymmetry);

            if (uCameraMode) gl.uniform1f(uCameraMode, camModeVal);
            if (uBlendMode) gl.uniform1f(uBlendMode, blendModeVal);

            gl.uniform3f(uCol1, c1[0], c1[1], c1[2]);
            gl.uniform3f(uCol2, c2[0], c2[1], c2[2]);
            gl.uniform3f(uCol3, c3[0], c3[1], c3[2]);

            // Pass pre-computed extra params with a fast for loop
            for (let i = 0; i < activeParams.length; i++) {
                gl.uniform1f(activeParams[i].loc, activeParams[i].val);
            }

            if (mode === 'points') {
                gl.drawArrays(gl.POINTS, 0, count);
            } else {
                gl.drawArrays(gl.TRIANGLES, 0, count);
            }

            animationFrameId = requestAnimationFrame(render);
        };
        animationFrameId = requestAnimationFrame(render);

        return () => {
            window.removeEventListener('resize', onResize);
            cancelAnimationFrame(animationFrameId);
            gl.deleteProgram(program);
            gl.getExtension('WEBGL_lose_context')?.loseContext();
        };
    }, [config, briefingDone, id, shaderSource, vertexSource, mode, expData]);

    if (!expData) return <div className="w-screen h-screen bg-black text-white flex items-center justify-center font-mono">Experience not found</div>;

    // --- RENDER LOGIC ---
    // 1. If no config, show Lobby (which now includes comments/votes)
    if (shaderError) {
        return (
            <div className="w-screen h-screen bg-black text-white flex flex-col items-center justify-center font-mono">
                <p className="text-red-500 mb-4">Shader Compilation Failed</p>
                <button onClick={() => navigate('/gallery')} className="underline hover:text-white/70">Return to Gallery</button>
            </div>
        );
    }

    if (!config) {
        return (
            <ExperienceLobby
                title={expData.title}
                description={expData.desc}
                experienceId={id} // Pass ID for comments/votes
                onLaunch={(settings) => {
                    setConfig(settings);
                    // Briefing starts after lobby launch
                }}
                onBack={() => navigate(expData?.master ? `/gallery/${expData.master}` : '/gallery')}
            />
        );
    }

    // 2. If config exists but briefing not done, show Briefing Overlay
    if (!briefingDone) {
        return <BriefingOverlay onComplete={() => setBriefingDone(true)} />;
    }

    // 3. Experience Running
    return (
        <div className="relative w-screen h-[100dvh] overflow-hidden bg-black selection:bg-transparent text-white">
            <SEO
                title={expData.title}
                description={expData.desc}
                url={`https://uhigh.xyz/experience/${id}`}
            />
            <button
                onClick={() => {
                    setConfig(null); // Go back to Lobby
                    setBriefingDone(false);
                }}
                className={`absolute top-6 left-6 z-50 font-mono text-xs text-white/50 hover:text-white transition-all duration-700 uppercase tracking-widest bg-black/20 hover:bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md ${idle ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
                &larr; Return to Lobby
            </button>

            <canvas ref={canvasRef} className="w-full h-full block filter contrast-[1.2] saturate-[1.1]"></canvas>

            <div className="pointer-events-none fixed inset-0 z-40 opacity-[0.05] contrast-150 brightness-150">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <filter id="noiseFilter">
                        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#noiseFilter)" />
                </svg>
            </div>
        </div>
    );
}
