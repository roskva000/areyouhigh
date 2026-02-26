import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { EXPERIENCES } from '../data/experiences';
import { Search, Filter, ArrowLeft } from 'lucide-react';

export default function Gallery() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [customColors] = useState(() => {
        const saved = localStorage.getItem('experience_colors');
        return saved ? JSON.parse(saved) : {};
    });

    const categories = ['All', ...new Set(EXPERIENCES.map(e => e.category))];

    const filtered = EXPERIENCES.filter(exp => {
        const matchesSearch = exp.title.toLowerCase().includes(search.toLowerCase()) ||
            exp.desc.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = activeCategory === 'All' || exp.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        const ctx = gsap.context(() => {
            gsap.fromTo('.gallery-card',
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.03,
                    ease: 'power2.out'
                }
            );
        });
        return () => ctx.revert();
    }, [activeCategory]);

    return (
        <div className="relative w-full min-h-screen bg-background antialiased overflow-x-hidden selection:bg-accent/30 selection:text-white">
            <Navbar />

            <main className="relative z-10 pt-40 pb-32 px-6 md:px-16 container mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
                    <div className="max-w-2xl">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 text-text/40 hover:text-text transition-colors mb-8 font-mono text-xs uppercase tracking-widest"
                        >
                            <ArrowLeft size={14} /> Back to Portal
                        </button>
                        <h1 className="font-sans font-bold text-5xl md:text-7xl text-text tracking-tighter mb-6">
                            Visual <span className="font-drama italic text-accent">Archive.</span>
                        </h1>
                        <p className="font-mono text-text/50 text-sm md:text-base leading-relaxed">
                            130 ultra-high resolution WebGL experiences and psychedelic concepts. <br className="hidden md:block" />
                            Designed to expand your mind and feel digital art to your core.
                        </p>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col gap-4 w-full md:w-auto">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text/20 group-focus-within:text-accent transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search experiences..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full md:w-80 bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-text focus:outline-none focus:border-accent/40 transition-all font-mono text-sm"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-2 rounded-xl border font-mono text-[10px] uppercase tracking-wider transition-all ${activeCategory === cat
                                        ? 'bg-accent text-black border-accent'
                                        : 'bg-white/5 text-text/40 border-white/5 hover:border-white/20'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filtered.map((exp, index) => {
                        const accentColor = customColors[exp.id] || exp.accent;

                        return (
                            <div
                                key={exp.id}
                                className="gallery-card group relative h-80 rounded-[2.5rem] overflow-hidden cursor-pointer bg-zinc-900 border border-white/10 hover:border-accent/50 transition-all duration-500 shadow-2xl"
                                onClick={() => navigate(`/experience/${exp.id}`)}
                            >
                                {/* Dynamic Background Image */}
                                <div className="absolute inset-0 z-0 bg-zinc-950">
                                    <img
                                        src={`https://images.unsplash.com/${exp.thumbId}?auto=format&fit=crop&q=80&w=800`}
                                        alt={exp.title}
                                        className="w-full h-full object-cover transition-all duration-1000 scale-110 group-hover:scale-100 opacity-40 group-hover:opacity-70 grayscale group-hover:grayscale-0"
                                        loading="lazy"
                                        onError={(e) => {
                                            e.target.src = `https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800`;
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-1"></div>
                                </div>

                                {/* Dynamic Accent Glow */}
                                <div className="absolute inset-x-0 bottom-0 h-1/2 transition-all duration-700 opacity-20 group-hover:opacity-40 z-2"
                                    style={{ background: `linear-gradient(to top, ${accentColor}, transparent)` }}></div>

                                {/* Content Over Glass */}
                                <div className="absolute inset-0 p-8 flex flex-col justify-end z-10 backdrop-blur-[2px] group-hover:backdrop-blur-none transition-all duration-500">
                                    <div className="relative transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <span className="font-mono text-[9px] uppercase tracking-[0.4em] mb-3 block group-hover:text-accent transition-colors" style={{ color: accentColor }}>
                                            {exp.category} // 0{index + 1}
                                        </span>
                                        <h3 className="font-sans font-bold text-2xl text-white mb-2 leading-tight" style={{ color: accentColor }}>
                                            {exp.title}
                                        </h3>
                                        <p className="font-mono text-[10px] text-white/40 line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                                            {exp.desc}
                                        </p>
                                    </div>
                                </div>

                                {/* Corner Indicator */}
                                <div className="absolute top-6 right-6 z-20 flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-black/40 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: accentColor }}></div>
                                    <span className="font-mono text-[8px] uppercase tracking-widest text-white/60">Active</span>
                                </div>
                            </div>
                        );
                    })}

                    {filtered.length === 0 && (
                        <div className="col-span-full py-20 text-center opacity-30 font-mono italic">
                            No portals found matching your search.
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
