import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TunnelExperience() {
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

        // Tunnel warp speed logic
        const NUM_STARS = 400;
        let stars = [];

        for (let i = 0; i < NUM_STARS; i++) {
            stars.push({
                x: (Math.random() - 0.5) * width * 2,
                y: (Math.random() - 0.5) * height * 2,
                z: Math.random() * width,
                pz: Math.random() * width,
                color: `hsla(${250 + Math.random() * 80}, 100%, 70%, 0.8)`
            });
        }

        let speed = 2; // Initial speed

        const handleMouseMove = (e) => {
            // Increase speed as mouse moves away from center
            const dx = e.clientX - width / 2;
            const dy = e.clientY - height / 2;
            const dist = Math.sqrt(dx * dx + dy * dy);
            speed = Math.max(2, (dist / (width / 2)) * 15);
        };
        window.addEventListener('mousemove', handleMouseMove);

        const draw = () => {
            ctx.fillStyle = 'rgba(10, 10, 20, 0.3)';
            ctx.fillRect(0, 0, width, height);

            const cx = width / 2;
            const cy = height / 2;

            stars.forEach(s => {
                s.pz = s.z;
                s.z -= speed;

                if (s.z < 1) {
                    s.z = width;
                    s.x = (Math.random() - 0.5) * width * 2;
                    s.y = (Math.random() - 0.5) * height * 2;
                    s.pz = s.z;
                }

                // Perspective projection
                const sx = (s.x / s.z) * cx + cx;
                const sy = (s.y / s.z) * cy + cy;

                const px = (s.x / s.pz) * cx + cx;
                const py = (s.y / s.pz) * cy + cy;

                ctx.beginPath();
                ctx.moveTo(px, py);
                ctx.lineTo(sx, sy);
                ctx.lineCap = 'round';
                ctx.lineWidth = Math.min(10, (width / s.z) * 1.5);
                ctx.strokeStyle = s.color;

                // Add glow effect on fast speed
                if (speed > 5) {
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = s.color;
                } else {
                    ctx.shadowBlur = 0;
                }

                ctx.stroke();
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
