import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedUsers: User[] = data.map(profile => ({
        id: profile.id,
        name: profile.name,
        location: profile.location,
        skillsOffered: profile.skills_offered,
        skillsWanted: profile.skills_wanted,
        availability: profile.availability,
        isPublic: profile.is_public,
        rating: profile.rating,
        totalRatings: profile.total_ratings,
        avatar: profile.avatar_url,
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  return { users, loading, refetch: fetchUsers };
};