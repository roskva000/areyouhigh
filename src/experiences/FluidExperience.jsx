import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FluidExperience() {
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

        // Very simple 2D particle fluid simulation proxy
        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.vx = (Math.random() - 0.5) * 5;
                this.vy = (Math.random() - 0.5) * 5;
                this.size = Math.random() * 8 + 2;
                this.life = 1;
                this.color = `hsla(${180 + Math.random() * 60}, 100%, 50%, `;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.life -= 0.01;
                this.size *= 0.98;
            }
            draw(ctx) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color + this.life + ')';
                ctx.fill();
            }
        }

        let particles = [];

        const handleMouseMove = (e) => {
            for (let i = 0; i < 5; i++) {
                particles.push(new Particle(e.clientX, e.clientY));
            }
        };
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', (e) => {
            for (let i = 0; i < 5; i++) {
                particles.push(new Particle(e.touches[0].clientX, e.touches[0].clientY));
            }
        });

        const draw = () => {
            ctx.fillStyle = 'rgba(10, 10, 20, 0.15)';
            ctx.fillRect(0, 0, width, height);

            // Add ambient particles if none
            if (Math.random() > 0.8) {
                particles.push(new Particle(width / 2 + (Math.random() - 0.5) * width * 0.5, height / 2 + (Math.random() - 0.5) * height * 0.5));
            }

            particles = particles.filter(p => p.life > 0.05);
            particles.forEach(p => {
                p.update();
                p.draw(ctx);
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
            <div className="absolute top-6 right-6 z-50 pointer-events-none">
                <span className="font-mono text-xs text-cyan-400/50 uppercase tracking-widest">Move cursor to spawn fluid</span>
            </div>
            <canvas ref={canvasRef} className="w-full h-full block touch-none filter blur-[4px] contrast-[1.5]"></canvas>
        </div>
    );
}
