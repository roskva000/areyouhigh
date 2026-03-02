import React from 'react';
import { Layers, Heart } from 'lucide-react';

const ExperienceCard = ({
    title,
    category,
    thumbId,
    accentColor,
    description,
    isSpecial = false,
    variantCount = 0,
    likeCount = 0,
    onClick,
    group,
    index = 0
}) => {
    const handleClick = () => {
        if (onClick && group) {
            onClick(group);
        } else if (onClick) {
            onClick();
        }
    };

    return (
        <div
            className="gallery-card group relative h-80 rounded-[2.5rem] overflow-hidden cursor-pointer bg-zinc-900 border border-white/10 hover:border-accent/50 transition-all duration-500 shadow-2xl"
            onClick={handleClick}
        >
            {/* Dynamic Background Image */}
            <div className="absolute inset-0 z-0 bg-zinc-950">
                <img
                    src={`https://images.unsplash.com/${thumbId}?auto=format&fit=crop&q=80&w=800`}
                    alt={title}
                    className="w-full h-full object-cover transition-all duration-1000 scale-110 group-hover:scale-100 opacity-40 group-hover:opacity-70 grayscale group-hover:grayscale-0"
                    loading="lazy"
                    onError={(e) => {
                        e.target.src = `https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800`;
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-1"></div>
            </div>

            {/* Dynamic Accent Glow */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 transition-all duration-700 opacity-20 group-hover:opacity-40 z-2"
                style={{ background: `linear-gradient(to top, ${accentColor}, transparent)` }}></div>

            {/* Content Over Glass */}
            <div className="absolute inset-0 p-8 flex flex-col justify-end z-10 backdrop-blur-[2px] group-hover:backdrop-blur-none transition-all duration-500">
                <div className="relative transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-[9px] uppercase tracking-[0.4em] block group-hover:text-accent transition-colors" style={{ color: accentColor }}>
                                {category} {index > 0 && `// 0${index}`}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                             {likeCount > 0 && (
                                <span className="flex items-center gap-1 font-mono text-[9px] text-white/50 bg-white/10 px-2 py-0.5 rounded-full backdrop-blur-md">
                                    <Heart size={10} className="text-red-500 fill-red-500" /> {likeCount}
                                </span>
                            )}
                            {!isSpecial && variantCount > 0 && (
                                <span className="flex items-center gap-1 font-mono text-[9px] text-white/50 bg-white/10 px-2 py-0.5 rounded-full backdrop-blur-md">
                                    <Layers size={10} /> {variantCount} Var.
                                </span>
                            )}
                        </div>
                    </div>

                    <h3 className="font-sans font-bold text-2xl text-white mb-2 leading-tight" style={{ color: accentColor }}>
                        {title}
                    </h3>

                    <p className="font-mono text-[10px] text-white/40 line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                        {description}
                    </p>
                </div>
            </div>

            {/* Special Badge for Featured Items */}
            {isSpecial && (
                <div className="absolute top-6 right-6 z-20 flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-black/40 backdrop-blur-md">
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-white"></div>
                    <span className="font-mono text-[8px] uppercase tracking-widest text-white/80">Special</span>
                </div>
            )}
        </div>
    );
};

export default React.memo(ExperienceCard);
