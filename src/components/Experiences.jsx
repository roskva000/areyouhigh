import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const experiences = [
    {
        id: 'fractal',
        title: 'Otonom Fraktal Motoru',
        desc: 'Sürekli evrilen matematiksel rüyalar ve derin boyut zoomlaması.',
        bg: '#0a0a14',
        accent: '#7b61ff'
    },
    {
        id: 'fluid',
        title: 'Sıvı Neon Simülasyonu',
        desc: 'Farenin hareketine göre dağılan ve renk değiştiren karanlık akışkan dinamikleri.',
        bg: '#0e0e1a',
        accent: '#00f2fe'
    },
    {
        id: 'particles',
        title: 'Kinetik Kum Fırtınası',
        desc: 'On binlerce dijital parçacığın matematiksel uzayda kaotik dansı.',
        bg: '#12121e',
        accent: '#f5576c'
    },
    {
        id: 'tunnel',
        title: 'Boyutsal Tüneller',
        desc: 'Zaman algısını büken, gittikçe hızlanan ışık tüneli ve warp hissi.',
        bg: '#161626',
        accent: '#f093fb'
    },
    {
        id: 'plexus',
        title: 'Nöro-Akustik Ağlar',
        desc: 'Birbirine duyarlı parlayan noktaların kozmik ağ (plexus) yapısı.',
        bg: '#1a1a2e',
        accent: '#4facfe'
    },
    {
        id: 'mandala',
        title: 'Sacred Geometry',
        desc: 'İç içe dönen kompleks ve simetrik kutsal geometri mandalaları.',
        bg: '#1f1f3a',
        accent: '#fdfbfb'
    }
];

export default function Experiences() {
    const containerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.portal-card', {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 80%',
                },
                y: 60,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out'
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} id="experiences" className="w-full py-32 px-6 md:px-16 container mx-auto bg-background">
            <div className="text-center mb-24">
                <h2 className="font-sans font-bold text-4xl md:text-6xl text-text tracking-tighter mb-4">
                    Görsel Şölen <span className="font-drama italic text-accent pr-2">Portalları.</span>
                </h2>
                <p className="font-mono text-text/50 max-w-lg mx-auto text-sm">Gerçeklik algınızı esnetecek, tam ekran etkileşimli deneyimler.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {experiences.map((exp, index) => (
                    <div
                        key={exp.id}
                        className="portal-card group relative h-80 rounded-[2rem] overflow-hidden cursor-pointer"
                        onClick={() => navigate(`/experience/${exp.id}`)}
                    >
                        {/* Background Base */}
                        <div className="absolute inset-0 transition-colors duration-500" style={{ backgroundColor: exp.bg }}></div>

                        {/* Hover Glow Effect */}
                        <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                            style={{ background: `radial-gradient(circle at center, ${exp.accent}33 0%, transparent 70%)` }}
                        ></div>

                        {/* Content Container */}
                        <div className="absolute inset-0 p-8 flex flex-col justify-end z-10 border border-white/5 rounded-[2rem] transition-all duration-500 group-hover:border-white/20">
                            <span className="font-mono text-xs uppercase tracking-widest text-text/40 mb-4 group-hover:text-text/70 transition-colors">
                                Portal 0{index + 1}
                            </span>
                            <h3 className="font-sans font-bold text-2xl text-text mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                {exp.title}
                            </h3>
                            <p className="font-mono text-xs text-text/50 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 ease-out transform translate-y-4 group-hover:translate-y-0">
                                {exp.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
