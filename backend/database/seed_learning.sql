-- SEED DATA FOR MODULES TABLE
-- ============================================================

INSERT INTO modules (id, title, category, description, duration, level, prerequisites, content)
VALUES 
('sys-arch-101', 'System Architecture Fundamentals', 'Technical Deep-dives', 'An editorial deep-dive into scalable system design, covering load balancing, microservices, and database sharding.', '4.5 Hours', 'Intermediate', ARRAY['Data Structures', 'Networking Basics'], '## The Philosophy of Scale\nScaling a system is not just about adding more servers. It''s about understanding the bottlenecks of your architecture.'),

('cloud-native-201', 'Cloud Native & Kubernetes', 'Technical Deep-dives', 'Master the art of container orchestration and cloud-native patterns for modern application deployment.', '5 Hours', 'Advanced', ARRAY['Docker Basics', 'Linux CLI'], 'Deep dive into K8s...'),

('comm-exec-202', 'Executive Communication for Engineers', 'Soft Skill Mastery', 'Learn how to translate complex technical concepts into business value for stakeholders and executives.', '2 Hours', 'Advanced', ARRAY['None'], 'Content about executive communication...'),

('leadership-101', 'Engineering Leadership Fundamentals', 'Soft Skill Mastery', 'Transitioning from individual contributor to lead: managing teams, projects, and expectations.', '3 Hours', 'Intermediate', ARRAY['None'], 'Leadership principles...'),

('fin-tech-303', 'FinTech & Global Markets', 'Domain Knowledge', 'Understanding the intersection of technology and global finance, from HFT to blockchain settlement.', '6 Hours', 'Intermediate', ARRAY['Basic Economics'], 'Content about FinTech...'),

('e-commerce-logistics', 'E-commerce & Global Logistics', 'Domain Knowledge', 'Exploring the technical infrastructure behind global supply chains and high-scale retail platforms.', '4 Hours', 'Intermediate', ARRAY['None'], 'Logistics and e-commerce...');
