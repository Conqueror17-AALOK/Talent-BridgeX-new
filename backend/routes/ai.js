const express = require('express');
const router = express.Router();
const openai = require('../config/openai');
const aiService = require('../services/aiService');

// POST /api/ai/suggest
router.post('/suggest', async (req, res) => {
  const { skills } = req.body;

  if (!skills || !Array.isArray(skills)) {
    return res.status(400).json({ error: 'Skills array is required' });
  }

  try {
    const prompt = `Based on the following skills: ${skills.join(', ')}. Suggest 3 job titles that would be a good fit. Return the response in a JSON format as an array of strings, e.g. ["Frontend Developer", "React Engineer", "Web Developer"]. Do not include any other text.`;

    let suggestionsText;
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 100,
      });
      suggestionsText = response.choices[0].message.content;
    } catch (err) {
      console.warn("OpenAI suggest failed, trying Gemini...", err.message);
      if (process.env.GEMINI_API_KEY) {
        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        });
        const data = await geminiResponse.json();
        suggestionsText = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
      } else {
        throw err;
      }
    }

    let suggestions = [];
    try {
      // Extract JSON if AI wrapped it in markdown
      const jsonMatch = suggestionsText.match(/\[.*\]/s);
      const cleanJson = jsonMatch ? jsonMatch[0] : suggestionsText;
      suggestions = JSON.parse(cleanJson);
    } catch (e) {
      suggestions = suggestionsText.split('\n').map(s => s.replace(/[-*0-9.]/g, '').trim()).filter(Boolean).slice(0, 3);
    }

    res.json({ suggestions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/ai/counselling
router.post('/counselling', async (req, res) => {
  const { message, context, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    // Try Gemini first as it's preferred for counselling in the frontend
    let reply;
    if (process.env.GEMINI_API_KEY) {
      reply = await aiService.generateGeminiResponse(message, context || {}, history || []);
    } else {
      reply = await aiService.generateCounsellingResponse(message, context || {}, history || []);
    }
    
    res.json({ reply });
  } catch (err) {
    console.error("AI Counselling Route Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
