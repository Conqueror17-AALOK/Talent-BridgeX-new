const { OpenAI } = require('openai');

let openai;

if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('your_')) {
  console.warn('⚠️ OpenAI API Key is missing or using placeholder in .env. AI features will not work.');
  openai = null;
} else {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Gemini Configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";

/**
 * Generic helper to call Gemini API for structured tasks.
 */
const callGemini = async (prompt, systemInstruction = "", responseMimeType = "text/plain") => {
  if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is missing.");
  
  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }]
  };

  if (systemInstruction) {
    body.system_instruction = { parts: [{ text: systemInstruction }] };
  }

  if (responseMimeType === "application/json") {
    body.generationConfig = { responseMimeType: "application/json" };
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Gemini Error ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (responseMimeType === "application/json") {
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse Gemini JSON:", text);
      throw new Error("Invalid JSON response from Gemini");
    }
  }
  return text;
};

/**
 * Generates a personalized career roadmap based on skills and goals.
 */
const generateRoadmap = async (studentProfile) => {
  const { name, scores, interest, currentLevel } = studentProfile;

  const prompt = `
    You are the Talent-BridgeX Career Intelligence AI. 
    Generate a professional, structured career roadmap for a student named ${name}.
    Career Interest: ${interest}
    Skill Scores: ${JSON.stringify(scores)}
    
    Return as JSON:
    {
      "title": "Roadmap Title",
      "summary": "Short summary",
      "milestones": [
        { "id": 1, "name": "Milestone", "status": "pending", "description": "...", "estimatedWeeks": 2, "modules": [] }
      ],
      "focusAreas": ["..."],
      "recommendedProjects": ["..."]
    }
  `;

  try {
    if (!openai) throw new Error("OpenAI not configured");
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a professional career consultant." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });
    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.warn("OpenAI Roadmap failed, trying Gemini...", error.message);
    try {
      return await callGemini(prompt, "You are a career consultant. Return only valid JSON.", "application/json");
    } catch (geminiError) {
      console.error("All AI services failed for Roadmap:", geminiError);
      // Fallback to static
      return {
        title: `${interest} Career Roadmap`,
        summary: 'A structured path to grow your skills.',
        milestones: [
          { id: 1, name: 'Foundation Building', status: 'pending', description: 'Learn core concepts', estimatedWeeks: 4, modules: [] },
          { id: 2, name: 'Skill Development', status: 'pending', description: 'Build projects', estimatedWeeks: 6, modules: [] }
        ],
        focusAreas: ['Technical Skills', 'Problem Solving'],
        recommendedProjects: ['Portfolio Website']
      };
    }
  }
};

const generatePhase1Questions = () => [
  { id: 1, question: "What is your primary area of interest?", type: "mcq", options: ["Frontend Development", "Backend Development", "Data Science & AI", "DevOps & Cloud", "Cybersecurity", "Android Development", "iOS Development", "UX/UI Design", "Blockchain", "Python / Scripting"], category: "Technical" },
  { id: 2, question: "What is your current experience level?", type: "mcq", options: ["Complete Beginner", "Some Exposure (< 6 months)", "Intermediate (6 months – 2 years)", "Experienced (2+ years)"], category: "Technical" },
  { id: 3, question: "What is your primary learning goal?", type: "mcq", options: ["Get my first job/internship", "Switch careers", "Deepen existing skills", "Build a product/startup", "Academic research"], category: "Soft Skills" },
  { id: 4, question: "How many hours per week can you dedicate to learning?", type: "mcq", options: ["Less than 5 hours", "5–10 hours", "10–20 hours", "20+ hours"], category: "Soft Skills" }
];

const PHASE2_FALLBACKS = {
  "Frontend Development": [
    { id: 5, question: "Which of these is NOT a semantic HTML tag?", type: "mcq", options: ["<header>", "<section>", "<div>", "<article>"], category: "Technical", skillArea: "HTML" },
    { id: 6, question: "What is the primary purpose of the 'useEffect' hook in React?", type: "mcq", options: ["Manage global state", "Handle side effects", "Improve performance", "Route navigation"], category: "Technical", skillArea: "React" }
  ],
  "Backend Development": [
    { id: 5, question: "What is the main purpose of an index in a database?", type: "mcq", options: ["To store data", "To speed up data retrieval", "To encrypt data", "To backup data"], category: "Technical", skillArea: "Database" },
    { id: 6, question: "Which HTTP method is used to update an existing resource?", type: "mcq", options: ["GET", "POST", "PUT", "DELETE"], category: "Technical", skillArea: "API" }
  ]
};

const generatePhase2Questions = async (interest, level, goal) => {
  const prompt = `
    Generate exactly 8 skill-specific MCQ questions for a student interested in "${interest}".
    The student's level is "${level}" and their goal is "${goal}".
    Return as JSON: { "questions": [{ "id": 5, "question": "...", "type": "mcq", "options": ["...", "...", "...", "..."], "category": "Technical", "skillArea": "..." }] }
  `;

  try {
    if (!openai) throw new Error("OpenAI not configured");
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });
    const parsed = JSON.parse(response.choices[0].message.content);
    return parsed.questions || [];
  } catch (error) {
    console.warn("OpenAI Phase 2 failed, trying Gemini...", error.message);
    try {
      const data = await callGemini(prompt, "Return only valid JSON.", "application/json");
      return data.questions || [];
    } catch (e) {
      return PHASE2_FALLBACKS[interest] || PHASE2_FALLBACKS["Frontend Development"];
    }
  }
};

const evaluateAssessment = async (answers, interest) => {
  const prompt = `
    Evaluate assessment for ${interest}: ${JSON.stringify(answers)}
    Return JSON: { "scores": { "technical": 0-100, "soft_skills": 0-100, "leadership": 0-100, "communication": 0-100 }, "strengths": [], "gaps": [], "overallFeedback": "" }
  `;

  try {
    if (!openai) throw new Error("OpenAI not configured");
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });
    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.warn("OpenAI Evaluation failed, trying Gemini...", error.message);
    try {
      return await callGemini(prompt, "Evaluate assessment. Return JSON.", "application/json");
    } catch (e) {
      return {
        scores: { technical: 65, soft_skills: 70, leadership: 60, communication: 75 },
        strengths: ['Analytical Thinking'],
        gaps: ['Domain Knowledge'],
        overallFeedback: 'Fall-back evaluation due to AI service load.'
      };
    }
  }
};

const generateCounsellingResponse = async (message, context, history = []) => {
  try {
    if (!openai) throw new Error("OpenAI not configured");
    const systemPrompt = `You are the Talent-BridgeX AI Career Counsellor. Student Context: ${JSON.stringify(context)}`;
    const messages = [
      { role: "system", content: systemPrompt },
      ...history.map(msg => ({ role: msg.role, content: msg.content })),
      { role: "user", content: message }
    ];
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.warn("OpenAI Counselling failed, trying Gemini...", error.message);
    return await generateGeminiResponse(message, context, history);
  }
};

const generateGeminiResponse = async (message, context, history = []) => {
  const systemPrompt = `You are the Talent-BridgeX AI Career Counsellor. Context: ${JSON.stringify(context)}`;
  const contents = history.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));
  contents.push({ role: 'user', parts: [{ text: message }] });

  return await callGemini(message, systemPrompt);
};

module.exports = {
  generateRoadmap,
  generatePhase1Questions,
  generatePhase2Questions,
  evaluateAssessment,
  generateCounsellingResponse,
  generateGeminiResponse
};
