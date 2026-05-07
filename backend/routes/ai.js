const express = require('express');
const router = express.Router();
const openai = require('../config/openai');

// POST /api/ai/suggest
router.post('/suggest', async (req, res) => {
  const { skills } = req.body;

  if (!skills || !Array.isArray(skills)) {
    return res.status(400).json({ error: 'Skills array is required' });
  }

  try {
    const prompt = `Based on the following skills: ${skills.join(', ')}. Suggest 3 job titles that would be a good fit. Return the response in a JSON format as an array of strings, e.g. ["Frontend Developer", "React Engineer", "Web Developer"]. Do not include any other text.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
    });

    const suggestionsText = response.choices[0].message.content;
    let suggestions = [];
    try {
      suggestions = JSON.parse(suggestionsText);
    } catch (e) {
      // fallback if AI didn't return pure JSON
      suggestions = suggestionsText.split('\n').map(s => s.replace(/[-*0-9.]/g, '').trim()).filter(Boolean);
    }

    res.json({ suggestions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
