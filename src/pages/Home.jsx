import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Philosophy from '../components/Philosophy';
import Experiences from '../components/Experiences';
import Protocol from '../components/Protocol';
import Footer from '../components/Footer';

export default function Home() {
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
