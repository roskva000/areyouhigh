import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import useIdleHide from '../hooks/useIdleHide';
import { MessageCircle, X, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import useUserIdentity from '../hooks/useUserIdentity';
import gsap from 'gsap';

export default function GlobalChat() {
    const { userId } = useUserIdentity();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const messagesEndRef = useRef(null);
    const chatRef = useRef(null);
    const location = useLocation();
    const isExperienceRoute = location.pathname.startsWith('/experience/');
    const { idle } = useIdleHide(5000);

    // Fetch initial messages and subscribe
    useEffect(() => {
        const fetchMessages = async () => {
            const { data } = await supabase
                .from('global_chat')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50);

            if (data) setMessages(data.reverse());
        };

        fetchMessages();

        const channel = supabase
            .channel('public:global_chat')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'global_chat' },
                (payload) => {
                    setMessages(prev => {
                        const newArr = [...prev, payload.new];
                        return newArr.length > 50 ? newArr.slice(-50) : newArr;
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // Scroll to bottom on new message
    useEffect(() => {
        if (isOpen && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    // Cooldown timer using robust timeout sequence
    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => {
                setCooldown(c => c - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !userId || cooldown > 0) return;

        const content = newMessage.trim();
        setNewMessage('');
        setCooldown(5); // 5 seconds cooldown

        const { error } = await supabase
            .from('global_chat')
            .insert({
                user_id: userId,
                content: content.substring(0, 140)
            });

        if (error) {
            console.error('Chat error:', error);
        }
    };

    // Force close if idle during experience
    useEffect(() => {
        if (isExperienceRoute && idle && isOpen) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsOpen(false);
        }
    }, [isExperienceRoute, idle, isOpen]);

    // Toggle Animation
    useEffect(() => {
        if (isOpen) {
            gsap.to(chatRef.current, { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" });
        } else {
            gsap.to(chatRef.current, { x: '100%', opacity: 0, duration: 0.5, ease: "power3.in" });
        }
    }, [isOpen]);

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-[9999] p-4 bg-accent/10 hover:bg-accent text-accent hover:text-black border border-accent/20 rounded-full backdrop-blur-md transition-all duration-700 group shadow-[0_0_20px_rgba(0,0,0,0.5)] ${isExperienceRoute && idle ? 'opacity-0 pointer-events-none translate-y-10' : 'opacity-100 translate-y-0'}`}
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                )}
            </button>

            {/* Chat Panel */}
            <div
                ref={chatRef}
                className="fixed bottom-24 right-6 w-80 h-96 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-[9998] flex flex-col overflow-hidden translate-x-full opacity-0"
            >
                {/* Header */}
                <div className="p-3 border-b border-white/10 flex items-center justify-between bg-white/5">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-accent font-bold flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        Global Stream
                    </span>
                    <span className="font-mono text-[8px] text-white/30">Anonymous Protocol</span>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    {messages.length === 0 && (
                        <div className="text-center mt-10">
                            <p className="font-mono text-[9px] text-white/20 italic">
                                Signal silence...
                            </p>
                        </div>
                    )}
                    {messages.map((msg) => {
                        const isMe = msg.user_id === userId;
                        return (
                            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                <div
                                    className={`max-w-[85%] px-3 py-2 rounded-lg font-mono text-[10px] leading-relaxed break-words ${isMe
                                        ? 'bg-accent/20 text-accent border border-accent/20'
                                        : 'bg-white/5 text-white/80 border border-white/5'
                                        }`}
                                >
                                    {msg.content}
                                </div>
                                {/* No nickname shown as per instructions "sadece yazdığı şeyi görebilecekler" */}
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-white/5 relative">
                    <div className="relative">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder={cooldown > 0 ? `Wait ${cooldown}s...` : "Transmit signal..."}
                            disabled={cooldown > 0}
                            maxLength={140}
                            className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 pl-3 pr-10 text-white font-mono text-[10px] focus:outline-none focus:border-accent/50 transition-all placeholder:text-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <button
                            type="submit"
                            disabled={!newMessage.trim() || cooldown > 0}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-accent disabled:opacity-30 disabled:hover:text-white/40 transition-colors"
                        >
                            <Send size={14} />
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
