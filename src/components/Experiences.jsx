import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EXPERIENCES } from '../data/experiences';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Experiences() {
    const containerRef = useRef(null);
    const navigate = useNavigate();
    const [customColors] = useState(() => {
        const saved = localStorage.getItem('experience_colors');
        return saved ? JSON.parse(saved) : {};
    });

    // Featured experiences (top 6 as per request, 2 rows of 3)
    const featured = EXPERIENCES.slice(0, 6);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.portal-card',
                { y: 60, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 80%',
                    },
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power3.out'
                }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} id="experiences" className="w-full py-32 px-6 md:px-16 container mx-auto bg-background">
            <div className="text-center mb-24">
                <h2 className="font-sans font-bold text-4xl md:text-6xl text-text tracking-tighter mb-4">
                    Visual Feast <span className="font-drama italic text-accent pr-2">Portals.</span>
                </h2>
                <p className="font-mono text-text/50 max-w-lg mx-auto text-sm">
                    Click each portal to change its color and build your own psychedelic world.
                </p>
            </div>

            {/* strictly 3 columns on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-20">
                {featured.map((exp, index) => {
                    const accentColor = customColors[exp.id] || exp.accent;

                    return (
                        <div
                            key={exp.id}
                            className="portal-card group relative h-96 rounded-[2.5rem] overflow-hidden cursor-pointer bg-zinc-900 border border-white/10 hover:border-accent/50 transition-all duration-500 shadow-2xl"
                        >
                            {/* Dynamic Background Image */}
                            <div className="absolute inset-0 z-0 bg-zinc-950" onClick={() => navigate(`/experience/${exp.id}`)}>
                                <img
                                    src={`https://images.unsplash.com/${exp.thumbId}?auto=format&fit=crop&q=80&w=800`}
                                    alt={exp.title}
                                    className="w-full h-full object-cover transition-all duration-1000 scale-110 group-hover:scale-100 opacity-50 group-hover:opacity-80 grayscale group-hover:grayscale-0"
                                    loading="lazy"
                                    onError={(e) => {
                                        e.target.src = `https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800`;
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-1"></div>
                            </div>

                            {/* Hover Glow Effect */}
                            <div
                                className="absolute inset-x-0 bottom-0 h-2/3 opacity-0 group-hover:opacity-40 transition-opacity duration-700 z-2 pointer-events-none"
                                style={{ background: `linear-gradient(to top, ${accentColor}, transparent)` }}
                            ></div>

                            {/* Content Container */}
                            <div className="absolute inset-0 p-10 flex flex-col justify-end z-10 backdrop-blur-[2px] group-hover:backdrop-blur-none transition-all duration-500 pointer-events-none">
                                <div className="relative transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                                    <span className="font-mono text-xs uppercase tracking-[0.4em] mb-4 block group-hover:text-accent transition-colors" style={{ color: accentColor }}>
                                        Portal // 0{index + 1}
                                    </span>
                                    <h3 className="font-sans font-bold text-3xl text-white mb-3 leading-tight">
                                        {exp.title}
                                    </h3>
                                    <p className="font-mono text-xs text-white/40 line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                                        {exp.desc}
                                    </p>
                                </div>
                            </div>

                            {/* Corner Indicator */}
                            <div className="absolute top-8 right-8 z-20 flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/10 bg-black/40 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }}></div>
                                <span className="font-mono text-[10px] uppercase tracking-widest text-white/60">Ready</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="max-w-7xl mx-auto px-8 md:px-16 mb-20 relative z-10">
                <h3 className="font-mono text-xs text-accent uppercase tracking-[0.4em] mb-6 animate-pulse">// Visual Collection</h3>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <h2 className="font-drama italic text-5xl md:text-8xl text-text tracking-tighter leading-none mb-4">
                            Artifact <span className="text-accent underline decoration-white/10 underline-offset-8">Lobby.</span>
                        </h2>
                        <p className="font-mono text-xs text-text/40 uppercase tracking-[0.3em]">Select. Customize. Transcend.</p>
                    </div>

                    <Link
                        to="/gallery"
                        className="group flex items-center gap-4 bg-white/5 border border-white/10 px-8 py-4 rounded-full font-mono text-xs uppercase tracking-widest hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
                    >
                        Browse All 130+ <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
