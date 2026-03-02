import React, { useState, useEffect, useRef } from 'react';
import { Play, Zap, Palette, Gauge, ArrowLeft, Check, Camera, Hexagon, Tv, Sparkles, Blend, ThumbsUp, ThumbsDown, MessageSquare, Send, Maximize, RotateCw, Layers } from 'lucide-react';
import gsap from 'gsap';
import { HexColorPicker } from 'react-colorful';
import useVotes from '../hooks/useVotes';
import useComments from '../hooks/useComments';

const INITIAL_PALETTES = [
    { id: 'custom-1', name: 'Primary', color: '#7b61ff' },
    { id: 'custom-2', name: 'Secondary', color: '#f5576c' },
    { id: 'custom-3', name: 'Accent', color: '#00ffaa' },
];

const SPEEDS = [
    { id: 0.2, name: 'Snail', desc: 'Slow motion flow' },
    { id: 1.0, name: 'Flow', desc: 'Standard time flow' },
    { id: 3.0, name: 'Warp', desc: 'High speed journey' },
    { id: 8.0, name: 'Quantum', desc: 'Instantaneous transitions' },
];

const CAMERA_MODES = [
    { id: 'cinematic', name: 'Cinematic', desc: 'Smooth, steady camera movement' },
    { id: 'freefall', name: 'Free Fall', desc: 'Constant downward descent' },
    { id: 'chaotic', name: 'Chaotic', desc: 'Randomized viewing angles' }
];

const COMPLEXITIES = [
    { id: 1.0, name: 'Low', desc: 'Minimalist geometry' },
    { id: 2.0, name: 'Mid', desc: 'Balanced detail' },
    { id: 4.0, name: 'Deep', desc: 'High fractal depth' },
    { id: 8.0, name: '∞', desc: 'Maximum recursive detail' }
];

const STARDUST_MODES = [
    { id: 0.0, name: 'None', desc: 'Clean view' },
    { id: 0.3, name: 'Light', desc: 'Subtle particle dust' },
    { id: 0.7, name: 'Dense', desc: 'Heavy atmosphere' },
    { id: 1.5, name: 'Storm', desc: 'Chaotic particle storm' }
];

const BLEND_MODES = [
    { id: 'additive', name: 'Neon', desc: 'Bright, glowing additive blending' },
    { id: 'subtractive', name: 'Void', desc: 'Dark, absorbing subtractive blending' }
];

// --- TOOLTIP COMPONENT ---
const Tooltip = ({ text, children }) => {
    const [show, setShow] = useState(false);

    return (
        <div
            className="relative flex items-center w-full"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            {children}
            {show && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-zinc-900 border border-white/20 text-white text-[10px] font-mono rounded-lg shadow-xl whitespace-nowrap z-50 pointer-events-none">
                    {text}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-zinc-900"></div>
                </div>
            )}
        </div>
    );
};

// --- SUB-COMPONENTS ---
function LobbyVotes({ experienceId }) {
    const { likes, userVote, handleVote, isVoting } = useVotes(experienceId);

    return (
        <div className="flex items-center gap-3">
            <button
                onClick={() => handleVote('like')}
                disabled={isVoting}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${userVote === 'like' ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white'}`}
            >
                <ThumbsUp size={14} className={userVote === 'like' ? 'fill-current' : ''} />
                <span className="font-mono text-[10px]">{likes}</span>
            </button>

            <button
                onClick={() => handleVote('dislike')}
                disabled={isVoting}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${userVote === 'dislike' ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white'}`}
            >
                <ThumbsDown size={14} className={userVote === 'dislike' ? 'fill-current' : ''} />
                 {userVote === 'dislike' && <span className="font-mono text-[10px]">1</span>}
            </button>
        </div>
    );
}

function ArtifactLogs({ experienceId }) {
    const { comments, postComment, currentNickname, isSubmitting } = useComments(experienceId);
    const [newComment, setNewComment] = useState('');
    const commentsEndRef = useRef(null);

    const scrollToBottom = () => {
        commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [comments]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || isSubmitting) return;
        await postComment(newComment);
        setNewComment('');
    };

    return (
        <div className="w-full mt-0 bg-black/40 rounded-2xl border border-white/10 p-4 h-full flex flex-col">
            <h3 className="font-mono text-[10px] text-accent uppercase tracking-[0.2em] font-bold mb-3 flex items-center gap-2 shrink-0">
                <MessageSquare size={12} /> Artifact Logs
            </h3>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 mb-3 space-y-3 min-h-0">
                {comments.length === 0 ? (
                    <div className="text-white/20 font-mono text-[9px] italic">No logs recorded yet. Be the first to document this anomaly.</div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="bg-white/5 rounded-lg p-3 border border-white/5">
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-mono text-[9px] text-accent font-bold tracking-wider">{comment.nickname}</span>
                                <span className="font-mono text-[8px] text-white/20">
                                    {new Date(comment.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="font-mono text-[10px] text-white/70 leading-relaxed break-words">{comment.content}</p>
                        </div>
                    ))
                )}
                <div ref={commentsEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="relative group shrink-0">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={`Log entry as ${currentNickname}...`}
                    disabled={isSubmitting}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white font-mono text-[10px] focus:outline-none focus:border-accent/50 transition-all placeholder:text-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                    type="submit"
                    disabled={!newComment.trim() || isSubmitting}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-white/40 hover:text-accent disabled:opacity-30 disabled:hover:text-white/40 transition-colors"
                >
                    <Send size={14} />
                </button>
            </form>
        </div>
    );
}

// Extracted Button Components to fix lint error "Cannot create components during render"
// Changed icon: Icon to just Icon and using it directly
const TabButton = ({ id, activeTab, setActiveTab, label, icon: IconComponent }) => {
    const Icon = IconComponent;
    return (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex-1 pb-3 pt-2 text-[10px] md:text-xs font-mono uppercase tracking-widest border-b-2 transition-all flex items-center justify-center gap-2 ${activeTab === id
                ? 'border-white text-white'
                : 'border-transparent text-white/40 hover:text-white/70 hover:border-white/20'
                }`}
        >
            <Icon size={14} /> {label}
        </button>
    );
};

const PillButton = ({ active, onClick, children, tooltip, className = '' }) => (
    <Tooltip text={tooltip}>
        <button
            onClick={onClick}
            className={`w-full py-3 px-3 rounded-xl border transition-all font-mono text-[9px] md:text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 ${active
                ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.25)]'
                : 'bg-white/5 text-white/50 border-white/5 hover:bg-white/10 hover:text-white'
                } ${className}`}
        >
            {children}
        </button>
    </Tooltip>
);

export default function ExperienceLobby({ title, description, onLaunch, onBack, experienceId }) {
    // --- STATE ---
    const [activeTab, setActiveTab] = useState('visuals'); // visuals, colors, effects

    // Visuals
    const [speed, setSpeed] = useState(1.0);
    const [complexity, setComplexity] = useState(2.0);
    const [zoom, setZoom] = useState(1.0); // New: Scale/Zoom
    const [symmetry, setSymmetry] = useState(5.0); // New: Geometry Symmetry

    // Colors
    const [customPalettes, setCustomPalettes] = useState(() => {
        const saved = localStorage.getItem('experience_lobby_colors');
        return saved ? JSON.parse(saved) : INITIAL_PALETTES;
    });
    const [activePaletteId, setActivePaletteId] = useState('custom-1');

    // Effects
    const [intensity, setIntensity] = useState(1.0);
    const [glitch, setGlitch] = useState(0.0);
    const [stardust, setStardust] = useState(0.3);
    const [cameraMode, setCameraMode] = useState('cinematic');
    const [blendMode, setBlendMode] = useState('additive');

    const activePalette = customPalettes.find(p => p.id === activePaletteId) || customPalettes[0];

    // --- ANIMATIONS ---
    useEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline();
            tl.fromTo(".lobby-content",
                { opacity: 0, scale: 0.95, y: 30 },
                { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "power4.out" }
            ).fromTo(".lobby-item",
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, stagger: 0.04, duration: 0.6, ease: "power3.out" },
                "-=0.8"
            );
        }, "lobby-container");
        return () => ctx.revert();
    }, []);

    // --- HANDLERS ---
    const handleColorChange = (newColor) => {
        const newPalettes = customPalettes.map(p =>
            p.id === activePaletteId ? { ...p, color: newColor } : p
        );
        setCustomPalettes(newPalettes);
        localStorage.setItem('experience_lobby_colors', JSON.stringify(newPalettes));
    };

    const handleLaunch = () => {
        gsap.to(".lobby-container", {
            opacity: 0,
            scale: 1.05,
            duration: 1.2,
            ease: "power4.inOut",
            onComplete: () => {
                const colors = customPalettes.map(p => p.color);
                onLaunch({
                    speed,
                    palette: { colors, activeColor: activePalette.color },
                    intensity,
                    cameraMode,
                    complexity,
                    glitch,
                    stardust,
                    blendMode,
                    zoom,       // New
                    symmetry    // New
                });
            }
        });
    };

    // --- RENDER CONTENT BASED ON TAB ---
    const renderContent = () => {
        switch (activeTab) {
            case 'visuals':
                return (
                    <div className="grid grid-cols-2 gap-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {/* SPEED */}
                        <div className="lobby-item col-span-2">
                            <div className="flex items-center gap-1.5 mb-3 text-white/60 font-mono text-[9px] uppercase tracking-widest">
                                <Gauge size={12} /> <span>Temporal Velocity</span>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {SPEEDS.map((s) => (
                                    <PillButton key={s.id} active={speed === s.id} onClick={() => setSpeed(s.id)} tooltip={s.desc}>
                                        {s.name}
                                    </PillButton>
                                ))}
                            </div>
                        </div>

                        {/* COMPLEXITY */}
                        <div className="lobby-item col-span-2">
                            <div className="flex items-center gap-1.5 mb-3 text-white/60 font-mono text-[9px] uppercase tracking-widest">
                                <Hexagon size={12} /> <span>Fractal Depth</span>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {COMPLEXITIES.map((c) => (
                                    <PillButton key={c.id} active={complexity === c.id} onClick={() => setComplexity(c.id)} tooltip={c.desc}>
                                        {c.name}
                                    </PillButton>
                                ))}
                            </div>
                        </div>

                        {/* ZOOM */}
                        <div className="lobby-item col-span-1">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-1.5 text-white/60 font-mono text-[9px] uppercase tracking-widest">
                                    <Maximize size={12} /> <span>Zoom Scale</span>
                                </div>
                                <span className="font-mono text-[9px] text-white/90">x{zoom.toFixed(1)}</span>
                            </div>
                            <Tooltip text="Adjusts the scale of the fractal universe">
                                <input
                                    type="range"
                                    min="0.1"
                                    max="5.0"
                                    step="0.1"
                                    value={zoom}
                                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                                    className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-white hover:bg-white/20 transition-colors"
                                />
                            </Tooltip>
                        </div>

                        {/* SYMMETRY */}
                        <div className="lobby-item col-span-1">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-1.5 text-white/60 font-mono text-[9px] uppercase tracking-widest">
                                    <RotateCw size={12} /> <span>Symmetry</span>
                                </div>
                                <span className="font-mono text-[9px] text-white/90">{symmetry.toFixed(0)}x</span>
                            </div>
                             <Tooltip text="Number of geometric repetitions">
                                <input
                                    type="range"
                                    min="1.0"
                                    max="20.0"
                                    step="1.0"
                                    value={symmetry}
                                    onChange={(e) => setSymmetry(parseFloat(e.target.value))}
                                    className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-white hover:bg-white/20 transition-colors"
                                />
                             </Tooltip>
                        </div>
                    </div>
                );

            case 'colors':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {/* PALETTE SELECTOR */}
                        <div className="lobby-item">
                            <div className="flex items-center gap-1.5 mb-3 text-white/60 font-mono text-[9px] uppercase tracking-widest">
                                <Palette size={12} /> <span>Channel Selection</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                {customPalettes.map((p) => (
                                    <button
                                        key={p.id}
                                        onClick={() => setActivePaletteId(p.id)}
                                        className={`w-full group relative py-3 px-4 rounded-xl border transition-all flex items-center gap-3 ${activePaletteId === p.id
                                            ? 'bg-white/10 border-white/40'
                                            : 'bg-white/5 border-white/5 hover:bg-white/10'
                                            }`}
                                    >
                                        <div className="w-5 h-5 rounded-full shrink-0 shadow-lg border border-white/20" style={{ background: p.color }}></div>
                                        <div className="flex flex-col items-start">
                                            <span className={`font-mono text-[9px] uppercase tracking-widest ${activePaletteId === p.id ? 'text-white font-bold' : 'text-white/40'}`}>
                                                {p.name}
                                            </span>
                                            <span className="font-mono text-[8px] text-white/30">{p.color}</span>
                                        </div>
                                        {activePaletteId === p.id && <Check size={12} className="text-white ml-auto" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* INFINITE COLOR PICKER */}
                        <div className="lobby-item flex flex-col items-center justify-center bg-black/20 rounded-xl p-4 border border-white/5">
                            <div className="mb-4 w-full flex justify-center">
                                <HexColorPicker
                                    color={activePalette.color}
                                    onChange={handleColorChange}
                                    style={{ width: '100%', height: '150px' }}
                                />
                            </div>
                            <div className="flex items-center gap-2 w-full bg-black/40 p-2 rounded-lg border border-white/10">
                                <div className="w-6 h-6 rounded bg-current border border-white/20" style={{ color: activePalette.color }}></div>
                                <input
                                    type="text"
                                    value={activePalette.color}
                                    onChange={(e) => handleColorChange(e.target.value)}
                                    className="bg-transparent text-white font-mono text-xs focus:outline-none w-full uppercase"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 'effects':
                return (
                    <div className="grid grid-cols-2 gap-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {/* INTENSITY & GLITCH */}
                        <div className="lobby-item col-span-2 grid grid-cols-2 gap-5">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-1.5 text-white/60 font-mono text-[9px] uppercase tracking-widest">
                                        <Zap size={12} /> <span>Intensity</span>
                                    </div>
                                    <span className="font-mono text-[9px] text-white/90">{(intensity * 100).toFixed(0)}%</span>
                                </div>
                                <Tooltip text="Controls the overall brightness and power">
                                    <input
                                        type="range"
                                        min="0.1"
                                        max="3.0"
                                        step="0.1"
                                        value={intensity}
                                        onChange={(e) => setIntensity(parseFloat(e.target.value))}
                                        className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-white hover:bg-white/20 transition-colors"
                                    />
                                </Tooltip>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-1.5 text-white/60 font-mono text-[9px] uppercase tracking-widest">
                                        <Tv size={12} /> <span>Digital Glitch</span>
                                    </div>
                                    <span className="font-mono text-[9px] text-white/90">{(glitch * 100).toFixed(0)}%</span>
                                </div>
                                <Tooltip text="Introduces digital artifacts and signal noise">
                                    <input
                                        type="range"
                                        min="0.0"
                                        max="1.0"
                                        step="0.05"
                                        value={glitch}
                                        onChange={(e) => setGlitch(parseFloat(e.target.value))}
                                        className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#f5576c] hover:bg-white/20 transition-colors"
                                    />
                                </Tooltip>
                            </div>
                        </div>

                        {/* STARDUST */}
                        <div className="lobby-item col-span-1">
                            <div className="flex items-center gap-1.5 mb-2 text-white/60 font-mono text-[9px] uppercase tracking-widest">
                                <Sparkles size={12} /> <span>Atmosphere</span>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                {STARDUST_MODES.map((mode) => (
                                    <PillButton key={mode.id} active={stardust === mode.id} onClick={() => setStardust(mode.id)} tooltip={mode.desc}>
                                        {mode.name}
                                    </PillButton>
                                ))}
                            </div>
                        </div>

                         {/* CAMERA */}
                         <div className="lobby-item col-span-1">
                            <div className="flex items-center gap-1.5 mb-2 text-white/60 font-mono text-[9px] uppercase tracking-widest">
                                <Camera size={12} /> <span>Camera</span>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                {CAMERA_MODES.map((mode) => (
                                    <PillButton key={mode.id} active={cameraMode === mode.id} onClick={() => setCameraMode(mode.id)} tooltip={mode.desc}>
                                        {mode.name}
                                    </PillButton>
                                ))}
                            </div>
                        </div>

                        {/* BLEND MODE */}
                        <div className="lobby-item col-span-2">
                            <div className="flex items-center gap-1.5 mb-2 text-white/60 font-mono text-[9px] uppercase tracking-widest">
                                <Blend size={12} /> <span>Render Blend</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {BLEND_MODES.map((mode) => (
                                    <PillButton key={mode.id} active={blendMode === mode.id} onClick={() => setBlendMode(mode.id)} tooltip={mode.desc}>
                                        {mode.name}
                                    </PillButton>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="lobby-container fixed inset-0 z-[10000] flex items-center justify-center bg-[#050505] overflow-hidden p-3 md:p-6 selection:bg-transparent">
            {/* Ambient Background Glow */}
            <div
                className="absolute inset-0 opacity-40 blur-[180px] transition-colors duration-1000"
                style={{ background: `radial-gradient(circle at center, ${activePalette.color}, transparent 80%)` }}
            ></div>

            <div className="lobby-content relative w-full max-w-[1200px] bg-zinc-950/90 backdrop-blur-3xl border border-white/10 rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-6 shadow-[0_0_100px_rgba(0,0,0,0.9)] h-[90vh] md:h-[85vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 md:mb-6 shrink-0 z-10 relative">
                    <button
                        onClick={onBack}
                        className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all hover:scale-105 active:scale-95 group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div className="text-right flex flex-col items-end">
                        <div className="flex items-center justify-end gap-4 mb-2">
                             {experienceId && <LobbyVotes experienceId={experienceId} />}
                        </div>

                        <h1 className="text-2xl md:text-4xl font-black text-white tracking-tighter leading-none mb-1 drop-shadow-lg">
                            {title}
                        </h1>
                        <p className="font-mono text-[9px] md:text-[10px] text-accent uppercase tracking-[0.2em] font-bold">System Override & Customization</p>
                    </div>
                </div>

                <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-6 md:gap-8 overflow-hidden relative z-0">
                    {/* LEFT COLUMN: Controls */}
                    <div className="w-full md:w-2/3 flex flex-col min-h-0 bg-black/20 rounded-2xl border border-white/5">
                        {/* Tabs */}
                        <div className="flex border-b border-white/10 shrink-0">
                            <TabButton id="visuals" activeTab={activeTab} setActiveTab={setActiveTab} label="Visuals" icon={Layers} />
                            <TabButton id="colors" activeTab={activeTab} setActiveTab={setActiveTab} label="Chromatic" icon={Palette} />
                            <TabButton id="effects" activeTab={activeTab} setActiveTab={setActiveTab} label="Effects" icon={Zap} />
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6">
                            {renderContent()}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Action & Logs */}
                    <div className="w-full md:w-1/3 flex flex-col gap-4 shrink-0 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 min-h-[300px]">
                         <div className="flex flex-col items-center justify-center shrink-0">
                            <div className="text-center mb-4 hidden md:block">
                                <p className="font-mono text-[10px] text-white/50 mb-4 leading-relaxed line-clamp-3">
                                    {description}
                                </p>
                            </div>

                            <button
                                onClick={handleLaunch}
                                className="w-full group relative px-8 py-5 rounded-xl bg-white text-black font-black text-sm md:text-base overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] border-2 border-white/50"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                                <span className="relative z-10 flex items-center gap-3 tracking-widest">
                                    LAUNCH SYSTEM <Play size={18} fill="currentColor" />
                                </span>
                            </button>
                         </div>

                         <div className="flex-1 min-h-0 overflow-hidden rounded-xl border border-white/10 bg-black/20">
                            {experienceId && <ArtifactLogs experienceId={experienceId} />}
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
