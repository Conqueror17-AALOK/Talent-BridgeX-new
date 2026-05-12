-- SEED DATA FOR PROJECTS TABLE
-- ============================================================

-- Note: In a real environment, posted_by should be a valid UUID from the profiles table.
-- We use a placeholder here; if you have a specific user ID, replace the UUID below.

INSERT INTO projects (title, type, domain, description, team_size, current_members, location, skills, status, duration)
VALUES 
('Distributed Cache Implementation', 'Community Projects', 'Backend / Distributed Systems', 'Building a high-performance distributed cache from scratch with support for LRU eviction and consistent hashing.', 4, 2, 'Remote', ARRAY['Go', 'Redis', 'Distributed Systems'], 'Open', '4 Weeks'),

('Microservices Service Mesh Study', 'University Projects', 'DevOps / Infrastructure', 'Academic collaboration on evaluating the overhead of different service mesh implementations in high-traffic environments.', 6, 5, 'On-site (London)', ARRAY['Kubernetes', 'Istio', 'Cloud Native'], 'Urgent', '1 Semester'),

('Generative AI UX Framework', 'Community Projects', 'Design / AI', 'Developing a set of UI components specifically optimized for LLM-based chat interactions and streaming data.', 2, 1, 'Remote', ARRAY['React', 'Framer Motion', 'LLM APIs'], 'Open', '2 Weeks'),

('Web3 Authentication Library', 'Community Projects', 'Security / Blockchain', 'A lightweight, framework-agnostic library for handling multi-wallet authentication in decentralized applications.', 3, 2, 'Remote', ARRAY['TypeScript', 'Ethers.js', 'WalletConnect'], 'Open', '3 Weeks'),

('Smart Campus IoT Monitoring', 'University Projects', 'IoT / Data Science', 'Deploying and monitoring a network of environmental sensors across the university campus to optimize energy usage.', 8, 4, 'On-site (Stanford)', ARRAY['Python', 'MQTT', 'Grafana'], 'Open', '6 Months'),

('Mini-Rust Compiler Optimization', 'University Projects', 'Compilers / Systems', 'Exploring advanced optimization techniques for a subset of the Rust language, focusing on memory safety and binary size.', 4, 3, 'Remote / Hybrid', ARRAY['Rust', 'LLVM', 'Compiler Design'], 'Open', '1 Semester'),

('Social Media Sentiment Engine', 'Community Projects', 'NLP / Python', 'Real-time sentiment analysis of social media feeds during major events to provide insights to news organizations.', 5, 1, 'Remote', ARRAY['Python', 'NLTK', 'FastAPI'], 'Open', '5 Weeks');
