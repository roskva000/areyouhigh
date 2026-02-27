import React, { useState, useEffect } from 'react';
import { Play, Zap, Palette, Gauge, ArrowLeft, Check, Camera, Hexagon, Tv, Sparkles, Blend, ThumbsUp, ThumbsDown, MessageSquare, Send } from 'lucide-react';
import gsap from 'gsap';
import useVotes from '../hooks/useVotes';
import useComments from '../hooks/useComments';

const COLOR_PRESETS = [
    '#7b61ff', '#00f2fe', '#f5576c', '#ffcc00', '#00ffaa', '#ff00ff', '#ffffff',
];

const INITIAL_PALETTES = [
    { id: 'custom-1', name: 'Primary', color: '#7b61ff' },
    { id: 'custom-2', name: 'Secondary', color: '#f5576c' },
    { id: 'custom-3', name: 'Accent', color: '#00ffaa' },
];

const SPEEDS = [
    { id: 0.2, name: 'Snail' },
    { id: 1.0, name: 'Flow' },
    { id: 3.0, name: 'Warp' },
    { id: 8.0, name: 'Quantum' },
];

const CAMERA_MODES = [
    { id: 'cinematic', name: 'Cinematic' },
    { id: 'freefall', name: 'Free Fall' },
    { id: 'chaotic', name: 'Chaotic' }
];

const COMPLEXITIES = [
    { id: 1.0, name: 'Low' },
    { id: 2.0, name: 'Mid' },
    { id: 4.0, name: 'Deep' },
    { id: 8.0, name: '∞' }
];

const STARDUST_MODES = [
    { id: 0.0, name: 'None' },
    { id: 0.3, name: 'Light' },
    { id: 0.7, name: 'Dense' },
    { id: 1.5, name: 'Storm' }
];

const BLEND_MODES = [
    { id: 'additive', name: 'Neon' },
    { id: 'subtractive', name: 'Void' }
];

// Inner component for voting
function LobbyVotes({ experienceId }) {
    const { likes, userVote, handleVote } = useVotes(experienceId);

    return (
        <div className="flex items-center gap-3">
            <button
                onClick={() => handleVote('like')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${userVote === 'like' ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white'}`}
            >
                <ThumbsUp size={14} className={userVote === 'like' ? 'fill-current' : ''} />
                <span className="font-mono text-[10px]">{likes}</span>
            </button>

            <button
                onClick={() => handleVote('dislike')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${userVote === 'dislike' ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white'}`}
            >
                <ThumbsDown size={14} className={userVote === 'dislike' ? 'fill-current' : ''} />
                 {/* Only show dislike count if user voted, but generally hide public dislike count */}
                 {userVote === 'dislike' && <span className="font-mono text-[10px]">1</span>}
            </button>
        </div>
    );
}

// Inner component for comments
function ArtifactLogs({ experienceId }) {
    const { comments, postComment, currentNickname } = useComments(experienceId);
    const [newComment, setNewComment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        postComment(newComment);
        setNewComment('');
    };

    return (
        <div className="w-full mt-6 bg-black/40 rounded-2xl border border-white/10 p-4">
            <h3 className="font-mono text-[10px] text-accent uppercase tracking-[0.2em] font-bold mb-4 flex items-center gap-2">
                <MessageSquare size={12} /> Artifact Logs
            </h3>

            {/* Comment List */}
            <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-2 mb-4">
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
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="relative group">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={`Log entry as ${currentNickname}...`}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white font-mono text-[10px] focus:outline-none focus:border-accent/50 transition-all placeholder:text-white/20"
                />
                <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-white/40 hover:text-accent disabled:opacity-30 disabled:hover:text-white/40 transition-colors"
                >
                    <Send size={14} />
                </button>
            </form>
        </div>
    );
}

export default function ExperienceLobby({ title, description, onLaunch, onBack, experienceId }) {
    const [speed, setSpeed] = useState(1.0);
    const [customPalettes, setCustomPalettes] = useState(() => {
        const saved = localStorage.getItem('experience_lobby_colors');
        return saved ? JSON.parse(saved) : INITIAL_PALETTES;
    });
    const [activePaletteId, setActivePaletteId] = useState('custom-1');
    const [activePicker, setActivePicker] = useState(null);
    const [intensity, setIntensity] = useState(1.0);
    const [cameraMode, setCameraMode] = useState('cinematic');
    const [complexity, setComplexity] = useState(2.0);
    const [glitch, setGlitch] = useState(0.0);
    const [stardust, setStardust] = useState(0.3);
    const [blendMode, setBlendMode] = useState('additive');

    const activePalette = customPalettes.find(p => p.id === activePaletteId) || customPalettes[0];

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

    const handleColorSelect = (id, color) => {
        const newPalettes = customPalettes.map(p =>
            p.id === id ? { ...p, color } : p
        );
        setCustomPalettes(newPalettes);
        localStorage.setItem('experience_lobby_colors', JSON.stringify(newPalettes));
        setActivePicker(null);
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
                    blendMode
                });
            }
        });
    };

    const PillButton = ({ active, onClick, children, className = '' }) => (
        <button
            onClick={onClick}
            className={`py-2 px-3 rounded-xl border transition-all font-mono text-[9px] md:text-[10px] uppercase tracking-wider ${active
                ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.25)]'
                : 'bg-white/5 text-white/50 border-white/5 hover:bg-white/10 hover:text-white'
                } ${className}`}
        >
            {children}
        </button>
    );

    return (
        <div className="lobby-container fixed inset-0 z-[10000] flex items-center justify-center bg-[#050505] overflow-hidden p-3 md:p-6 selection:bg-transparent">
            {/* Ambient Background Glow */}
            <div
                className="absolute inset-0 opacity-40 blur-[180px] transition-colors duration-1000"
                style={{ background: `radial-gradient(circle at center, ${activePalette.color}, transparent 80%)` }}
            ></div>

            <div className="lobby-content relative w-full max-w-[1400px] bg-zinc-950/80 backdrop-blur-3xl border border-white/10 rounded-[2rem] md:rounded-[3rem] p-5 md:p-8 shadow-[0_0_100px_rgba(0,0,0,0.9)] max-h-[90vh] overflow-y-auto custom-scrollbar">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={onBack}
                        className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all hover:scale-105 active:scale-95 group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div className="text-right">
                        <div className="flex items-center justify-end gap-4 mb-2">
                             {/* Votes */}
                             {experienceId && <LobbyVotes experienceId={experienceId} />}
                        </div>

                        <h1 className="text-2xl md:text-4xl font-black text-white tracking-tighter leading-none mb-1 drop-shadow-lg">
                            {title}
                        </h1>
                        <p className="font-mono text-[9px] md:text-[10px] text-accent uppercase tracking-[0.2em] font-bold">System Override & Customization</p>
                        <p className="hidden md:block font-mono text-[8px] text-white/30 max-w-xs ml-auto mt-1 truncate">
                            {description}
                        </p>
                    </div>
                </div>

                {/* === MAIN GRID: All controls in a single viewport === */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
                    {/* ROW 1 — Temporal Velocity (Speed) */}
                    <div className="lobby-item col-span-2">
                        <div className="flex items-center gap-1.5 mb-2 text-white/60 font-mono text-[9px] uppercase tracking-widest">
                            <Gauge size={12} /> <span>Velocity</span>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5">
                            {SPEEDS.map((s) => (
                                <PillButton key={s.id} active={speed === s.id} onClick={() => setSpeed(s.id)}>
                                    {s.name}
                                </PillButton>
                            ))}
                        </div>
                    </div>

                    {/* ROW 1 — Fractal Complexity */}
                    <div className="lobby-item col-span-2">
                        <div className="flex items-center gap-1.5 mb-2 text-white/60 font-mono text-[9px] uppercase tracking-widest">
                            <Hexagon size={12} /> <span>Complexity</span>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5">
                            {COMPLEXITIES.map((c) => (
                                <PillButton key={c.id} active={complexity === c.id} onClick={() => setComplexity(c.id)}>
                                    {c.name}
                                </PillButton>
                            ))}
                        </div>
                    </div>

                    {/* ROW 2 — Camera Protocol */}
                    <div className="lobby-item">
                        <div className="flex items-center gap-1.5 mb-2 text-white/60 font-mono text-[9px] uppercase tracking-widest">
                            <Camera size={12} /> <span>Camera</span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            {CAMERA_MODES.map((mode) => (
                                <PillButton key={mode.id} active={cameraMode === mode.id} onClick={() => setCameraMode(mode.id)}>
                                    {mode.name}
                                </PillButton>
                            ))}
                        </div>
                    </div>

                    {/* ROW 2 — Stardust */}
                    <div className="lobby-item">
                        <div className="flex items-center gap-1.5 mb-2 text-white/60 font-mono text-[9px] uppercase tracking-widest">
                            <Sparkles size={12} /> <span>Overlay</span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            {STARDUST_MODES.map((mode) => (
                                <PillButton key={mode.id} active={stardust === mode.id} onClick={() => setStardust(mode.id)}>
                                    {mode.name}
                                </PillButton>
                            ))}
                        </div>
                    </div>

                    {/* ROW 2 — Blend Mode */}
                    <div className="lobby-item">
                        <div className="flex items-center gap-1.5 mb-2 text-white/60 font-mono text-[9px] uppercase tracking-widest">
                            <Blend size={12} /> <span>Blend</span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            {BLEND_MODES.map((mode) => (
                                <PillButton key={mode.id} active={blendMode === mode.id} onClick={() => setBlendMode(mode.id)}>
                                    {mode.name}
                                </PillButton>
                            ))}
                        </div>
                    </div>

                    {/* ROW 2 — Chromatic Identity (Colors) */}
                    <div className="lobby-item">
                        <div className="flex items-center gap-1.5 mb-2 text-white/60 font-mono text-[9px] uppercase tracking-widest">
                            <Palette size={12} /> <span>Palette</span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            {customPalettes.map((p) => (
                                <div key={p.id} className="relative">
                                    <button
                                        onClick={() => {
                                            setActivePaletteId(p.id);
                                            setActivePicker(activePicker === p.id ? null : p.id);
                                        }}
                                        className={`w-full group relative py-2 px-3 rounded-xl border transition-all flex items-center gap-2 ${activePaletteId === p.id
                                            ? 'bg-white/10 border-white/40'
                                            : 'bg-white/5 border-white/5 hover:bg-white/10'
                                            }`}
                                    >
                                        <div className="w-4 h-4 rounded-full shrink-0 shadow-lg" style={{ background: p.color, boxShadow: `0 0 8px ${p.color}80` }}></div>
                                        <span className={`font-mono text-[8px] uppercase tracking-widest ${activePaletteId === p.id ? 'text-white font-bold' : 'text-white/40'}`}>
                                            {p.name}
                                        </span>
                                        {activePaletteId === p.id && <Check size={10} className="text-white ml-auto" />}
                                    </button>

                                    {/* Inline Color Picker */}
                                    {activePicker === p.id && (
                                        <div
                                            className="absolute bottom-full left-0 right-0 mb-2 z-50 bg-zinc-900 border border-white/20 rounded-xl p-3 shadow-2xl"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <div className="flex flex-wrap justify-center gap-2">
                                                {COLOR_PRESETS.map(color => (
                                                    <button
                                                        key={color}
                                                        onClick={() => handleColorSelect(p.id, color)}
                                                        className="w-5 h-5 rounded-full border-2 transition-transform hover:scale-125 hover:border-white"
                                                        style={{ backgroundColor: color, borderColor: p.color === color ? 'white' : 'transparent' }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ROW 3 — Sliders: Intensity & Glitch */}
                    <div className="lobby-item col-span-2">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5 text-white/60 font-mono text-[9px] uppercase tracking-widest">
                                <Zap size={12} /> <span>Intensity</span>
                            </div>
                            <span className="font-mono text-[9px] text-white/90">{(intensity * 100).toFixed(0)}%</span>
                        </div>
                        <input
                            type="range"
                            min="0.1"
                            max="3.0"
                            step="0.1"
                            value={intensity}
                            onChange={(e) => setIntensity(parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-white hover:bg-white/20 transition-colors"
                        />
                    </div>

                    <div className="lobby-item col-span-2">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5 text-white/60 font-mono text-[9px] uppercase tracking-widest">
                                <Tv size={12} /> <span>Glitch</span>
                            </div>
                            <span className="font-mono text-[9px] text-white/90">{(glitch * 100).toFixed(0)}%</span>
                        </div>
                        <input
                            type="range"
                            min="0.0"
                            max="1.0"
                            step="0.05"
                            value={glitch}
                            onChange={(e) => setGlitch(parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#f5576c] hover:bg-white/20 transition-colors"
                        />
                    </div>
                </div>

                {/* Confirm Action */}
                <div className="mt-8 flex flex-col items-center">
                    <button
                        onClick={handleLaunch}
                        className="group relative px-10 py-4 rounded-full bg-white text-black font-black text-sm md:text-base overflow-hidden transition-all hover:scale-105 active:scale-95 flex items-center gap-3 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] border-2 border-white/50 mb-6"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                        <span className="relative z-10 flex items-center gap-3 tracking-widest">
                            INITIALIZE SYSTEM <Play size={18} fill="currentColor" />
                        </span>
                    </button>

                     {/* Artifact Logs Below Launch Button */}
                     <div className="w-full">
                         {experienceId && <ArtifactLogs experienceId={experienceId} />}
                     </div>
                </div>
            </div>
        </div>
    );
}
