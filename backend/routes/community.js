const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { verifyToken } = require('../middleware/auth');

// GET /api/community/groups — fetch all community groups
router.get('/groups', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('community_groups')
      .select(`
        *,
        creator:creator_id (name)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/community/groups/:id — fetch single group with messages
router.get('/groups/:id', async (req, res) => {
  try {
    const { data: group, error: groupError } = await supabase
      .from('community_groups')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (groupError) throw groupError;
    if (!group) return res.status(404).json({ error: 'Group not found' });

    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select(`
        *,
        sender:sender_id (name, avatar_url)
      `)
      .eq('group_id', req.params.id)
      .order('created_at', { ascending: true });

    if (messagesError) throw messagesError;

    res.json({ ...group, messages: messages || [] });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/community/groups — create group (protected)
router.post('/groups', verifyToken, async (req, res) => {
  const { name, domain, description } = req.body;
  const creator_id = req.userId;

  try {
    const { data, error } = await supabase
      .from('community_groups')
      .insert([{ name, domain, description, creator_id }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/community/groups/:id/messages — send message (protected)
router.post('/groups/:id/messages', verifyToken, async (req, res) => {
  const { id: group_id } = req.params;
  const { content } = req.body;
  const sender_id = req.userId;

  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([{ group_id, sender_id, content }])
      .select(`
        *,
        sender:sender_id (name, avatar_url)
      `)
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
