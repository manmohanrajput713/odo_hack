import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { User as ProfileUser } from '../types';

export const useProfile = (user: User | null) => {
  const [profile, setProfile] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No profile found, create one
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
              location: null,
              skills_offered: [],
              skills_wanted: [],
              availability: [],
              is_public: true,
              rating: 0,
              total_ratings: 0,
              avatar_url: null,
            });
          
          if (insertError) {
            console.error('Error creating profile:', insertError);
          } else {
            // Fetch the newly created profile
            await fetchProfile();
            return;
          }
        } else {
          throw error;
        }
      }

      if (data) {
        setProfile({
          id: data.id,
          name: data.name,
          location: data.location,
          skillsOffered: data.skills_offered,
          skillsWanted: data.skills_wanted,
          availability: data.availability,
          isPublic: data.is_public,
          rating: data.rating,
          totalRatings: data.total_ratings,
          avatar: data.avatar_url,
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<ProfileUser>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: updates.name || profile?.name || '',
          location: updates.location,
          skills_offered: updates.skillsOffered || [],
          skills_wanted: updates.skillsWanted || [],
          availability: updates.availability || [],
          is_public: updates.isPublic ?? true,
          avatar_url: updates.avatar,
        });

      if (error) throw error;

      await fetchProfile();
      return { success: true };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error };
    }
  };

  return { profile, loading, updateProfile, refetch: fetchProfile };
};