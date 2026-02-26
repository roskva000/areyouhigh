import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MandalaExperience() {
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

        let time = 0;
        const drawMandala = () => {
            ctx.fillStyle = 'rgba(10, 10, 20, 0.05)';
            ctx.fillRect(0, 0, width, height);

            time += 0.01;

            ctx.save();
            ctx.translate(width / 2, height / 2);
            ctx.rotate(time * 0.2);

            const layers = 6;
            const points = 12; // Symmetry count

            // Global composite op for glowing blend
            ctx.globalCompositeOperation = 'screen';

            for (let l = 1; l <= layers; l++) {
                const radius = l * 60 + Math.sin(time * 2 + l) * 20;

                ctx.beginPath();
                for (let i = 0; i <= points; i++) {
                    const angle = (i * Math.PI * 2) / points + (time * l * 0.1);
                    // Parametric petal curve
                    const x = Math.cos(angle) * radius * (1 + Math.sin(time * 3 + i) * 0.2);
                    const y = Math.sin(angle) * radius * (1 + Math.cos(time * 3 + i) * 0.2);

                    if (i === 0) ctx.moveTo(x, y);
                    else {
                        // Draw bezier curves to center for flower effect
                        ctx.quadraticCurveTo(0, 0, x, y);
                    }
                }

                const hue = (time * 50 + l * 30) % 360;
                ctx.strokeStyle = `hsla(${hue}, 80%, 60%, 0.5)`;
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }

            ctx.restore();
            animationFrameId = requestAnimationFrame(drawMandala);
        };

        drawMandala();

        return () => {
            window.removeEventListener('resize', resize);
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
            <canvas ref={canvasRef} className="w-full h-full block touch-none filter saturate-150"></canvas>
        </div>
    );
}
