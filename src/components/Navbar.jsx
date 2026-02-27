import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    // Check if we are on the home page or gallery
    const isHome = location.pathname === '/';
    const isGallery = location.pathname === '/gallery';

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-[5000] transition-all duration-300 ${scrolled || !isHome
                    ? 'bg-black/50 backdrop-blur-md border-b border-white/5 py-4'
                    : 'bg-transparent py-6'
                }`}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="text-2xl font-black tracking-tighter text-white group">
                    <span className="text-white group-hover:text-accent transition-colors">u</span>High?
                </Link>

                {/* Links */}
                <div className="hidden md:flex items-center gap-8">
                    <Link
                        to="/gallery"
                        className={`font-mono text-sm uppercase tracking-widest transition-colors ${isGallery ? 'text-accent font-bold' : 'text-white/60 hover:text-white'
                            }`}
                    >
                        Artifacts
                    </Link>
                    <Link
                        to="/manifesto"
                        className="font-mono text-sm uppercase tracking-widest text-white/60 hover:text-white transition-colors"
                    >
                        Manifesto
                    </Link>
                </div>

                {/* CTA - Now links to Gallery as requested */}
                <Link
                    to="/gallery"
                    className="relative group px-5 py-2 overflow-hidden rounded-full border border-white/20 hover:border-accent/50 transition-all"
                >
                    <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-colors"></div>
                    <span className="relative font-mono text-xs font-bold uppercase tracking-widest text-white group-hover:text-accent transition-colors flex items-center gap-2">
                        Enter Gallery
                    </span>
                </Link>
            </div>
        </nav>
    );
}
