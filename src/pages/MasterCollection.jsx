import React, { useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import gsap from 'gsap';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ExperienceCard from '../components/ExperienceCard';
import { EXPERIENCES } from '../data/experiences';
import { ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';

export default function MasterCollection() {
    const { masterId } = useParams();
    const navigate = useNavigate();

    // Find experiences matching the master shader
    const variations = EXPERIENCES.filter(exp => exp.master === masterId);

    // Human-readable title from master key (e.g., "fractal_mandelbrot" -> "Fractal Mandelbrot")
    const masterTitle = masterId
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    const handleCardClick = useCallback((exp) => {
        navigate(`/experience/${exp.id}`);
    }, [navigate]);

    useEffect(() => {
        window.scrollTo(0, 0);
        const ctx = gsap.context(() => {
            gsap.fromTo('.gallery-card',
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.05,
                    ease: 'power2.out'
                }
            );
        });
        return () => ctx.revert();
    }, [masterId]);

    if (variations.length === 0) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono">
                Master shader not found.
                <button onClick={() => navigate('/gallery')} className="ml-4 underline">Back</button>
            </div>
        );
    }

    return (
        <div className="relative w-full min-h-screen bg-background antialiased overflow-x-hidden selection:bg-accent/30 selection:text-white">
            <SEO
                title={`${masterTitle} Variations`}
                description={`Explore ${variations.length} distinct configurations for the ${masterTitle} algorithm.`}
            />
            <Navbar />

            <main className="relative z-10 pt-40 pb-32 px-6 md:px-16 container mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
                    <div className="max-w-3xl">
                        <button
                            onClick={() => navigate('/gallery')}
                            className="flex items-center gap-2 text-text/40 hover:text-text transition-colors mb-8 font-mono text-xs uppercase tracking-widest group"
                        >
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Collections
                        </button>
                        <h1 className="font-sans font-bold text-4xl md:text-6xl text-text tracking-tighter mb-4">
                            {masterTitle} <span className="font-drama italic text-accent">Variations.</span>
                        </h1>
                        <p className="font-mono text-text/50 text-sm md:text-base leading-relaxed max-w-2xl">
                            Exploring the parameter space of the <strong>{masterId}</strong> algorithm.
                            <br className="hidden md:block" />
                            {variations.length} distinct configurations available.
                        </p>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {variations.map((exp, index) => {
                        return (
                            <ExperienceCard
                                key={exp.id}
                                title={exp.title}
                                category={exp.category}
                                thumbId={exp.thumbId}
                                accentColor={exp.accent}
                                description={exp.desc}
                                isSpecial={false}
                                variantCount={0}
                                index={index + 1}
                                onClick={handleCardClick}
                                group={exp}
                            />
                        );
                    })}
                </div>
            </main>

            <Footer />
        </div>
    );
}
