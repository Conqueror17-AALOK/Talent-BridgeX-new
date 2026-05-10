const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { verifyToken } = require('../middleware/auth');

// GET /api/projects — fetch all projects
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        posted_by (name, email)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/projects/:id — fetch single project
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        posted_by (name, email, avatar_url)
      `)
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Project not found' });
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/projects — create project (protected)
router.post('/', verifyToken, async (req, res) => {
  const { title, type, domain, description, team_size, location, skills, duration } = req.body;
  const posted_by = req.userId;

  try {
    const { data, error } = await supabase
      .from('projects')
      .insert([{ 
        title, 
        type, 
        domain, 
        description, 
        team_size, 
        location, 
        skills, 
        duration,
        posted_by
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/projects/:id/join — join a project (protected)
router.post('/:id/join', verifyToken, async (req, res) => {
  const { id: project_id } = req.params;
  const user_id = req.userId;

  try {
    // Check if already a member or if project is full (simplified)
    // In a real app, you'd have a project_members table
    
    // For now, let's just increment current_members as a demo
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('current_members, team_size')
      .eq('id', project_id)
      .single();

    if (fetchError) throw fetchError;
    
    if (project.current_members >= project.team_size) {
      return res.status(400).json({ error: 'Project is already full' });
    }

    const { data, error } = await supabase
      .from('projects')
      .update({ current_members: project.current_members + 1 })
      .eq('id', project_id)
      .select()
      .single();

    if (error) throw error;
    res.json({ message: 'Successfully joined the project!', project: data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
