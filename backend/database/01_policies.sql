-- TALENT-BRIDGEX DATABASE SCHEMA: RLS POLICIES
-- ============================================================

-- Enable Row Level Security on ALL tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunity_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 1. Profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON profiles;

CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Skill Profiles
DROP POLICY IF EXISTS "Skill profiles viewable by owner." ON skill_profiles;
DROP POLICY IF EXISTS "Skill profiles managed by owner." ON skill_profiles;

CREATE POLICY "Skill profiles viewable by owner." ON skill_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Skill profiles managed by owner." ON skill_profiles FOR ALL USING (auth.uid() = user_id);

-- 3. Roadmaps
DROP POLICY IF EXISTS "Roadmaps are viewable by owner." ON roadmaps;
DROP POLICY IF EXISTS "Roadmaps can be managed by owner." ON roadmaps;

CREATE POLICY "Roadmaps are viewable by owner." ON roadmaps FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Roadmaps can be managed by owner." ON roadmaps FOR ALL USING (auth.uid() = user_id);

-- 4. Modules (public read)
DROP POLICY IF EXISTS "Modules are publicly readable." ON modules;
CREATE POLICY "Modules are publicly readable." ON modules FOR SELECT USING (true);

-- 5. Module Progress
DROP POLICY IF EXISTS "Module progress is private to user." ON module_progress;
DROP POLICY IF EXISTS "Module progress managed by user." ON module_progress;

CREATE POLICY "Module progress is private to user." ON module_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Module progress managed by user." ON module_progress FOR ALL USING (auth.uid() = user_id);

-- 6. Projects (public read)
DROP POLICY IF EXISTS "Projects are publicly readable." ON projects;
DROP POLICY IF EXISTS "Project creators can manage their projects." ON projects;

CREATE POLICY "Projects are publicly readable." ON projects FOR SELECT USING (true);
CREATE POLICY "Project creators can manage their projects." ON projects FOR ALL USING (auth.uid() = posted_by);

-- 7. Opportunities (public read)
DROP POLICY IF EXISTS "Opportunities are publicly readable." ON opportunities;
CREATE POLICY "Opportunities are publicly readable." ON opportunities FOR SELECT USING (true);

-- 8. Applications
DROP POLICY IF EXISTS "Applications are private to user." ON opportunity_applications;
DROP POLICY IF EXISTS "Users can manage their own applications." ON opportunity_applications;

CREATE POLICY "Applications are private to user." ON opportunity_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own applications." ON opportunity_applications FOR ALL USING (auth.uid() = user_id);

-- 9. Community Groups (public read)
DROP POLICY IF EXISTS "Community groups are publicly readable." ON community_groups;
DROP POLICY IF EXISTS "Creators can manage their groups." ON community_groups;

CREATE POLICY "Community groups are publicly readable." ON community_groups FOR SELECT USING (true);
CREATE POLICY "Creators can manage their groups." ON community_groups FOR ALL USING (auth.uid() = creator_id);

-- 10. Messages
DROP POLICY IF EXISTS "Messages are readable by group members." ON messages;
DROP POLICY IF EXISTS "Users can send messages." ON messages;

CREATE POLICY "Messages are readable by group members." ON messages FOR SELECT USING (true);
CREATE POLICY "Users can send messages." ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
