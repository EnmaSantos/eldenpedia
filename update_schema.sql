-- Add new columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS favorite_weapon_id text,
ADD COLUMN IF NOT EXISTS playstyle text,
ADD COLUMN IF NOT EXISTS default_stats jsonb DEFAULT '{}'::jsonb;

-- Create storage bucket for avatars if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Give public access to avatars
CREATE POLICY "Avatar images are publicly accessible."
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'avatars' );

-- Policy: Allow authenticated users to upload avatars
CREATE POLICY "Users can upload their own avatar."
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'avatars' AND auth.uid() = owner );

-- Policy: Allow users to update their own avatar
CREATE POLICY "Users can update their own avatar."
  ON storage.objects FOR UPDATE
  USING ( bucket_id = 'avatars' AND auth.uid() = owner );

-- Add new columns to builds table for full loadout
ALTER TABLE builds
ADD COLUMN IF NOT EXISTS armor_head_id text,
ADD COLUMN IF NOT EXISTS armor_chest_id text,
ADD COLUMN IF NOT EXISTS armor_arms_id text,
ADD COLUMN IF NOT EXISTS armor_legs_id text,
ADD COLUMN IF NOT EXISTS talisman_1_id text,
ADD COLUMN IF NOT EXISTS talisman_2_id text,
ADD COLUMN IF NOT EXISTS talisman_3_id text,
ADD COLUMN IF NOT EXISTS talisman_4_id text,
ADD COLUMN IF NOT EXISTS class_id text;
