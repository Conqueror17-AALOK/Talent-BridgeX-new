const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { verifyToken } = require('../middleware/auth');

// GET /api/jobs — fetch all opportunities (publicly readable)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/jobs/:id — fetch single opportunity
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Opportunity not found' });
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/jobs — create opportunity (protected)
router.post('/', verifyToken, async (req, res) => {
  const { title, company, description, skills, location, type, stipend, duration } = req.body;
  
  try {
    const { data, error } = await supabase
      .from('opportunities')
      .insert([{ title, company, description, skills, location, type, stipend, duration }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/opportunities/:id/apply — submit application (protected)
router.post('/apply/:id', verifyToken, async (req, res) => {
  const { id: opportunity_id } = req.params;
  const user_id = req.userId;

  try {
    const { data, error } = await supabase
      .from('opportunity_applications')
      .insert([{ opportunity_id, user_id, status: 'applied' }])
      .select()
      .single();

    if (error) {
      // Duplicate application
      if (error.code === '23505') {
        return res.status(409).json({ error: 'You have already applied to this opportunity.' });
      }
      throw error;
    }
    res.status(201).json({ message: 'Application submitted successfully!', application: data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
