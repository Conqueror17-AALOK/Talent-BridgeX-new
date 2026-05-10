const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { verifyToken } = require('../middleware/auth');

// GET /api/learning/modules — fetch all modules with user progress
router.get('/modules', verifyToken, async (req, res) => {
  const user_id = req.userId;
  
  try {
    const { data: modules, error: modulesError } = await supabase
      .from('modules')
      .select('*')
      .order('created_at', { ascending: true });

    if (modulesError) throw modulesError;

    const { data: progress, error: progressError } = await supabase
      .from('module_progress')
      .select('*')
      .eq('user_id', user_id);

    if (progressError) throw progressError;

    // Merge progress into modules
    const modulesWithProgress = modules.map(m => {
      const p = progress.find(prog => prog.module_id === m.id);
      return {
        ...m,
        status: p ? p.status : 'not_started',
        quiz_score: p ? p.quiz_score : null
      };
    });

    res.json(modulesWithProgress);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/learning/modules/:id — fetch single module details
router.get('/modules/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const user_id = req.userId;

  try {
    const { data: module, error: moduleError } = await supabase
      .from('modules')
      .select('*')
      .eq('id', id)
      .single();

    if (moduleError) throw moduleError;
    if (!module) return res.status(404).json({ error: 'Module not found' });

    const { data: progress, error: progressError } = await supabase
      .from('module_progress')
      .select('*')
      .eq('user_id', user_id)
      .eq('module_id', id)
      .single();

    // Not an error if progress doesn't exist
    res.json({ 
      ...module, 
      user_progress: progress || { status: 'not_started' } 
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/learning/modules/:id/complete — mark module as completed
router.post('/modules/:id/complete', verifyToken, async (req, res) => {
  const { id: module_id } = req.params;
  const { quiz_score } = req.body;
  const user_id = req.userId;

  try {
    const { data, error } = await supabase
      .from('module_progress')
      .upsert({ 
        user_id, 
        module_id, 
        status: 'completed', 
        quiz_score,
        completed_at: new Date().toISOString()
      }, { onConflict: 'user_id,module_id' })
      .select()
      .single();

    if (error) throw error;
    res.json({ message: 'Module completed!', progress: data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
