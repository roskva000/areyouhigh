import { useState, useEffect, useCallback } from 'react';

/**
 * Hook that returns true when the user has been idle (no mouse movement) for `timeout` ms.
 * Resets on any mouse movement.
 */
export default function useIdleHide(timeout = 5000) {
    const [idle, setIdle] = useState(false);

    const resetTimer = useCallback(() => {
        setIdle(false);
    }, []);

    useEffect(() => {
        let timer;

        const startTimer = () => {
            clearTimeout(timer);
            setIdle(false);
            timer = setTimeout(() => setIdle(true), timeout);
        };

        const handleActivity = () => {
            startTimer();
        };

        // Start initial timer
        startTimer();

        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('touchstart', handleActivity);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('touchstart', handleActivity);
        };
    }, [timeout]);

    return idle;
}
