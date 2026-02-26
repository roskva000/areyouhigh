import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Hero() {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Entrance staggered animation
            gsap.from('.hero-text', {
                y: 40,
                opacity: 0,
                duration: 1.2,
                stagger: 0.08,
                ease: 'power3.out',
                delay: 0.2
            });

            gsap.from('.hero-cta', {
                y: 40,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                delay: 0.6
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={containerRef}
            className="relative w-full h-[100dvh] overflow-hidden bg-primary"
        >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop"
                    alt="Bioluminescence abstract"
                    className="w-full h-full object-cover opacity-60 mix-blend-screen"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 w-full h-full flex flex-col justify-end p-8 md:p-16 lg:p-24 w-full md:w-2/3 lg:w-1/2">
                <h1 className="flex flex-col gap-2">
                    <span className="hero-text font-sans font-bold text-3xl md:text-5xl lg:text-6xl text-text tracking-tighter">
                        Doğru Yerdesin
                    </span>
                    <span className="hero-text font-drama italic text-7xl md:text-8xl lg:text-[9rem] leading-[0.85] text-accent">
                        are u high?
                    </span>
                </h1>

                <p className="hero-text text-text/80 font-mono mt-8 mb-10 max-w-md text-sm md:text-base leading-relaxed">
                    Kafası güzel olanlar için sese ve harekete duyarlı psikedelik dijital sığınak. Otonom fraktal algoritmalarıyla zihninizin sınırlarını esnetin.
                </p>

                <div className="hero-cta flex items-center gap-4">
                    <button className="relative overflow-hidden group bg-accent text-white px-8 py-4 rounded-full font-mono text-sm uppercase tracking-wider transition-transform duration-[600ms] hover:scale-[1.03] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]">
                        <span className="relative z-10">Algı Kapılarını Aç</span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                    </button>
                    <span className="font-mono text-xs text-text/50 uppercase tracking-widest hidden md:inline-block">
                        System Online
                    </span>
                </div>
            </div>
        </section>
    );
}
