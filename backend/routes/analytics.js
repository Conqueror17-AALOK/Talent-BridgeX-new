const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { verifyToken } = require('../middleware/auth');

// GET /api/analytics — fetch user analytics overview
router.get('/', verifyToken, async (req, res) => {
  const user_id = req.userId;

  try {
    // 1. Fetch skill profile
    const { data: skillProfile, error: skillError } = await supabase
      .from('skill_profiles')
      .select('*')
      .eq('user_id', user_id)
      .single();

    // 2. Fetch applications count
    const { count: appCount, error: appError } = await supabase
      .from('opportunity_applications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user_id);

    // 3. Fetch completed modules count
    const { count: moduleCount, error: moduleError } = await supabase
      .from('module_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user_id)
      .eq('status', 'completed');

    if (skillError && skillError.code !== 'PGRST116') throw skillError;

    res.json({
      skillProfile: skillProfile || { scores: { technical: 0, soft: 0 } },
      applicationsCount: appCount || 0,
      completedModulesCount: moduleCount || 0,
      lastUpdated: new Date().toISOString()
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
