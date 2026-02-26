import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link, useLocation } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = [
    { name: 'Artifacts', href: '#experiences' },
    { name: 'Manifesto', href: '#philosophy' },
    { name: 'Gallery', href: '/gallery', isExternal: true },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const navRef = useRef(null);
    const location = useLocation();
    const isHome = location.pathname === '/';

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Background transition on scroll
            ScrollTrigger.create({
                start: 'top -50',
                onUpdate: (self) => {
                    setIsScrolled(self.scroll() > 50);
                },
            });

            // Section tracking
            if (isHome) {
                NAV_LINKS.filter(link => !link.isExternal).forEach((link) => {
                    const sectionId = link.href.replace('#', '');
                    ScrollTrigger.create({
                        trigger: `#${sectionId}`,
                        start: 'top 50%',
                        end: 'bottom 50%',
                        onToggle: (self) => {
                            if (self.isActive) setActiveSection(link.href);
                        }
                    });
                });
            }
        }, navRef);

        return () => ctx.revert();
    }, [isHome]);

    return (
        <nav
            ref={navRef}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 rounded-full px-6 py-3 flex items-center justify-between gap-8 min-w-[320px] md:min-w-[600px] ${isScrolled
                ? 'bg-[#151520]/60 backdrop-blur-xl border border-white/10 text-white shadow-lg transform -translate-y-1'
                : 'bg-transparent text-white border border-transparent'
                }`}
        >
            <Link to="/" className="font-sans font-bold text-xl tracking-tighter">
                uHigh?
            </Link>

            <div className="hidden md:flex items-center gap-6 font-mono text-sm">
                {NAV_LINKS.map(link => (
                    link.isExternal ? (
                        <Link
                            key={link.name}
                            to={link.href}
                            className={`hover:text-accent transition-colors duration-300 ${activeSection === link.href ? 'text-accent' : ''}`}
                        >
                            {link.name}
                        </Link>
                    ) : (
                        <a
                            key={link.name}
                            href={link.href}
                            className={`hover:text-accent transition-colors duration-300 ${activeSection === link.href ? 'text-accent' : ''}`}
                        >
                            {link.name}
                        </a>
                    )
                ))}
            </div>

            <button
                onClick={() => isHome ? window.scrollTo({ top: 0, behavior: 'smooth' }) : window.location.href = '/'}
                className="relative overflow-hidden group bg-accent text-white px-5 py-2 rounded-full font-mono text-xs uppercase tracking-wider transition-all duration-[600ms] hover:scale-105 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
            >
                <span className="relative z-10">{isHome ? 'Initialize' : 'Return Home'}</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
            </button>
        </nav>
    );
}
