import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

// --- Card 1: Diagnostic Shuffler ---
function DiagnosticShuffler() {
    const [cards, setCards] = useState([
        { id: 1, title: 'Sürekli Evrim', color: 'bg-[#151520]' },
        { id: 2, title: 'Matematiksel Rüyalar', color: 'bg-[#1a1a2e]' },
        { id: 3, title: 'Algoritmik Trans', color: 'bg-[#251e3e]' },
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCards((prevCards) => {
                const newCards = [...prevCards];
                const last = newCards.pop();
                newCards.unshift(last);
                return newCards;
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative h-64 w-full flex items-center justify-center perspective-[1000px]">
            {cards.map((card, index) => {
                // Calculate offset and scale based on position
                const yOffset = index * 20;
                const scale = 1 - index * 0.05;
                const zIndex = 3 - index;
                const opacity = 1 - index * 0.2;

                return (
                    <div
                        key={card.id}
                        className={`absolute w-full max-w-sm p-6 rounded-[2rem] border border-white/5 shadow-2xl transition-all duration-[800ms] ${card.color} flex flex-col justify-between`}
                        style={{
                            transform: `translateY(${yOffset}px) scale(${scale})`,
                            zIndex: zIndex,
                            opacity: opacity,
                            transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                        }}
                    >
                        <div className="flex justify-between items-center mb-8">
                            <span className="font-mono text-xs text-accent">Process 0{card.id}</span>
                            <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                        </div>
                        <div>
                            <h3 className="font-sans font-bold text-lg text-text">{card.title}</h3>
                            <p className="font-mono text-xs text-text/50 mt-2">Otonom Fraktal Motoru</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// --- Card 2: Telemetry Typewriter ---
function TelemetryTypewriter() {
    const messages = [
        '> Initializing frequency sync...',
        '> Calibrating delta waves...',
        '> Synchronizing visual cortex...',
        '> Acoustic resonance confirmed.',
        '> Awaiting neural handshake...'
    ];
    const [text, setText] = useState('');
    const [msgIndex, setMsgIndex] = useState(0);

    useEffect(() => {
        let currentText = '';
        const targetMsg = messages[msgIndex];
        let charIndex = 0;

        const typeInterval = setInterval(() => {
            if (charIndex < targetMsg.length) {
                currentText += targetMsg[charIndex];
                setText(currentText);
                charIndex++;
            } else {
                clearInterval(typeInterval);
                setTimeout(() => {
                    setMsgIndex((prev) => (prev + 1) % messages.length);
                }, 2000);
            }
        }, 50);

        return () => clearInterval(typeInterval);
    }, [msgIndex]);

    return (
        <div className="h-64 w-full bg-[#151520] rounded-[2rem] border border-white/5 p-6 flex flex-col relative overflow-hidden group">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-sans font-bold text-lg text-text">Nöro-Akustik Dinamikler</h3>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="font-mono text-xs text-red-500 uppercase tracking-widest">Live Feed</span>
                </div>
            </div>
            <div className="flex-1 font-mono text-xs md:text-sm text-accent/80 leading-relaxed font-light">
                <p className="break-words">
                    {text}
                    <span className="inline-block w-2.5 h-[1.2em] bg-accent ml-1 animate-pulse align-middle"></span>
                </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#151520] via-transparent to-transparent pointer-events-none"></div>
        </div>
    );
}

// --- Card 3: Cursor Protocol Scheduler ---
function CursorScheduler() {
    const containerRef = useRef(null);
    const cursorRef = useRef(null);
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const [activeDay, setActiveDay] = useState(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

            // Cursor enters
            tl.fromTo(cursorRef.current, { x: 0, y: 150, opacity: 0 }, { x: 80, y: 60, opacity: 1, duration: 1, ease: 'power2.out' })
                // Hover over Wednesday (index 3)
                .to(cursorRef.current, { x: 140, y: 40, duration: 0.8, ease: 'power2.inOut' })
                // Click press down
                .to(cursorRef.current, { scale: 0.8, duration: 0.1, onComplete: () => setActiveDay(3) })
                // Click release
                .to(cursorRef.current, { scale: 1, duration: 0.1 })
                // Move to save button
                .to(cursorRef.current, { x: 200, y: 140, duration: 0.8, ease: 'power2.inOut', delay: 0.5 })
                // Click save
                .to(cursorRef.current, { scale: 0.8, duration: 0.1, onComplete: () => setActiveDay(null) })
                .to(cursorRef.current, { scale: 1, duration: 0.1 })
                // Fade out
                .to(cursorRef.current, { y: 200, opacity: 0, duration: 0.6, delay: 0.2 });

        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="h-64 w-full bg-[#151520] rounded-[2rem] border border-white/5 p-6 flex flex-col relative overflow-hidden">
            <h3 className="font-sans font-bold text-lg text-text mb-2">Boyutsal Tüneller</h3>
            <p className="font-mono text-xs text-text/50 mb-6">Program Sequence</p>

            <div className="flex justify-between items-center mb-8 relative z-10">
                {days.map((day, i) => (
                    <div
                        key={i}
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs transition-colors duration-300 ${activeDay === i ? 'bg-accent text-white shadow-[0_0_15px_rgba(123,97,255,0.5)]' : 'bg-white/5 text-text/40'
                            }`}
                    >
                        {day}
                    </div>
                ))}
            </div>

            <div className="mt-auto flex justify-end relative z-10">
                <button className="bg-white/5 border border-white/10 text-text/70 px-4 py-2 rounded-full font-mono text-xs hover:bg-white/10 transition-colors">
                    Initialize Sync
                </button>
            </div>

            {/* SVG Animated Cursor */}
            <svg
                ref={cursorRef}
                className="absolute top-0 left-0 w-6 h-6 z-20 drop-shadow-md text-white pointer-events-none"
                style={{ transformOrigin: 'top left' }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M4 4l7.07 17 2.51-7.39L21 11.07z" />
            </svg>
        </div>
    );
}

export default function Features() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.feature-card-wrapper', {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 75%',
                },
                y: 60,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out'
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="features" className="w-full py-24 px-6 md:px-16 container mx-auto">
            <div className="mb-16">
                <h2 className="font-sans font-bold text-3xl md:text-5xl text-text tracking-tight flex flex-col gap-2">
                    <span>Interactive</span>
                    <span className="font-drama italic text-accent text-5xl md:text-7xl leading-[0.85]">Functional Artifacts.</span>
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="feature-card-wrapper">
                    <DiagnosticShuffler />
                </div>
                <div className="feature-card-wrapper">
                    <TelemetryTypewriter />
                </div>
                <div className="feature-card-wrapper">
                    <CursorScheduler />
                </div>
            </div>
        </section>
    );
}
