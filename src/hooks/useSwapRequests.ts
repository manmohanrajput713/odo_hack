import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { SwapRequest } from '../types';

export const useSwapRequests = (user: User | null) => {
  const [requests, setRequests] = useState<SwapRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRequests();
      
      // Subscribe to real-time updates
      const subscription = supabase
        .channel('swap_requests_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'swap_requests',
            filter: `or(from_user_id.eq.${user.id},to_user_id.eq.${user.id})`,
          },
          () => {
            fetchRequests();
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    } else {
      setRequests([]);
      setLoading(false);
    }
  }, [user]);

  const fetchRequests = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('swap_requests')
        .select('*')
        .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedRequests: SwapRequest[] = data.map(req => ({
        id: req.id,
        fromUserId: req.from_user_id,
        toUserId: req.to_user_id,
        skillOffered: req.skill_offered,
        skillWanted: req.skill_wanted,
        message: req.message,
        status: req.status,
        createdAt: new Date(req.created_at),
        completedAt: req.completed_at ? new Date(req.completed_at) : undefined,
      }));

      setRequests(formattedRequests);
    } catch (error) {
      console.error('Error fetching swap requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendRequest = async (request: Omit<SwapRequest, 'id' | 'createdAt'>) => {
    if (!user) return { success: false };

    try {
      const { error } = await supabase
        .from('swap_requests')
        .insert({
          from_user_id: request.fromUserId,
          to_user_id: request.toUserId,
          skill_offered: request.skillOffered,
          skill_wanted: request.skillWanted,
          message: request.message,
          status: request.status,
        });

      if (error) throw error;

      await fetchRequests();
      return { success: true };
    } catch (error) {
      console.error('Error sending request:', error);
      return { success: false, error };
    }
  };

  const updateRequestStatus = async (requestId: string, status: SwapRequest['status']) => {
    try {
      const updates: any = { status };
      if (status === 'completed') {
        updates.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('swap_requests')
        .update(updates)
        .eq('id', requestId);

      if (error) throw error;

      await fetchRequests();
      return { success: true };
    } catch (error) {
      console.error('Error updating request status:', error);
      return { success: false, error };
    }
  };

  const deleteRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('swap_requests')
        .delete()
        .eq('id', requestId);

      if (error) throw error;

      await fetchRequests();
      return { success: true };
    } catch (error) {
      console.error('Error deleting request:', error);
      return { success: false, error };
    }
  };

  return {
    requests,
    loading,
    sendRequest,
    updateRequestStatus,
    deleteRequest,
    refetch: fetchRequests,
  };
};