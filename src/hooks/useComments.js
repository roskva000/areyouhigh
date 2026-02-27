import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import useUserIdentity from './useUserIdentity';

export default function useComments(experienceId) {
    const { userId, nickname } = useUserIdentity();
    const [comments, setComments] = useState([]);

    useEffect(() => {
        if (!experienceId) return;

        const fetchComments = async () => {
            const { data } = await supabase
                .from('comments')
                .select('*')
                .eq('experience_id', experienceId)
                .order('created_at', { ascending: false });

            if (data) setComments(data);
        };

        fetchComments();

        const channel = supabase
            .channel(`comments:${experienceId}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'comments', filter: `experience_id=eq.${experienceId}` },
                (payload) => {
                    setComments(prev => [payload.new, ...prev]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [experienceId]);

    const postComment = async (content) => {
        if (!userId || !content.trim()) return;

        // Current nickname is used for display purposes, but stored in DB too
        await supabase
            .from('comments')
            .insert({
                experience_id: experienceId,
                user_id: userId,
                nickname: nickname, // Store the random nickname
                content: content.trim()
            });
    };

    return { comments, postComment, currentNickname: nickname };
}
