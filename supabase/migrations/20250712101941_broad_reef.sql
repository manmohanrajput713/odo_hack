/*
  # Skill Swap Platform Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `name` (text)
      - `location` (text, optional)
      - `skills_offered` (text array)
      - `skills_wanted` (text array)
      - `availability` (text array)
      - `is_public` (boolean, default true)
      - `rating` (numeric, default 0)
      - `total_ratings` (integer, default 0)
      - `avatar_url` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `swap_requests`
      - `id` (uuid, primary key)
      - `from_user_id` (uuid, references profiles)
      - `to_user_id` (uuid, references profiles)
      - `skill_offered` (text)
      - `skill_wanted` (text)
      - `message` (text)
      - `status` (enum: pending, accepted, rejected, completed)
      - `created_at` (timestamp)
      - `completed_at` (timestamp, optional)

    - `ratings`
      - `id` (uuid, primary key)
      - `swap_request_id` (uuid, references swap_requests)
      - `from_user_id` (uuid, references profiles)
      - `to_user_id` (uuid, references profiles)
      - `rating` (integer, 1-5)
      - `comment` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for public profile viewing
    - Add policies for swap request management
*/

-- Create custom types
CREATE TYPE swap_status AS ENUM ('pending', 'accepted', 'rejected', 'completed');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  location text,
  skills_offered text[] DEFAULT '{}',
  skills_wanted text[] DEFAULT '{}',
  availability text[] DEFAULT '{}',
  is_public boolean DEFAULT true,
  rating numeric(3,2) DEFAULT 0,
  total_ratings integer DEFAULT 0,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create swap_requests table
CREATE TABLE IF NOT EXISTS swap_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  to_user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_offered text NOT NULL,
  skill_wanted text NOT NULL,
  message text NOT NULL,
  status swap_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  CONSTRAINT different_users CHECK (from_user_id != to_user_id)
);

-- Create ratings table
CREATE TABLE IF NOT EXISTS ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  swap_request_id uuid NOT NULL REFERENCES swap_requests(id) ON DELETE CASCADE,
  from_user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  to_user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT unique_rating_per_swap UNIQUE (swap_request_id, from_user_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE swap_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view public profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (is_public = true OR auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Swap requests policies
CREATE POLICY "Users can view their swap requests"
  ON swap_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users can create swap requests"
  ON swap_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "Users can update swap requests they're involved in"
  ON swap_requests
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users can delete their own swap requests"
  ON swap_requests
  FOR DELETE
  TO authenticated
  USING (auth.uid() = from_user_id);

-- Ratings policies
CREATE POLICY "Users can view ratings for their swaps"
  ON ratings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users can create ratings for their swaps"
  ON ratings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = from_user_id);

-- Function to update profile rating when new rating is added
CREATE OR REPLACE FUNCTION update_profile_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET 
    rating = (
      SELECT ROUND(AVG(rating)::numeric, 2)
      FROM ratings
      WHERE to_user_id = NEW.to_user_id
    ),
    total_ratings = (
      SELECT COUNT(*)
      FROM ratings
      WHERE to_user_id = NEW.to_user_id
    ),
    updated_at = now()
  WHERE id = NEW.to_user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update profile rating
CREATE TRIGGER update_profile_rating_trigger
  AFTER INSERT ON ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_rating();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_skills_offered ON profiles USING GIN (skills_offered);
CREATE INDEX IF NOT EXISTS idx_profiles_skills_wanted ON profiles USING GIN (skills_wanted);
CREATE INDEX IF NOT EXISTS idx_profiles_is_public ON profiles (is_public);
CREATE INDEX IF NOT EXISTS idx_swap_requests_from_user ON swap_requests (from_user_id);
CREATE INDEX IF NOT EXISTS idx_swap_requests_to_user ON swap_requests (to_user_id);
CREATE INDEX IF NOT EXISTS idx_swap_requests_status ON swap_requests (status);
CREATE INDEX IF NOT EXISTS idx_ratings_to_user ON ratings (to_user_id);