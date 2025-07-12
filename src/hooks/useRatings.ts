import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Rating } from '../types';

export const useRatings = (user: User | null) => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRatings();
    } else {
      setRatings([]);
      setLoading(false);
    }
  }, [user]);

  const fetchRatings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('ratings')
        .select('*')
        .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedRatings: Rating[] = data.map(rating => ({
        id: rating.id,
        swapRequestId: rating.swap_request_id,
        fromUserId: rating.from_user_id,
        toUserId: rating.to_user_id,
        rating: rating.rating,
        comment: rating.comment,
        createdAt: new Date(rating.created_at),
      }));

      setRatings(formattedRatings);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  const addRating = async (rating: Omit<Rating, 'id' | 'createdAt'>) => {
    if (!user) return { success: false };

    try {
      const { error } = await supabase
        .from('ratings')
        .insert({
          swap_request_id: rating.swapRequestId,
          from_user_id: rating.fromUserId,
          to_user_id: rating.toUserId,
          rating: rating.rating,
          comment: rating.comment,
        });

      if (error) throw error;

      await fetchRatings();
      return { success: true };
    } catch (error) {
      console.error('Error adding rating:', error);
      return { success: false, error };
    }
  };

  return { ratings, loading, addRating, refetch: fetchRatings };
};