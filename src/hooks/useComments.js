import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import useUserIdentity from './useUserIdentity';

export default function useComments(experienceId) {
    const { userId, nickname } = useUserIdentity();
    const [comments, setComments] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [commentError, setCommentError] = useState(null);

    useEffect(() => {
        if (!experienceId) return;
        const safeExperienceId = experienceId.replace(/[^a-zA-Z0-9_-]/g, '');

        const fetchComments = async () => {
            const { data } = await supabase
                .from('comments')
                .select('*')
                .eq('experience_id', safeExperienceId)
                .order('created_at', { ascending: false });

            if (data) setComments(data);
        };

        fetchComments();

        const channel = supabase
            .channel(`comments:${safeExperienceId}`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'comments', filter: `experience_id=eq.${safeExperienceId}` },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setComments(prev => [payload.new, ...prev]);
                    } else if (payload.eventType === 'DELETE') {
                        setComments(prev => prev.filter(c => c.id !== payload.old.id));
                    } else if (payload.eventType === 'UPDATE') {
                        setComments(prev => prev.map(c => c.id === payload.new.id ? payload.new : c));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [experienceId]);

    const postComment = async (content) => {
        const safeExperienceId = experienceId.replace(/[^a-zA-Z0-9_-]/g, '');
        if (!userId || !content.trim() || isSubmitting) return;

        setIsSubmitting(true);
        setCommentError(null);
        try {
            // Current nickname is used for display purposes, but stored in DB too
            const { error } = await supabase
                .from('comments')
                .insert({
                    experience_id: safeExperienceId,
                    user_id: userId,
                    nickname: nickname, // Store the random nickname
                    content: content.trim().substring(0, 140)
                });

            if (error) {
                console.error("Failed to post comment:", error);
                throw error;
            }
        } catch (err) {
            console.error("Error in postComment:", err);
            setCommentError(err.message || 'Operation failed');
            setTimeout(() => setCommentError(null), 3000);
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    };

    return { comments, postComment, currentNickname: nickname, isSubmitting, commentError };
}
