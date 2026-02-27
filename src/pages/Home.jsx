import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Philosophy from '../components/Philosophy';
import Experiences from '../components/Experiences';
import Footer from '../components/Footer';

export default function Home() {
    const location = useLocation();

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
