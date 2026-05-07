const { generateRoadmap } = require('../services/aiService');
const supabase = require('../config/supabase');

const createRoadmap = async (req, res) => {
  const { userId, scores, interest, currentLevel } = req.body;

  try {
    // 1. Get student name from Supabase if needed, or use from req
    const { data: user } = await supabase.from('profiles').select('name').eq('id', userId).single();
    
    // 2. Generate roadmap using AI
    const roadmap = await generateRoadmap({
      name: user?.name || 'Student',
      scores,
      interest,
      currentLevel
    });

    // 3. Store in Supabase
    const { data, error } = await supabase
      .from('roadmaps')
      .upsert({
        user_id: userId,
        content: roadmap,
        updated_at: new Date()
      })
      .select();

    if (error) throw error;

    res.json({ success: true, roadmap: data[0].content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRoadmap = async (req, res) => {
  const { userId } = req.params;
  
  const { data, error } = await supabase
    .from('roadmaps')
    .select('content')
    .eq('user_id', userId)
    .single();

  if (error) return res.status(404).json({ error: 'Roadmap not found' });
  res.json(data.content);
};

module.exports = {
  createRoadmap,
  getRoadmap
};
