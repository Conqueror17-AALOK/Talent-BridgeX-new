-- SEED DATA FOR OPPORTUNITIES
-- ============================================================

INSERT INTO opportunities (id, title, company, type, location, domain, stipend, duration, skills, description)
VALUES 
-- FinTech
('opp-gs-1', 'Quantitative Research Intern', 'Goldman Sachs', 'Internships', 'New York / Hybrid', 'FinTech', '$9,000/mo', '10 Weeks', ARRAY['Python', 'Stochastic Calculus', 'SQL'], 'Develop mathematical models for pricing and risk management of complex financial products.'),
('opp-paypal-1', 'Senior Backend Engineer – Payment Safety', 'PayPal', 'Employer Connections', 'San Jose / Hybrid', 'FinTech', '$145–180K', 'Full-Time', ARRAY['Java', 'Spring Boot', 'Fraud Detection'], 'Protecting hundreds of millions of customers by building real-time fraud prevention systems.'),
('opp-stripe-2', 'Crypto Payment Integration Project', 'Stripe Connect Team', 'Freelance Gigs', 'Remote', 'FinTech', '$160/hr', '2 Months', ARRAY['Go', 'Web3', 'API Engineering'], 'Consulting on the integration of stablecoin settlement options for Stripe Connect users.'),

-- AI
('opp-openai-1', 'AI Safety Intern', 'OpenAI', 'Internships', 'San Francisco / Hybrid', 'AI', '$10,000/mo', '12 Weeks', ARRAY['Python', 'PyTorch', 'Reinforcement Learning'], 'Work on the frontier of AI alignment and safety to ensure artificial general intelligence benefits all of humanity.'),
('opp-stanford-1', 'Research Collaboration: LLM Interpretability', 'Stanford HAI', 'University Collaborations', 'Palo Alto / Hybrid', 'AI', 'Fellowship', '9 Months', ARRAY['Python', 'PyTorch', 'Interpretability Tools'], 'Academic partnership focused on understanding the internal representations of large language models.'),
('opp-cmu-1', 'Collaborative Robotics Research', 'Carnegie Mellon University', 'University Collaborations', 'Pittsburgh / On-site', 'AI', 'Stipend Provided', '6 Months', ARRAY['C++', 'ROS', 'Control Theory'], 'Working on multi-robot coordination for search and rescue operations.'),

-- HealthTech
('opp-medtronic-1', 'Biomedical Software Intern', 'Medtronic', 'Internships', 'Minneapolis / On-site', 'HealthTech', '$5,500/mo', '3 Months', ARRAY['C++', 'Embedded Systems', 'Regulatory Standards'], 'Contributing to the software development lifecycle of life-saving medical devices.'),
('opp-teladoc-1', 'Lead Data Scientist', 'Teladoc Health', 'Employer Connections', 'Remote', 'HealthTech', '$150–190K', 'Full-Time', ARRAY['Python', 'Deep Learning', 'Health Informatics'], 'Spearheading AI initiatives to improve virtual care delivery and patient outcomes.'),

-- E-commerce
('opp-amazon-1', 'Applied Scientist Intern', 'Amazon', 'Internships', 'Seattle / Hybrid', 'E-commerce', '$8,500/mo', '12 Weeks', ARRAY['Machine Learning', 'Python', 'Large Scale Systems'], 'Researching and developing innovative machine learning solutions to enhance the customer experience.'),
('opp-shopify-1', 'Custom Shopify Theme Development', 'E-com Growth Agency', 'Freelance Gigs', 'Remote', 'E-commerce', '$110/hr', '4 Weeks', ARRAY['Liquid', 'JavaScript', 'HTML/CSS'], 'Crafting a high-conversion custom theme for a high-growth D2C brand.'),
('opp-flipkart-1', 'Supply Chain Optimization Research', 'Flipkart', 'University Collaborations', 'Bengaluru / Hybrid', 'E-commerce', 'Grant Funded', '6 Months', ARRAY['Operations Research', 'Python', 'Data Modeling'], 'Joint research project on optimizing last-mile delivery in complex urban environments.'),

-- SaaS
('opp-slack-1', 'Frontend Engineering Intern', 'Slack', 'Internships', 'Remote / USA', 'SaaS', '$7,500/mo', '12 Weeks', ARRAY['React', 'TypeScript', 'Accessibility'], 'Building polished and accessible UI features for millions of users worldwide.'),
('opp-salesforce-1', 'Cloud Architect – Enterprise Solutions', 'Salesforce', 'Employer Connections', 'San Francisco / Hybrid', 'SaaS', '$160–200K', 'Full-Time', ARRAY['AWS', 'Microservices', 'Java'], 'Designing scalable cloud architectures for the world''s #1 CRM platform.'),
('opp-atlassian-1', 'Forge Platform Plugin Developer', 'Atlassian Ecosystem', 'Freelance Gigs', 'Remote', 'SaaS', '$130/hr', '2 Months', ARRAY['Node.js', 'React', 'Atlassian Forge'], 'Building next-gen extensions for Jira and Confluence using the Forge serverless platform.')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  company = EXCLUDED.company,
  type = EXCLUDED.type,
  location = EXCLUDED.location,
  domain = EXCLUDED.domain,
  stipend = EXCLUDED.stipend,
  duration = EXCLUDED.duration,
  skills = EXCLUDED.skills,
  description = EXCLUDED.description;
