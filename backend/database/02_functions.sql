-- TALENT-BRIDGEX DATABASE SCHEMA: FUNCTIONS & TRIGGERS
-- ============================================================

-- 1. Storage Buckets (Manual Setup Note)
-- Run this manually in Supabase Dashboard > Storage or use the API:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('profiles', 'profiles', true);
-- CREATE POLICY "Avatar images are publicly accessible." ON storage.objects FOR SELECT USING (bucket_id = 'profiles');
-- CREATE POLICY "Users can upload their own avatar." ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'profiles' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 2. Auto-create profile on Supabase Auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
