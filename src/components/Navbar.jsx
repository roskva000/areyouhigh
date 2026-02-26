import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const navRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                start: 'top -50',
                onUpdate: (self) => {
                    setIsScrolled(self.scroll() > 50);
                },
            });
        }, navRef);

        return () => ctx.revert();
    }, []);

    return (
        <nav
            ref={navRef}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 rounded-full px-6 py-3 flex items-center justify-between gap-8 min-w-[320px] md:min-w-[600px] ${isScrolled
                ? 'bg-[#151520]/60 backdrop-blur-xl border border-white/10 text-text shadow-lg transform -translate-y-1'
                : 'bg-transparent text-text border border-transparent'
                }`}
        >
            <div className="font-sans font-bold text-xl tracking-tighter">
                uHigh?
            </div>

            <div className="hidden md:flex items-center gap-6 font-mono text-sm">
                <a href="#features" className="hover:-translate-y-[1px] transition-transform duration-300">Features</a>
                <a href="#philosophy" className="hover:-translate-y-[1px] transition-transform duration-300">Manifesto</a>
                <a href="#protocol" className="hover:-translate-y-[1px] transition-transform duration-300">Protocol</a>
            </div>

            <button className="relative overflow-hidden group bg-accent text-white px-5 py-2 rounded-full font-mono text-xs uppercase tracking-wider transition-all duration-[600ms] hover:scale-105 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]">
                <span className="relative z-10 transition-transform duration-500 group-hover:block">Initialize</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
            </button>
        </nav>
    );
}
