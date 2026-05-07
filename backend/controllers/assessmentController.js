const { generateAssessmentQuestions, evaluateAssessment } = require('../services/aiService');
const supabase = require('../config/supabase');

const getQuestions = async (req, res) => {
  const { interest } = req.query;
  try {
    const questions = await generateAssessmentQuestions(interest);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const submitAssessment = async (req, res) => {
  const { userId, answers, interest } = req.body;
  try {
    // 1. Evaluate answers via AI
    const result = await evaluateAssessment(answers, interest);

    // 2. Store in skill_profiles
    const { data, error } = await supabase
      .from('skill_profiles')
      .upsert({
        user_id: userId,
        scores: result.scores,
        strengths: result.strengths,
        gaps: result.gaps,
        last_assessment_at: new Date()
      })
      .select();

    if (error) throw error;

    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getQuestions,
  submitAssessment
};
