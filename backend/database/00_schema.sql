-- TALENT-BRIDGEX DATABASE SCHEMA: TABLES & VIEWS
-- ============================================================

-- 1. Profiles (Extends Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  university TEXT,
  country TEXT,
  field_of_study TEXT,
  year_of_study TEXT,
  career_interest TEXT,
  bio TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  resume_url TEXT,
  avatar_url TEXT,                -- Profile photo (Supabase Storage public URL)
  reputation INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Skill Profiles
CREATE TABLE IF NOT EXISTS skill_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  scores JSONB NOT NULL DEFAULT '{}', -- e.g., {"technical": 78, "soft": 92}
  strengths TEXT[],
  gaps TEXT[],
  last_assessment_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. Roadmaps
CREATE TABLE IF NOT EXISTS roadmaps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content JSONB NOT NULL, -- The AI-generated roadmap JSON
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 4. Modules
CREATE TABLE IF NOT EXISTS modules (
  id TEXT PRIMARY KEY, -- e.g., 'sys-arch-101'
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  duration TEXT,
  level TEXT,
  prerequisites TEXT[],
  content TEXT, -- Markdown/HTML
  video_url TEXT,
  quiz JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 5. Module Progress
CREATE TABLE IF NOT EXISTS module_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  module_id TEXT REFERENCES modules(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'in_progress', -- 'in_progress', 'completed'
  quiz_score INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, module_id)
);

-- 6. Projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL, -- 'University', 'Community'
  domain TEXT,
  description TEXT,
  team_size INTEGER,
  current_members INTEGER DEFAULT 1,
  posted_by UUID REFERENCES profiles(id),
  location TEXT,
  skills TEXT[],
  status TEXT DEFAULT 'Open',
  duration TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 7. Opportunities (previously called 'jobs' in some routes — unified here)
CREATE TABLE IF NOT EXISTS opportunities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Internships', -- 'Internships', 'Freelance', 'Connection', 'Collaboration'
  location TEXT,
  domain TEXT,
  stipend TEXT,
  duration TEXT,
  requirements_vector JSONB, -- For AI matching
  skills TEXT[],
  description TEXT,
  posted_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Alias view so /api/jobs route still works
CREATE OR REPLACE VIEW jobs AS SELECT * FROM opportunities;

-- 8. Opportunity Applications
CREATE TABLE IF NOT EXISTS opportunity_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'applied', -- 'applied', 'shortlisted', 'rejected', 'accepted'
  ai_match_score INTEGER,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(opportunity_id, user_id)
);

-- 9. Community Groups
CREATE TABLE IF NOT EXISTS community_groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT,
  description TEXT,
  creator_id UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 10. Messages (Chat)
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES community_groups(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
