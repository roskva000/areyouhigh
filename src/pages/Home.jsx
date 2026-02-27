import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Philosophy from '../components/Philosophy';
import Experiences from '../components/Experiences';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

export default function Home() {
    const location = useLocation();

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "uHigh?",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Web",
        "description": "Explore 130+ unique, GPU-accelerated psychedelic visual experiences for meditation and focus.",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "author": {
            "@type": "Person",
            "name": "PsyFurkan"
        }
    };

    useEffect(() => {
        if (location.hash) {
            const id = location.hash.substring(1);
            const element = document.getElementById(id);
            if (element) {
                // Small delay to ensure components are rendered
                setTimeout(() => {
                    const offset = 80;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }, 100);
            }
        }
    }, [location]);

    return (
        <div className="relative w-full antialiased overflow-hidden selection:bg-accent/30 selection:text-white">
            <SEO
                title="Home — Visual Sanctuary"
                description="Explore 130+ unique, GPU-accelerated psychedelic visual experiences. A digital sanctuary for meditation, focus, and consciousness exploration."
                jsonLd={jsonLd}
            />
            <Navbar />
            <Hero />
            <main className="relative z-10 bg-background w-full min-h-screen">
                <Philosophy />
                <Experiences />
            </main>
            <Footer />
        </div>
    );
}
