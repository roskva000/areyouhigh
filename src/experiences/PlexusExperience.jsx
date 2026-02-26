import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PlexusExperience() {
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

        const NUM_NODES = 120;
        const CONNECTION_DIST = 150;
        let nodes = [];

        for (let i = 0; i < NUM_NODES; i++) {
            nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 1,
                vy: (Math.random() - 0.5) * 1,
                radius: Math.random() * 2 + 1,
                energy: 0 // Used for interaction highlight
            });
        }

        let mouseX = width / 2;
        let mouseY = height / 2;

        const handleMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        // Ripple effect on click
        let ripples = [];
        const handleClick = (e) => {
            ripples.push({ x: e.clientX, y: e.clientY, radius: 0, opacity: 1 });
            // Energize nearby nodes
            nodes.forEach(n => {
                const dist = Math.hypot(n.x - e.clientX, n.y - e.clientY);
                if (dist < 200) n.energy = 1;
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('click', handleClick);

        const draw = () => {
            ctx.fillStyle = '#0a0a14';
            ctx.fillRect(0, 0, width, height);

            // Draw and update ripples
            ripples.forEach((r, idx) => {
                r.radius += 5;
                r.opacity -= 0.02;

                ctx.beginPath();
                ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(123, 97, 255, ${r.opacity})`;
                ctx.lineWidth = 2;
                ctx.stroke();

                if (r.opacity <= 0) ripples.splice(idx, 1);
            });

            // Update and Draw Nodes & Connections
            for (let i = 0; i < nodes.length; i++) {
                let n1 = nodes[i];

                // Interaction pull
                const dx = mouseX - n1.x;
                const dy = mouseY - n1.y;
                const distToMouse = Math.sqrt(dx * dx + dy * dy);

                if (distToMouse < 150) {
                    n1.x -= dx * 0.01;
                    n1.y -= dy * 0.01;
                    n1.energy = Math.max(n1.energy, 0.5);
                }

                n1.x += n1.vx;
                n1.y += n1.vy;

                // Fade energy
                if (n1.energy > 0) n1.energy -= 0.01;

                if (n1.x < 0 || n1.x > width) n1.vx *= -1;
                if (n1.y < 0 || n1.y > height) n1.vy *= -1;

                for (let j = i + 1; j < nodes.length; j++) {
                    let n2 = nodes[j];
                    let distX = n1.x - n2.x;
                    let distY = n1.y - n2.y;
                    let dist = Math.sqrt(distX * distX + distY * distY);

                    if (dist < CONNECTION_DIST) {
                        let alpha = 1 - dist / CONNECTION_DIST;
                        ctx.beginPath();
                        ctx.moveTo(n1.x, n1.y);
                        ctx.lineTo(n2.x, n2.y);
                        // Energy boost color
                        if (n1.energy > 0 || n2.energy > 0) {
                            const e = Math.max(n1.energy, n2.energy);
                            ctx.strokeStyle = `rgba(0, 242, 254, ${alpha + e})`;
                            ctx.lineWidth = 1 + e * 2;
                        } else {
                            ctx.strokeStyle = `rgba(79, 172, 254, ${alpha * 0.3})`;
                            ctx.lineWidth = 0.5;
                        }
                        ctx.stroke();
                    }
                }

                ctx.beginPath();
                ctx.arc(n1.x, n1.y, n1.radius + (n1.energy * 2), 0, Math.PI * 2);
                ctx.fillStyle = n1.energy > 0 ? '#00f2fe' : 'rgba(79, 172, 254, 0.5)';
                ctx.fill();

                if (n1.energy > 0) {
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = '#00f2fe';
                    ctx.fill();
                    ctx.shadowBlur = 0; // reset
                }
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('click', handleClick);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="relative w-screen h-[100dvh] overflow-hidden bg-[#0A0A14] selection:bg-transparent cursor-pointer">
            <button
                onClick={() => navigate('/')}
                className="absolute top-6 left-6 z-50 font-mono text-xs text-white/50 hover:text-white transition-colors uppercase tracking-widest bg-black/20 hover:bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md"
            >
                &larr; Return to Portal
            </button>
            <div className="absolute top-6 right-6 z-50 pointer-events-none">
                <span className="font-mono text-xs text-[#00f2fe]/50 uppercase tracking-widest">Click to energize network</span>
            </div>
            <canvas ref={canvasRef} className="w-full h-full block touch-none"></canvas>
        </div>
    );
}
