import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import useUserIdentity from './useUserIdentity';

export default function useVotes(experienceId) {
    const { userId } = useUserIdentity();
    const [likes, setLikes] = useState(0);
    const [userVote, setUserVote] = useState(null); // 'like' | 'dislike' | null

    useEffect(() => {
        if (!experienceId || !userId) return;

        // Fetch total counts and user's vote
        const fetchVotes = async () => {
            // Get totals using the RPC function we created
            const { data: counts } = await supabase
                .rpc('get_experience_votes', { exp_id: experienceId });

            if (counts && counts.length > 0) {
                setLikes(counts[0].likes);
            }

            // Check if THIS user has voted
            const { data: myVote } = await supabase
                .from('votes')
                .select('vote_type')
                .eq('experience_id', experienceId)
                .eq('user_id', userId)
                .single();

            if (myVote) {
                setUserVote(myVote.vote_type);
            }
        };

        fetchVotes();

        // Subscribe to changes (simple: refetch totals on any change to this experience)
        const channel = supabase
            .channel(`votes:${experienceId}`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'votes', filter: `experience_id=eq.${experienceId}` },
                () => {
                    fetchVotes();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [experienceId, userId]);

    const handleVote = async (type) => {
        if (!userId) return;

        // Optimistic UI update
        const previousVote = userVote;

        // Calculate new optimistic state
        if (userVote === type) {
             // Toggle off (remove vote)
             setUserVote(null);
             if (type === 'like') setLikes(l => l - 1);
        } else {
            // New vote or switch
            setUserVote(type);
            if (type === 'like') {
                setLikes(l => l + 1); // User added a like
            } else if (previousVote === 'like' && type === 'dislike') {
                setLikes(l => l - 1); // User switched from like to dislike
            }
        }

        // Database operation
        if (userVote === type) {
            // Remove vote
            await supabase
                .from('votes')
                .delete()
                .eq('experience_id', experienceId)
                .eq('user_id', userId);
        } else {
            // Upsert new vote
            await supabase
                .from('votes')
                .upsert({
                    experience_id: experienceId,
                    user_id: userId,
                    vote_type: type
                }, { onConflict: 'experience_id, user_id' });
        }
    };

    return { likes, userVote, handleVote };
}
