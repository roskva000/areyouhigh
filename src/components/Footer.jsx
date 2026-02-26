export default function Footer() {
    return (
        <footer className="w-full bg-[#0A0A14] rounded-t-[4rem] px-8 md:px-16 pt-24 pb-12 mt-12 relative overflow-hidden z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-accent/10 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10 mb-24">
                <div className="md:col-span-2">
                    <h2 className="font-sans font-bold text-3xl tracking-tighter text-text mb-4">uHigh?</h2>
                    <p className="font-mono text-text/50 text-sm max-w-sm leading-relaxed mb-8 italic">
                        "If you're asking the question, you're already in the right place. A digital sanctuary where pixels dance at the speed of your consciousness, and reality is just a rendering error."
                    </p>
                    <div className="flex items-center gap-3 bg-[#151520] border border-white/5 py-2 px-4 rounded-full w-fit">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-[pulse_2s_ease-in-out_infinite]"></div>
                        <span className="font-mono text-[10px] text-green-500 uppercase tracking-widest leading-none">Consciousness Operational</span>
                    </div>
                </div>

                <div>
                    <h4 className="font-mono text-xs text-text/40 uppercase tracking-wider mb-6">Discovery</h4>
                    <ul className="space-y-4 font-sans text-sm text-text/70">
                        <li><a href="#experiences" className="hover:text-accent transition-colors">Visual Artifacts</a></li>
                        <li><a href="#philosophy" className="hover:text-accent transition-colors">Digital Manifesto</a></li>
                        <li><a href="/gallery" className="hover:text-accent transition-colors">The Endless Gallery</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-mono text-xs text-text/40 uppercase tracking-wider mb-6">Archive</h4>
                    <ul className="space-y-4 font-sans text-sm text-text/70">
                        <li><a href="#" className="hover:text-accent transition-colors">Privacy Pattern</a></li>
                        <li><a href="#" className="hover:text-accent transition-colors">Conditions of Trip</a></li>
                        <li><a href="#" className="hover:text-accent transition-colors">Safety Protocols</a></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 font-mono text-xs text-text/40">
                <p>
                    Created & Flyed by <a href="https://psyfurkan.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">PsyFurkan</a>
                </p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <a href="https://instagram.com/psyfurkan" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">INSTAGRAM</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); alert('Discord: roskva666'); }} className="hover:text-white transition-colors">DISCORD</a>
                </div>
            </div>
        </footer>
    );
}
