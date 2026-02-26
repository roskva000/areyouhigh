import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const protocols = [
    {
        step: '01',
        title: 'Kinetik Kum Fırtınaları',
        desc: 'Bilinçaltınızın haritasını çıkaran, sürekli dönüşen dijital parçacık sistemleri.',
        Visual: () => (
            <div className="absolute inset-0 flex items-center justify-center opacity-40 mix-blend-screen">
                <svg viewBox="0 0 200 200" className="w-[80vw] md:w-[60vw] h-auto animate-[spin_60s_linear_infinite]">
                    {[...Array(12)].map((_, i) => (
                        <circle
                            key={i}
                            cx="100"
                            cy="100"
                            r={10 + i * 8}
                            fill="none"
                            stroke="url(#grad1)"
                            strokeWidth="0.5"
                            strokeDasharray={`${5 + i * 2} ${10 + i * 3}`}
                            className="origin-center"
                            style={{ animation: `spin ${10 + i * 2}s reverse linear infinite` }}
                        />
                    ))}
                    <defs>
                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#7B61FF" stopOpacity="1" />
                            <stop offset="100%" stopColor="#0A0A14" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        )
    },
    {
        step: '02',
        title: 'Sese Duyarlı Spektrum',
        desc: 'Akustik rezonans ile beyin dalgalarınızı senkronize eden, lazer tarama ritimleri.',
        Visual: () => (
            <div className="absolute inset-0 flex items-center justify-center opacity-50 overflow-hidden">
                <div className="relative w-full h-[60vh] flex flex-col justify-around px-10">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="w-full h-[1px] bg-accent/20 relative">
                            <div
                                className="absolute top-0 h-full bg-accent blur-[2px] shadow-[0_0_15px_#7B61FF]"
                                style={{
                                    width: `${20 + Math.random() * 30}%`,
                                    animation: `scan ${2 + Math.random() * 2}s ease-in-out infinite alternate ${Math.random() * 2}s`
                                }}
                            ></div>
                        </div>
                    ))}
                </div>
                <style>{`
          @keyframes scan {
            0% { transform: translateX(0); }
            100% { transform: translateX(300%); }
          }
        `}</style>
            </div>
        )
    },
    {
        step: '03',
        title: 'Neon Simülasyonu',
        desc: 'Transandantal duruma geçişinizi temsil eden, organik, nefes alan sıvı ışık formları.',
        Visual: () => (
            <div className="absolute inset-0 flex items-center justify-center opacity-60">
                <svg viewBox="0 0 100 100" className="w-[120vw] h-auto md:w-[80vw]">
                    <path
                        fill="none"
                        stroke="#7B61FF"
                        strokeWidth="0.2"
                        className="animate-pulse"
                        d="M0,50 C20,40 30,80 50,50 C70,20 80,60 100,50"
                        style={{ filter: 'drop-shadow(0 0 5px #7B61FF)' }}
                    >
                        <animate attributeName="d"
                            dur="4s"
                            repeatCount="indefinite"
                            values="
                M0,50 C20,40 30,80 50,50 C70,20 80,60 100,50;
                M0,50 C20,60 30,20 50,50 C70,80 80,40 100,50;
                M0,50 C20,40 30,80 50,50 C70,20 80,60 100,50"
                        />
                    </path>
                    <path
                        fill="none"
                        stroke="#F0EFF4"
                        strokeWidth="0.1"
                        opacity="0.5"
                        d="M0,50 C20,60 30,20 50,50 C70,80 80,40 100,50"
                    >
                        <animate attributeName="d"
                            dur="5s"
                            repeatCount="indefinite"
                            values="
                M0,50 C20,60 30,20 50,50 C70,80 80,40 100,50;
                M0,50 C20,40 30,80 50,50 C70,20 80,60 100,50;
                M0,50 C20,60 30,20 50,50 C70,80 80,40 100,50"
                        />
                    </path>
                </svg>
            </div>
        )
    }
];

export default function Protocol() {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray('.protocol-card');

            cards.forEach((card, i) => {
                // If it's not the last card, animate it scaling down and fading out
                // as the NEXT card scrolls over it.
                if (i !== cards.length - 1) {
                    gsap.to(card, {
                        scale: 0.9,
                        opacity: 0.2,
                        filter: 'blur(10px)',
                        ease: 'none',
                        scrollTrigger: {
                            trigger: cards[i + 1],
                            start: 'top bottom',
                            end: 'top top',
                            scrub: true,
                        }
                    });
                }
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} id="protocol" className="relative w-full bg-background pt-24 pb-12">
            <div className="absolute top-0 left-0 w-full text-center py-12 z-50 pointer-events-none mix-blend-difference">
                <h2 className="font-mono text-sm text-accent uppercase tracking-[0.4em]">Protocol Phases</h2>
            </div>

            {protocols.map((protocol, index) => (
                <div
                    key={index}
                    className="protocol-card sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden border-t border-white/5"
                    style={{ backgroundColor: index % 2 === 0 ? '#0b0b14' : '#0e0e1a' }}
                >
                    {/* Canvas/SVG Abstraction */}
                    <protocol.Visual />

                    {/* Content */}
                    <div className="relative z-10 p-8 md:p-16 max-w-2xl bg-black/20 backdrop-blur-md rounded-[3rem] border border-white/5 shadow-2xl items-start flex flex-col gap-6 transform transition-transform duration-700 hover:scale-[1.02]">
                        <span className="font-mono text-4xl md:text-6xl font-light text-accent/50 leading-none">
                            {protocol.step}
                        </span>
                        <h3 className="font-sans font-bold text-3xl md:text-5xl text-text tracking-tighter">
                            {protocol.title}
                        </h3>
                        <p className="font-mono text-sm md:text-base text-text/70 leading-relaxed font-light">
                            {protocol.desc}
                        </p>
                    </div>
                </div>
            ))}
        </section>
    );
}
