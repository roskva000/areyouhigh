import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Philosophy() {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Parallax effect on the background
            gsap.to('.manifesto-bg', {
                yPercent: 20,
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                },
            });

            // Text reveal
            gsap.from('.reveal-line', {
                scrollTrigger: {
                    trigger: '.manifesto-text',
                    start: 'top 80%',
                },
                y: 40,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: 'power3.out'
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} id="philosophy" className="relative w-full min-h-[80vh] bg-primary flex items-center justify-center overflow-hidden py-32">
            {/* Parallax Background Texture */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div
                    className="manifesto-bg absolute inset-0 -top-[20%] -bottom-[20%] w-full h-[140%] opacity-[0.03] bg-cover bg-center pointer-events-none"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1618172193622-ae2d025f4032?q=80&w=2664&auto=format&fit=crop")' }}
                ></div>
                <div className="absolute inset-0 bg-primary/80"></div>
            </div>

            <div className="relative z-10 manifesto-text container mx-auto px-6 md:px-16 flex flex-col items-center text-center max-w-4xl">
                <h2 className="reveal-line font-mono text-xs md:text-sm text-text/50 uppercase tracking-[0.3em] mb-8">
                    The Manifesto
                </h2>

                <p className="reveal-line font-sans text-xl md:text-2xl text-text/70 font-light mb-6 tracking-tight">
                    Most digital experiences focus on: <span className="opacity-50">passive consumption.</span>
                </p>

                <p className="reveal-line font-sans text-3xl md:text-5xl lg:text-7xl font-bold tracking-tighter text-text leading-tight">
                    We focus on: <br />
                    <span className="font-drama italic text-accent text-6xl md:text-8xl lg:text-[8rem] leading-[0.8] block mt-4">
                        Transcendence.
                    </span>
                </p>

                <div className="reveal-line mt-16 flex items-center gap-4 text-left border border-white/10 rounded-full py-2 px-6 bg-white/5 backdrop-blur-sm">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></div>
                    <span className="font-mono text-xs text-text/60">System Synchronized</span>
                </div>
            </div>
        </section>
    );
}
