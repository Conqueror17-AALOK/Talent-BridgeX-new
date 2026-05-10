const express = require('express');
const router = express.Router();
const multer = require('multer');
const supabase = require('../config/supabase');
const { verifyToken } = require('../middleware/auth');

// Multer — store file in memory for Supabase upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// GET /api/users/:id — public profile fetch
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, email, university, country, career_interest, bio, linkedin_url, portfolio_url, avatar_url, reputation, is_public, created_at')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'User not found' });

    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/users/:id — update profile (protected)
router.patch('/:id', verifyToken, async (req, res) => {
  if (req.userId !== req.params.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const allowed = ['name', 'bio', 'university', 'country', 'career_interest', 'linkedin_url', 'portfolio_url', 'avatar_url'];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }
  updates.updated_at = new Date().toISOString();

  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/users/:id/avatar — upload profile photo to Supabase Storage
router.post('/:id/avatar', verifyToken, upload.single('avatar'), async (req, res) => {
  if (req.userId !== req.params.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const userId = req.params.id;
  const ext = req.file.mimetype.split('/')[1] || 'jpg';
  const filePath = `avatars/${userId}.${ext}`;

  try {
    // Upload to Supabase Storage bucket "profiles"
    const { error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true
      });

    if (uploadError) {
      console.error('Supabase Storage Upload Error:', uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('profiles')
      .getPublicUrl(filePath);

    // Save URL to profiles table
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (updateError) {
      console.error('Profile Update Error (Avatar):', updateError);
      throw updateError;
    }

    res.json({ avatar_url: publicUrl });
  } catch (err) {
    console.error('Avatar upload route error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/users/:id/resume — upload resume to Supabase Storage
router.post('/:id/resume', verifyToken, upload.single('resume'), async (req, res) => {
  if (req.userId !== req.params.id) return res.status(403).json({ error: 'Forbidden' });
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const userId = req.params.id;
  const ext = req.file.originalname.split('.').pop();
  const filePath = `resumes/${userId}.${ext}`;

  try {
    const { error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage.from('profiles').getPublicUrl(filePath);

    await supabase
      .from('profiles')
      .update({ resume_url: publicUrl, updated_at: new Date().toISOString() })
      .eq('id', userId);

    res.json({ resume_url: publicUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users/:id/skills — fetch user skill profile
router.get('/:id/skills', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('skill_profiles')
      .select('*')
      .eq('user_id', req.params.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    res.json(data || { scores: {}, strengths: [], gaps: [] });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/users/:id/skills — update user skill profile
router.patch('/:id/skills', verifyToken, async (req, res) => {
  if (req.userId !== req.params.id) return res.status(403).json({ error: 'Forbidden' });
  const { strengths, gaps, scores } = req.body;

  try {
    const { data, error } = await supabase
      .from('skill_profiles')
      .upsert({
        user_id: req.params.id,
        strengths: strengths || [],
        gaps: gaps || [],
        scores: scores || {},
        last_assessment_at: new Date().toISOString()
      }, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
