import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ExperienceLobby from '../components/ExperienceLobby';
import BriefingOverlay from '../components/BriefingOverlay';
import useIdleHide from '../hooks/useIdleHide';
import { EXPERIENCES } from '../data/experiences';
import { MASTER_SHADERS } from '../data/shaders';
import SEO from '../components/SEO';

const TELEMETRY_ENDPOINT = '/api/telemetry';
const LAUNCH_METRICS_KEY = 'shader_launch_metrics_v1';

const readLaunchMetrics = () => {
    try {
        const parsed = JSON.parse(localStorage.getItem(LAUNCH_METRICS_KEY) || '{}');
        return {
            attempts: Number(parsed.attempts) || 0,
            successes: Number(parsed.successes) || 0,
            sessions: Number(parsed.sessions) || 0,
            crashFree: Number(parsed.crashFree) || 0
        };
    } catch {
        return { attempts: 0, successes: 0, sessions: 0, crashFree: 0 };
    }
};

const writeLaunchMetrics = (metrics) => {
    localStorage.setItem(LAUNCH_METRICS_KEY, JSON.stringify(metrics));
};

const inferGpuTier = (renderer = '', deviceMemory = 4, cores = 4, dpr = 1, thermalHint = 'normal') => {
    const lowerRenderer = renderer.toLowerCase();
    if (thermalHint === 'constrained') return 'low';
    if (lowerRenderer.includes('swiftshader') || lowerRenderer.includes('intel(r) hd')) return 'low';
    if (lowerRenderer.includes('rtx') || lowerRenderer.includes('radeon rx') || lowerRenderer.includes('apple m')) return 'high';
    if (deviceMemory >= 8 && cores >= 8 && dpr <= 2) return 'high';
    if (deviceMemory <= 2 || cores <= 4 || dpr >= 3) return 'low';
    return 'mid';
};

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
    const [safeMode, setSafeMode] = useState(false);
    const { idle } = useIdleHide(5000);
    const sessionIdRef = useRef(globalThis.crypto?.randomUUID?.() || `${Date.now()}`);
    const sessionStartRef = useRef(0);
    const crashedRef = useRef(false);

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

    const sendTelemetry = useCallback((eventName, payload = {}) => {
        const launchMetrics = readLaunchMetrics();
        const launchSuccessRate = launchMetrics.attempts > 0 ? launchMetrics.successes / launchMetrics.attempts : 0;
        const crashFreeSessions = launchMetrics.sessions > 0 ? launchMetrics.crashFree / launchMetrics.sessions : 0;

        const body = {
            eventName,
            sessionId: sessionIdRef.current,
            experienceId: id,
            ts: Date.now(),
            launchSuccessRate,
            crashFreeSessions,
            ...payload
        };

        try {
            const serialized = JSON.stringify(body);
            if (navigator.sendBeacon) {
                navigator.sendBeacon(TELEMETRY_ENDPOINT, serialized);
            } else {
                fetch(TELEMETRY_ENDPOINT, {
                    method: 'POST',
                    headers: { 'content-type': 'application/json' },
                    body: serialized,
                    keepalive: true
                }).catch(() => undefined);
            }
        } catch {
            // no-op: telemetry should never break rendering
        }
    }, [id]);

    useEffect(() => {
        // Only run WebGL setup if we have config (Lobby submitted) AND briefing is done
        if (!config || !briefingDone || !expData || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const gl = canvas.getContext('webgl');
        if (!gl) return;

        const debugRendererInfo = gl.getExtension('WEBGL_debug_renderer_info');
        const renderer = debugRendererInfo ? gl.getParameter(debugRendererInfo.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
        const deviceMemory = navigator.deviceMemory || 4;
        const cores = navigator.hardwareConcurrency || 4;
        const dpr = window.devicePixelRatio || 1;
        const thermalHint = (navigator.connection?.saveData || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) ? 'constrained' : 'normal';
        const gpuTier = inferGpuTier(renderer, deviceMemory, cores, dpr, thermalHint);
        const deviceInfo = { renderer, deviceMemory, cores, dpr, gpuTier, thermalHint };

        const quality = {
            level: safeMode ? 0 : (gpuTier === 'high' ? 3 : gpuTier === 'mid' ? 2 : 1),
            resolutionScale: safeMode ? 0.65 : (gpuTier === 'high' ? 1 : gpuTier === 'mid' ? 0.85 : 0.75),
            effectsEnabled: !safeMode,
            complexityScale: safeMode ? 0.6 : (gpuTier === 'high' ? 1 : gpuTier === 'mid' ? 0.85 : 0.7)
        };

        sendTelemetry('shader_session_bootstrap', { deviceInfo, safeMode });

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
        let runtimeErrorLogged = false;
        let lowFpsStreak = 0;

        const createShader = (gl, type, source) => {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                const errorLog = gl.getShaderInfoLog(shader);
                sendTelemetry('shader_compile_error', {
                    errorCode: 'SHADER_COMPILE_FAILED',
                    shaderId: type === gl.VERTEX_SHADER ? 'vertex' : 'fragment',
                    deviceInfo,
                    errorLog
                });
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        };

        const program = gl.createProgram();
        const vs = createShader(gl, gl.VERTEX_SHADER, vertexSource);
        const fs = createShader(gl, gl.FRAGMENT_SHADER, shaderSource);

        if (!vs || !fs) {
            crashedRef.current = true;
            setShaderError(true);
            return;
        }

        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            sendTelemetry('shader_program_link_error', {
                errorCode: 'SHADER_LINK_FAILED',
                shaderId: expData.master,
                deviceInfo,
                errorLog: gl.getProgramInfoLog(program)
            });
            crashedRef.current = true;
            setShaderError(true);
            return;
        }
        gl.useProgram(program);

        // --- ATTRIBUTE SETUP ---
        let count = 0;
        let activeBuffer = null;

        if (mode === 'points') {
            const densityMultiplier = config.complexity !== undefined ? Math.floor(config.complexity * quality.complexityScale) : 2;
            count = 10000 * densityMultiplier;
            const particleIds = new Float32Array(count);
            for (let i = 0; i < count; i++) particleIds[i] = i;

            activeBuffer = gl.createBuffer();
            const idBuffer = activeBuffer;
            gl.bindBuffer(gl.ARRAY_BUFFER, idBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, particleIds, gl.STATIC_DRAW);

            const aId = gl.getAttribLocation(program, 'a_id');
            gl.enableVertexAttribArray(aId);
            gl.vertexAttribPointer(aId, 1, gl.FLOAT, false, 0, 0);

        } else {
            const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
            activeBuffer = gl.createBuffer();
            const buffer = activeBuffer;
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
            canvas.width = Math.max(1, Math.floor(width * dpr * quality.resolutionScale));
            canvas.height = Math.max(1, Math.floor(height * dpr * quality.resolutionScale));
            gl.viewport(0, 0, canvas.width, canvas.height);
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

        sessionStartRef.current = performance.now();
        writeLaunchMetrics({ ...readLaunchMetrics(), successes: readLaunchMetrics().successes + 1 });
        sendTelemetry('experience_launch_success', { deviceInfo, shaderId: expData.master, safeMode });

        const reduceQuality = () => {
            if (quality.level <= 0) return;
            quality.level -= 1;
            quality.resolutionScale = Math.max(0.6, quality.resolutionScale - 0.12);
            quality.complexityScale = Math.max(0.55, quality.complexityScale - 0.1);
            if (quality.level <= 1) quality.effectsEnabled = false;
            onResize();
            sendTelemetry('auto_quality_reduction', {
                deviceInfo,
                level: quality.level,
                resolutionScale: quality.resolutionScale,
                effectsEnabled: quality.effectsEnabled
            });
        };

        const render = (timestamp) => {
            if (!lastTimestamp) lastTimestamp = timestamp;
            const deltaTime = (timestamp - lastTimestamp) * 0.001;
            lastTimestamp = timestamp;
            const fps = deltaTime > 0 ? 1 / deltaTime : 60;
            lowFpsStreak = fps < 42 ? lowFpsStreak + 1 : Math.max(0, lowFpsStreak - 1);
            if (lowFpsStreak > 45) {
                reduceQuality();
                lowFpsStreak = 0;
            }

            shaderTime += deltaTime;

            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);

            gl.uniform1f(uTime, shaderTime);
            gl.uniform2f(uRes, canvas.width, canvas.height);
            gl.uniform1f(uSpeed, configSpeed);
            gl.uniform1f(uIntensity, configIntensity);

            if (uComplexity) gl.uniform1f(uComplexity, configComplexity * quality.complexityScale);
            if (uGlitch) gl.uniform1f(uGlitch, quality.effectsEnabled ? configGlitch : 0.0);
            if (uStardust) gl.uniform1f(uStardust, quality.effectsEnabled ? configStardust : 0.0);

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

            const glError = gl.getError();
            if (glError !== gl.NO_ERROR && !runtimeErrorLogged) {
                runtimeErrorLogged = true;
                crashedRef.current = true;
                sendTelemetry('shader_runtime_error', {
                    errorCode: `GL_ERROR_${glError}`,
                    shaderId: expData.master,
                    deviceInfo
                });
            }

            animationFrameId = requestAnimationFrame(render);
        };
        animationFrameId = requestAnimationFrame(render);

        return () => {
            window.removeEventListener('resize', onResize);
            cancelAnimationFrame(animationFrameId);
            const durationMs = sessionStartRef.current ? Math.round(performance.now() - sessionStartRef.current) : 0;
            const metrics = readLaunchMetrics();
            writeLaunchMetrics({
                ...metrics,
                sessions: metrics.sessions + 1,
                crashFree: metrics.crashFree + (crashedRef.current ? 0 : 1)
            });
            sendTelemetry('experience_session_end', {
                sessionDurationMs: durationMs,
                crashed: crashedRef.current,
                shaderId: expData.master,
                deviceInfo
            });
            gl.deleteProgram(program);
            if (vs) gl.deleteShader(vs);
            if (fs) gl.deleteShader(fs);
            if (activeBuffer) gl.deleteBuffer(activeBuffer);
            gl.getExtension('WEBGL_lose_context')?.loseContext();
        };
    }, [config, briefingDone, id, shaderSource, vertexSource, mode, expData, safeMode, sendTelemetry]);

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
                    const metrics = readLaunchMetrics();
                    writeLaunchMetrics({ ...metrics, attempts: metrics.attempts + 1 });
                    crashedRef.current = false;
                    sendTelemetry('experience_launch_attempt', { shaderId: expData.master, safeMode });
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

            <button
                onClick={() => setSafeMode((prev) => !prev)}
                className={`absolute top-6 right-6 z-50 font-mono text-xs transition-all duration-500 uppercase tracking-widest px-4 py-2 rounded-full border backdrop-blur-md ${safeMode ? 'text-lime-300 border-lime-400/50 bg-lime-500/15' : 'text-white/70 border-white/20 bg-black/30 hover:bg-black/50'} ${idle ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
                {safeMode ? 'Safe Mode: On' : 'Safe Mode'}
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
