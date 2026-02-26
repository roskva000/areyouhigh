import React, { useState, useEffect } from 'react';
import { Play, Zap, Palette, Gauge, ArrowLeft, Check } from 'lucide-react';
import gsap from 'gsap';

const COLOR_PRESETS = [
    '#7b61ff', // Plasma
    '#00f2fe', // Cyan
    '#f5576c', // Rose
    '#ffcc00', // Gold
    '#00ffaa', // Mint
    '#ff00ff', // Magenta
    '#ffffff', // White
];

const INITIAL_PALETTES = [
    { id: 'custom-1', name: 'Primary Flow', color: '#7b61ff' },
    { id: 'custom-2', name: 'Secondary Pulse', color: '#f5576c' },
    { id: 'custom-3', name: 'Accent Flux', color: '#00ffaa' },
];

const SPEEDS = [
    { id: 0.2, name: 'Snail' },
    { id: 1.0, name: 'Flow' },
    { id: 3.0, name: 'Warp' },
    { id: 8.0, name: 'Quantum' },
];

export default function ExperienceLobby({ title, description, onLaunch, onBack }) {
    const [speed, setSpeed] = useState(1.0);
    const [customPalettes, setCustomPalettes] = useState(() => {
        const saved = localStorage.getItem('experience_lobby_colors');
        return saved ? JSON.parse(saved) : INITIAL_PALETTES;
    });
    const [activePaletteId, setActivePaletteId] = useState('custom-1');
    const [activePicker, setActivePicker] = useState(null);
    const [intensity, setIntensity] = useState(1.0);

    const activePalette = customPalettes.find(p => p.id === activePaletteId) || customPalettes[0];

    useEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline();
            tl.fromTo(".lobby-content",
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 1.2, ease: "power4.out" }
            ).fromTo(".lobby-item",
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "power3.out" },
                "-=0.8"
            );
        });
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
            scale: 1.1,
            duration: 1.2,
            ease: "power4.inOut",
            onComplete: () => {
                const colors = customPalettes.map(p => p.color);
                onLaunch({ speed, palette: { colors }, intensity });
            }
        });
    };

    return (
        <div className="lobby-container fixed inset-0 z-[10000] flex items-center justify-center bg-[#050505] overflow-hidden p-6 selection:bg-transparent">
            {/* Ambient Background Glow */}
            <div
                className="absolute inset-0 opacity-60 blur-[160px] transition-colors duration-1000"
                style={{ background: `radial-gradient(circle at center, ${activePalette.color}, transparent 80%)` }}
            ></div>

            <div className="lobby-content relative w-full max-w-3xl bg-zinc-900 border border-white/20 rounded-[3rem] p-8 md:p-12 shadow-[0_0_100px_rgba(0,0,0,0.8)] opacity-0">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <button
                        onClick={onBack}
                        className="p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white/70 hover:text-white transition-all hover:scale-110 active:scale-90"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="text-right">
                        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter leading-none mb-2 drop-shadow-lg">
                            {title}
                        </h1>
                        <p className="font-mono text-[10px] text-accent uppercase tracking-[0.3em] font-bold">Customize the Feast</p>
                    </div>
                </div>

                <div className="space-y-10">
                    {/* Speed Selector */}
                    <div className="lobby-item">
                        <div className="flex items-center gap-2 mb-4 text-white/60 font-mono text-xs uppercase tracking-widest">
                            <Gauge size={14} /> <span>Temporal Velocity</span>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                            {SPEEDS.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => setSpeed(s.id)}
                                    className={`py-3 rounded-2xl border transition-all font-mono text-[10px] uppercase tracking-wider ${speed === s.id
                                        ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                                        : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'
                                        }`}
                                >
                                    {s.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Palette Selector - Strictly 3 cards as requested */}
                    <div className="lobby-item">
                        <div className="flex items-center gap-2 mb-4 text-white/60 font-mono text-xs uppercase tracking-widest">
                            <Palette size={14} /> <span>Chromatic Mood</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {customPalettes.map((p) => (
                                <div key={p.id} className="relative">
                                    <button
                                        onClick={() => {
                                            setActivePaletteId(p.id);
                                            setActivePicker(activePicker === p.id ? null : p.id);
                                        }}
                                        className={`w-full group relative p-5 rounded-3xl border transition-all text-left ${activePaletteId === p.id
                                            ? 'bg-white/20 border-white/60 ring-1 ring-white/40'
                                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30'
                                            }`}
                                    >
                                        <div className="w-full h-2 rounded-full mb-3 shadow-lg" style={{ background: p.color }}></div>
                                        <div className="flex justify-between items-center">
                                            <span className={`block font-mono text-[10px] uppercase tracking-wider ${activePaletteId === p.id ? 'text-white' : 'text-white/40'}`}>
                                                {p.name}
                                            </span>
                                            {activePaletteId === p.id && <Check size={12} className="text-white" />}
                                        </div>
                                    </button>

                                    {/* Inline Color Picker */}
                                    {activePicker === p.id && (
                                        <div
                                            className="absolute top-full left-0 right-0 mt-2 z-50 bg-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-300"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <div className="flex flex-wrap justify-center gap-2">
                                                {COLOR_PRESETS.map(color => (
                                                    <button
                                                        key={color}
                                                        onClick={() => handleColorSelect(p.id, color)}
                                                        className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-125"
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

                    {/* Intensity Slider */}
                    <div className="lobby-item">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-white/60 font-mono text-xs uppercase tracking-widest">
                                <Zap size={14} /> <span>Visual Intensity</span>
                            </div>
                            <span className="font-mono text-xs text-white/90">{(intensity * 100).toFixed(0)}%</span>
                        </div>
                        <input
                            type="range"
                            min="0.5"
                            max="2.0"
                            step="0.1"
                            value={intensity}
                            onChange={(e) => setIntensity(parseFloat(e.target.value))}
                            className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white"
                        />
                    </div>
                </div>

                {/* Confirm Action */}
                <div className="mt-16 flex justify-center">
                    <button
                        onClick={handleLaunch}
                        className="group relative px-12 py-5 rounded-full bg-white text-black font-bold text-lg overflow-hidden transition-all hover:scale-110 active:scale-95 flex items-center gap-3 shadow-[0_0_50px_rgba(255,255,255,0.4)]"
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            START JOURNEY <Play size={20} fill="currentColor" />
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
