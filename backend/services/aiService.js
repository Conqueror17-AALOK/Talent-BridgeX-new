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

/**
 * Generates a personalized career roadmap based on skills and goals.
 * @param {Object} studentProfile - { name, scores, interest, currentLevel }
 * @returns {Promise<Object>} - Structured roadmap JSON
 */
const generateRoadmap = async (studentProfile) => {
  const { name, scores, interest, currentLevel } = studentProfile;

  const prompt = `
    You are the Talent-BridgeX Career Intelligence AI. 
    Generate a highly professional, structured career roadmap for a student named ${name}.
    
    Student Profile:
    - Career Interest: ${interest}
    - Current Level: ${currentLevel}
    - Skill Scores: ${JSON.stringify(scores)}
    
    The roadmap must be returned as a JSON object with the following structure:
    {
      "title": "Roadmap Title",
      "summary": "Short editorial summary of the path",
      "milestones": [
        {
          "id": 1,
          "name": "Milestone Name",
          "status": "pending",
          "description": "What to achieve",
          "estimatedWeeks": 2,
          "modules": ["module-id-1", "module-id-2"]
        }
      ],
      "focusAreas": ["Area 1", "Area 2"],
      "recommendedProjects": ["Project 1", "Project 2"]
    }
    
    Focus on "Technical Deep-dives", "Soft Skill Mastery", and "Domain Knowledge".
    Ensure the roadmap is challenging but realistic.
  `;

  if (!openai) {
    console.warn('⚠️ OpenAI not configured — returning fallback roadmap.');
    return {
      title: `${interest} Career Roadmap`,
      summary: 'A structured path to grow your skills and achieve your career goals.',
      milestones: [
        { id: 1, name: 'Foundation Building', status: 'pending', description: 'Learn core concepts and fundamentals', estimatedWeeks: 4, modules: [] },
        { id: 2, name: 'Skill Development', status: 'pending', description: 'Apply knowledge through hands-on projects', estimatedWeeks: 6, modules: [] },
        { id: 3, name: 'Advanced Mastery', status: 'pending', description: 'Tackle real-world problems and build portfolio', estimatedWeeks: 8, modules: [] },
      ],
      focusAreas: ['Technical Skills', 'Problem Solving', 'Communication'],
      recommendedProjects: ['Portfolio Website', 'Capstone Project', 'Open Source Contribution']
    };
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a professional career consultant and technical architect." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("AI Roadmap Generation Error:", error);
    throw error;
  }
};

/**
 * Generates dynamic assessment questions based on career interest.
 * @param {string} interest - Student's career interest
 * @returns {Promise<Array>} - List of questions
 */
const FALLBACK_QUESTIONS = (interest) => [
  { id: 1, question: `What best describes your experience level with ${interest}?`, type: "mcq", options: ["Complete Beginner", "Some Exposure", "Intermediate", "Advanced"], category: "Technical" },
  { id: 2, question: "How do you prefer to solve complex problems?", type: "mcq", options: ["Research independently", "Collaborate with peers", "Follow a structured framework", "Experiment through trial and error"], category: "Soft Skills" },
  { id: 3, question: "Rate your comfort level with working under tight deadlines.", type: "ranking", options: ["Very Uncomfortable", "Uncomfortable", "Comfortable", "Very Comfortable"], category: "Soft Skills" },
  { id: 4, question: `Which area of ${interest} interests you the most?`, type: "mcq", options: ["Theory & Concepts", "Practical Application", "Research & Innovation", "Product & Strategy"], category: "Technical" },
  { id: 5, question: "How often do you seek feedback on your work?", type: "ranking", options: ["Rarely", "Sometimes", "Often", "Always"], category: "Leadership" },
  { id: 6, question: "Describe a challenge you overcame using critical thinking.", type: "short_answer", placeholder: "Share a specific example...", category: "Soft Skills" },
  { id: 7, question: "How do you stay current with new developments in your field?", type: "mcq", options: ["Online courses", "Reading articles & research", "Attending events & meetups", "Personal projects"], category: "Technical" },
  { id: 8, question: "Rate your ability to communicate technical concepts to non-technical audiences.", type: "ranking", options: ["Needs Work", "Developing", "Proficient", "Expert"], category: "Soft Skills" },
  { id: 9, question: "How comfortable are you with taking initiative on new projects?", type: "ranking", options: ["Not Comfortable", "Somewhat Comfortable", "Comfortable", "Very Comfortable"], category: "Leadership" },
  { id: 10, question: `What is your long-term goal within ${interest}?`, type: "short_answer", placeholder: "Describe your vision for your career in 5 years...", category: "Technical" },
];

const generateAssessmentQuestions = async (interest) => {
  // Fallback when OpenAI is not configured
  if (!openai) {
    console.warn('⚠️ OpenAI not configured — returning fallback assessment questions.');
    return FALLBACK_QUESTIONS(interest);
  }

  const prompt = `
    Generate 15 dynamic assessment questions for a student interested in ${interest}.
    Include a mix of:
    - Multiple Choice Questions (MCQ)
    - Ranking questions (1-4)
    - Short Answer questions (critical thinking)
    
    Return exactly as a JSON object with a single key "questions" containing the array:
    {
      "questions": [
        {
          "id": 1,
          "question": "...",
          "type": "mcq" | "ranking" | "short_answer",
          "options": ["...", "..."], 
          "category": "Technical" | "Soft Skills" | "Leadership"
        }
      ]
    }
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const parsed = JSON.parse(response.choices[0].message.content);
    return parsed.questions || parsed.data || (Array.isArray(parsed) ? parsed : []);
  } catch (error) {
    console.error("AI Question Generation Error:", error);
    // Return fallback instead of crashing
    return FALLBACK_QUESTIONS(interest);
  }
};

/**
 * Evaluates assessment answers and returns a skill profile.
 * @param {Array} answers - List of { questionId, answer }
 * @param {string} interest - Career interest context
 * @returns {Promise<Object>} - Skill scores and gap analysis
 */
const evaluateAssessment = async (answers, interest) => {
  const prompt = `
    Evaluate the following assessment answers for a student pursuing a career in ${interest}.
    
    Answers: ${JSON.stringify(answers)}
    
    Provide a detailed evaluation as a JSON object:
    {
      "scores": {
        "technical": 0-100,
        "soft_skills": 0-100,
        "leadership": 0-100,
        "communication": 0-100
      },
      "strengths": ["...", "..."],
      "gaps": ["...", "..."],
      "overallFeedback": "Professional summary of the assessment"
    }
  `;

  if (!openai) {
    console.warn('⚠️ OpenAI not configured — returning fallback evaluation.');
    return {
      scores: { technical: 65, soft_skills: 70, leadership: 60, communication: 75 },
      strengths: ['Problem Solving', 'Communication'],
      gaps: ['Technical Depth', 'Leadership Experience'],
      overallFeedback: 'You show good foundational skills. Focus on deepening your technical expertise and taking on leadership opportunities.'
    };
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  });

  return JSON.parse(response.choices[0].message.content);
};

/**
 * Generates a career counselling response based on student message and context.
 * @param {string} message - User's message
 * @param {Object} context - { skillProfile, roadmap, interest }
 * @returns {Promise<string>} - AI response
 */
const generateCounsellingResponse = async (message, context) => {
  const prompt = `
    You are the Talent-BridgeX AI Career Counsellor. 
    A student is asking for advice.
    
    Student Context:
    - Skill Profile: ${JSON.stringify(context.skillProfile)}
    - Roadmap: ${JSON.stringify(context.roadmap)}
    - Career Interest: ${context.interest}
    
    Student Message: "${message}"
    
    Provide professional, encouraging, and highly specific career advice. 
    Reference their specific skills and roadmap milestones where appropriate.
    Keep the tone editorial and professional.
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You are a professional career consultant with expertise in global talent trends." },
      { role: "user", content: prompt }
    ]
  });

  return response.choices[0].message.content;
};

module.exports = {
  generateRoadmap,
  generateAssessmentQuestions,
  evaluateAssessment,
  generateCounsellingResponse
};
