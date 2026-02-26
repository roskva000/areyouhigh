import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const MESSAGES = [
    "Turn on your music and lean back.",
    "For the best experience, press F11.",
    "Entering the void..."
];

export default function BriefingOverlay({ onComplete }) {
    const containerRef = useRef(null);
    const [currentLine, setCurrentLine] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [showCursor, setShowCursor] = useState(true);

    // Blinking cursor
    useEffect(() => {
        const interval = setInterval(() => setShowCursor(c => !c), 500);
        return () => clearInterval(interval);
    }, []);

    // Typewriter effect
    useEffect(() => {
        if (currentLine >= MESSAGES.length) {
            // All messages typed, fade out after a beat
            const timeout = setTimeout(() => {
                gsap.to(containerRef.current, {
                    opacity: 0,
                    duration: 1.5,
                    ease: "power2.inOut",
                    onComplete
                });
            }, 1200);
            return () => clearTimeout(timeout);
        }

        const message = MESSAGES[currentLine];
        let charIndex = 0;
        setDisplayedText('');

        const interval = setInterval(() => {
            charIndex++;
            setDisplayedText(message.slice(0, charIndex));
            if (charIndex >= message.length) {
                clearInterval(interval);
                // Pause then move to next line
                setTimeout(() => setCurrentLine(c => c + 1), 1000);
            }
        }, 50);

        return () => clearInterval(interval);
    }, [currentLine, onComplete]);

    // Entrance animation
    useEffect(() => {
        gsap.fromTo(containerRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 1, ease: "power2.out" }
        );
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center select-none"
        >
            {/* Already typed lines */}
            <div className="flex flex-col items-center gap-4 max-w-xl px-8">
                {MESSAGES.slice(0, currentLine).map((msg, i) => (
                    <p key={i} className="font-mono text-sm md:text-base text-white/40 tracking-widest text-center">
                        {msg}
                    </p>
                ))}

                {/* Currently typing line */}
                {currentLine < MESSAGES.length && (
                    <p className="font-mono text-sm md:text-base text-white tracking-widest text-center">
                        {displayedText}
                        <span className={`inline-block w-[2px] h-4 bg-white ml-1 align-middle transition-opacity ${showCursor ? 'opacity-100' : 'opacity-0'}`}></span>
                    </p>
                )}
            </div>

            {/* Skip hint */}
            <button
                onClick={() => {
                    gsap.to(containerRef.current, {
                        opacity: 0,
                        duration: 0.5,
                        ease: "power2.inOut",
                        onComplete
                    });
                }}
                className="absolute bottom-12 font-mono text-[10px] text-white/20 uppercase tracking-[0.3em] hover:text-white/50 transition-colors"
            >
                Press to skip
            </button>
        </div>
    );
}
