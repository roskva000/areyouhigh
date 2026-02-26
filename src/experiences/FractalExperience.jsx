import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FractalExperience() {
    const canvasRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width, height;
        let animationFrameId;
        let time = 0;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', resize);
        resize();

        // Mouse interaction
        let mouseX = width / 2;
        let mouseY = height / 2;
        const handleMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };
        window.addEventListener('mousemove', handleMouseMove);

        // Simple procedural "fractal-like" spiraling geometry logic
        const draw = () => {
            ctx.fillStyle = 'rgba(10, 10, 20, 0.1)';
            ctx.fillRect(0, 0, width, height);

            time += 0.02;

            const cx = width / 2;
            const cy = height / 2;
            const maxRadius = Math.min(width, height) * 0.4;

            const interactionValue = (mouseX / width) * 2;

            ctx.save();
            ctx.translate(cx, cy);

            for (let i = 0; i < 150; i++) {
                const radius = (i / 150) * maxRadius;
                const angle = time * interactionValue + i * 0.1;

                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                ctx.beginPath();
                ctx.arc(x, y, (150 - i) * 0.05, 0, Math.PI * 2);

                const hue = (time * 20 + i * 2) % 360;
                ctx.fillStyle = `hsla(${hue}, 80%, 60%, 0.8)`;
                ctx.fill();
            }

            ctx.restore();
            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="relative w-screen h-[100dvh] overflow-hidden bg-[#0A0A14] selection:bg-transparent">
            <button
                onClick={() => navigate('/')}
                className="absolute top-6 left-6 z-50 font-mono text-xs text-white/50 hover:text-white transition-colors uppercase tracking-widest bg-black/20 hover:bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md"
            >
                &larr; Return to Portal
            </button>
            <canvas ref={canvasRef} className="w-full h-full block touch-none"></canvas>
        </div>
    );
}
