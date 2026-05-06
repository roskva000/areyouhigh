import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const ADJECTIVES = [
    'Silent', 'Neon', 'Cosmic', 'Lost', 'Hidden', 'Solar', 'Lunar', 'Digital', 'Analog', 'Quantum',
    'Ethereal', 'Hollow', 'Vivid', 'Dark', 'Pale', 'Rapid', 'Slow', 'Timeless', 'Ancient', 'Future'
];

const NOUNS = [
    'Traveler', 'Ghost', 'Signal', 'Echo', 'Shadow', 'Drifter', 'Pilot', 'Nomad', 'Entity', 'Spark',
    'Fragment', 'Glitch', 'Phantom', 'Oracle', 'Specter', 'Wraith', 'Observer', 'Dreamer', 'Voyager', 'System'
];

const generateNickname = () => {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    return `${adj} ${noun}`;
};

// Helper to get or create storage items synchronously for initial state if possible
// But since we want to be safe with SSR (though this is Vite SPA), we can do lazy init
const getStoredIdentity = () => {
    let storedId = localStorage.getItem('experience_user_id');
    let storedNick = localStorage.getItem('experience_user_nick');

    // 🛡️ Sentinel: Validate untrusted local storage input to prevent payload injection/storage exhaustion
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (storedId && (!uuidRegex.test(storedId) || storedId.length > 36)) {
        storedId = null;
    }

    if (storedNick && (typeof storedNick !== 'string' || storedNick.length > 50)) {
        storedNick = null;
    }

    if (!storedId) {
        storedId = uuidv4();
        localStorage.setItem('experience_user_id', storedId);
    }

    if (!storedNick) {
        storedNick = generateNickname();
        localStorage.setItem('experience_user_nick', storedNick);
    }
    return { id: storedId, nick: storedNick };
};

export default function useUserIdentity() {
    // Lazy initialization to avoid effect dependency issues and ensure consistent ID
    const [identity] = useState(() => {
        // Check if window is defined (for build safety)
        if (typeof window !== 'undefined') {
            return getStoredIdentity();
        }
        return { id: null, nick: '' };
    });

    return { userId: identity.id, nickname: identity.nick };
}
