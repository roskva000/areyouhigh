import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ExperienceCard from '../components/ExperienceCard';
import { EXPERIENCES } from '../data/experiences';
import { Search, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Gallery() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [allVotes, setAllVotes] = useState({});

    useEffect(() => {
        const fetchVotes = async () => {
            const { data, error } = await supabase.rpc('get_all_likes');
            if (data) {
                const votesMap = {};
                data.forEach(row => {
                    votesMap[row.experience_id] = row.count;
                });
                setAllVotes(votesMap);
            }
        };
        fetchVotes();
    }, []);

    // Group experiences by Master Shader
    const masterGroups = useMemo(() => {
        const groups = {};
        EXPERIENCES.forEach(exp => {
            if (!groups[exp.master]) {
                groups[exp.master] = [];
            }
            groups[exp.master].push(exp);
        });

        // Convert map to array for sorting/filtering
        return Object.keys(groups).map(key => {
            const items = groups[key];
            const isSpecial = key.startsWith('special_');

            // For special/featured items (singletons), use their exact title
            // For groups, format the master key
            let title = items[0].title;
            if (!isSpecial) {
                 title = key
                    .split('_')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
            }

            // Calculate total likes for the group
            const totalLikes = items.reduce((sum, item) => {
                return sum + (allVotes[item.id] || 0);
            }, 0);

            return {
                id: key, // Master Key
                isSpecial,
                title: title,
                category: items[0].category,
                items: items,
                thumbId: items[0].thumbId, // Use the first item's thumb
                accent: items[0].accent,
                totalLikes: totalLikes
            };
        });
    }, [allVotes]);

    const categories = ['All', ...new Set(masterGroups.map(g => g.category))];

    const filteredGroups = masterGroups.filter(group => {
        const matchesSearch = group.title.toLowerCase().includes(search.toLowerCase()) ||
            group.items.some(item => item.title.toLowerCase().includes(search.toLowerCase()));
        const matchesCategory = activeCategory === 'All' || group.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    // Sort: Primarily by likes (descending)
    const sortedGroups = [...filteredGroups].sort((a, b) => {
        // Primary sort: Likes (Descending)
        if (b.totalLikes !== a.totalLikes) {
            return b.totalLikes - a.totalLikes;
        }
        // Secondary sort: Special items first
        if (a.isSpecial && !b.isSpecial) return -1;
        if (!a.isSpecial && b.isSpecial) return 1;
        return 0;
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        // Delay animation slightly to allow sort to settle if needed, or just run immediately
        const ctx = gsap.context(() => {
            gsap.fromTo('.gallery-card',
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.03,
                    ease: 'power2.out',
                    overwrite: 'auto' // ensure previous animations are overwritten
                }
            );
        });
        return () => ctx.revert();
    }, [activeCategory, allVotes]); // Re-animate when votes load/change sort

    const handleCardClick = (group) => {
        if (group.isSpecial) {
            // Special experiences navigate directly to the experience
            navigate(`/experience/${group.items[0].id}`);
        } else {
            // Groups navigate to the collection page
            navigate(`/gallery/${group.id}`);
        }
    };

    return (
        <div className="relative w-full min-h-screen bg-background antialiased overflow-x-hidden selection:bg-accent/30 selection:text-white">
            <Navbar />

            <main className="relative z-10 pt-40 pb-32 px-6 md:px-16 container mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
                    <div className="max-w-2xl">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 text-text/40 hover:text-text transition-colors mb-8 font-mono text-xs uppercase tracking-widest"
                        >
                            <ArrowLeft size={14} /> Back to Portal
                        </button>
                        <h1 className="font-sans font-bold text-5xl md:text-7xl text-text tracking-tighter mb-6">
                            Visual <span className="font-drama italic text-accent">Archive.</span>
                        </h1>
                        <p className="font-mono text-text/50 text-sm md:text-base leading-relaxed">
                            {EXPERIENCES.length} unique experiences organized into {masterGroups.length} master algorithms.
                            <br className="hidden md:block" />
                            Select a core shader to explore its variations.
                        </p>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col gap-4 w-full md:w-auto">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text/20 group-focus-within:text-accent transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search algorithms..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full md:w-80 bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-text focus:outline-none focus:border-accent/40 transition-all font-mono text-sm"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-2 rounded-xl border font-mono text-[10px] uppercase tracking-wider transition-all ${activeCategory === cat
                                        ? 'bg-accent text-black border-accent'
                                        : 'bg-white/5 text-text/40 border-white/5 hover:border-white/20'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {sortedGroups.map((group) => {
                        const count = group.items.length;
                        const description = group.isSpecial
                            ? group.items[0].desc
                            : `Collection of ${count} experiences based on the ${group.id} master shader.`;

                        return (
                            <ExperienceCard
                                key={group.id}
                                title={group.title}
                                category={group.category}
                                thumbId={group.thumbId}
                                accentColor={group.accent}
                                description={description}
                                isSpecial={group.isSpecial}
                                variantCount={count}
                                likeCount={group.totalLikes}
                                onClick={() => handleCardClick(group)}
                            />
                        );
                    })}

                    {sortedGroups.length === 0 && (
                        <div className="col-span-full py-20 text-center opacity-30 font-mono italic">
                            No master algorithms found matching your search.
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
