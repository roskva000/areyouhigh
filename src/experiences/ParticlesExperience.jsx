import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ParticlesExperience() {
    const canvasRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width, height;
        let animationFrameId;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        window.addEventListener('resize', resize);
        resize();

        // Attractor logic
        const NUM_PARTICLES = 1500;
        let particles = [];

        for (let i = 0; i < NUM_PARTICLES; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: 0,
                vy: 0,
                color: `hsla(${330 + Math.random() * 40}, 80%, 60%, 0.6)`
            });
        }

        let mouseX = width / 2;
        let mouseY = height / 2;

        const handleMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };
        window.addEventListener('mousemove', handleMouseMove);

        const draw = () => {
            ctx.fillStyle = 'rgba(10, 10, 20, 0.2)';
            ctx.fillRect(0, 0, width, height);

            particles.forEach(p => {
                // Calculate distance to mouse
                const dx = mouseX - p.x;
                const dy = mouseY - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;

                // Gravitational pull logic (adds chaotic orbit)
                const force = Math.min(5000 / (dist * dist), 0.5);

                // Attract and swirl
                p.vx += (dx / dist) * force - (dy / dist) * (force * 0.5);
                p.vy += (dy / dist) * force + (dx / dist) * (force * 0.5);

                // Friction
                p.vx *= 0.96;
                p.vy *= 0.96;

                p.x += p.vx;
                p.y += p.vy;

                // Wrap around boundaries
                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
                ctx.fill();
            });

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
