import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import isSupabaseReady from '../lib/isSupabaseReady';
import useUserIdentity from './useUserIdentity';

export default function useVotes(experienceId) {
    const { userId } = useUserIdentity();
    const [likes, setLikes] = useState(0);
    const [userVote, setUserVote] = useState(null); // 'like' | 'dislike' | null
    const [isVoting, setIsVoting] = useState(false);
    const supabaseReady = isSupabaseReady();

    useEffect(() => {
        if (!supabaseReady || !experienceId || !userId) return undefined;
        const safeExperienceId = experienceId.replace(/[^a-zA-Z0-9_-]/g, '');

        // Fetch total counts and user's vote
        const fetchVotes = async () => {
            try {
                // Get totals using the RPC function we created
                const { data: counts, error: countsError } = await supabase
                    .rpc('get_experience_votes', { exp_id: safeExperienceId });

                if (countsError) throw countsError;

                if (counts && counts.length > 0) {
                    setLikes(counts[0].likes);
                }

                // Check if THIS user has voted
                const { data: myVote, error: myVoteError } = await supabase
                    .from('votes')
                    .select('vote_type')
                    .eq('experience_id', safeExperienceId)
                    .eq('user_id', userId)
                    .maybeSingle();

                if (myVoteError) throw myVoteError;

                if (myVote) {
                    setUserVote(myVote.vote_type);
                }
            } catch (err) {
                if (import.meta.env.DEV) {
                    console.error('Fetch votes failed', err);
                }
            }
        };

        fetchVotes();

        // Subscribe to changes (simple: refetch totals on any change to this experience)
        let debounceTimer;
        const channel = supabase
            .channel(`votes:${safeExperienceId}`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'votes', filter: `experience_id=eq.${safeExperienceId}` },
                () => {
                    clearTimeout(debounceTimer);
                    debounceTimer = setTimeout(() => {
                        fetchVotes();
                    }, 1000);
                }
            )
            .subscribe();

        return () => {
            clearTimeout(debounceTimer);
            supabase.removeChannel(channel);
        };
    }, [experienceId, userId, supabaseReady]);

    const handleVote = async (type) => {
        if (!supabaseReady || !experienceId) return;

        const safeExperienceId = experienceId.replace(/[^a-zA-Z0-9_-]/g, '');
        if (!userId || isVoting) return;

        setIsVoting(true);

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
        const previousLikes = likes;
        try {
            if (userVote === type) {
                // Remove vote
                const { error } = await supabase
                .from('votes')
                .delete()
                .eq('experience_id', safeExperienceId)
                .eq('user_id', userId);
                if (error) throw error;
            } else {
                // Upsert new vote
                const { error } = await supabase
                .from('votes')
                .upsert({
                    experience_id: safeExperienceId,
                    user_id: userId,
                    vote_type: type
                }, { onConflict: 'experience_id, user_id' });
                if (error) throw error;
            }
        } catch (err) {
            if (import.meta.env.DEV) {
                console.error('Vote operation failed', err);
            }
            // Rollback optimistic update
            setUserVote(previousVote);
            setLikes(previousLikes);
        } finally {
            setIsVoting(false);
        }
    };

    return { likes, userVote, handleVote, isVoting, isSupabaseReady: supabaseReady };
}
