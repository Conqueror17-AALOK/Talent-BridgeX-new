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
 * Returns exactly 4 hardcoded opening questions.
 */
const generatePhase1Questions = () => [
  {
    id: 1,
    question: "What is your primary area of interest?",
    type: "mcq",
    options: ["Frontend Development", "Backend Development", "Data Science & AI", "DevOps & Cloud", "Cybersecurity", "Android Development", "iOS Development", "UX/UI Design", "Blockchain", "Python / Scripting"],
    category: "Technical"
  },
  {
    id: 2,
    question: "What is your current experience level?",
    type: "mcq",
    options: ["Complete Beginner", "Some Exposure (< 6 months)", "Intermediate (6 months – 2 years)", "Experienced (2+ years)"],
    category: "Technical"
  },
  {
    id: 3,
    question: "What is your primary learning goal?",
    type: "mcq",
    options: ["Get my first job/internship", "Switch careers", "Deepen existing skills", "Build a product/startup", "Academic research"],
    category: "Soft Skills"
  },
  {
    id: 4,
    question: "How many hours per week can you dedicate to learning?",
    type: "mcq",
    options: ["Less than 5 hours", "5–10 hours", "10–20 hours", "20+ hours"],
    category: "Soft Skills"
  }
];

const PHASE2_FALLBACKS = {
  "Frontend Development": [
    { id: 5, question: "Which of these is NOT a semantic HTML tag?", type: "mcq", options: ["<header>", "<section>", "<div>", "<article>"], category: "Technical", skillArea: "HTML" },
    { id: 6, question: "What is the primary purpose of the 'useEffect' hook in React?", type: "mcq", options: ["Manage global state", "Handle side effects", "Improve performance", "Route navigation"], category: "Technical", skillArea: "React" },
    { id: 7, question: "Which CSS property is used to create a flex container?", type: "mcq", options: ["display: flex", "layout: flex", "flex-direction: row", "align-items: center"], category: "Technical", skillArea: "CSS" },
    { id: 8, question: "What does 'prop drilling' refer to in React?", type: "mcq", options: ["Fast data fetching", "Passing data through multiple levels", "Optimizing renders", "Building reusable components"], category: "Technical", skillArea: "React" },
    { id: 9, question: "Which tool is commonly used for bundling JavaScript applications?", type: "mcq", options: ["Babel", "Webpack", "Prettier", "ESLint"], category: "Technical", skillArea: "Tooling" },
    { id: 10, question: "What is the DOM?", type: "mcq", options: ["A style sheet", "A programming language", "An interface for web documents", "A database"], category: "Technical", skillArea: "JS" },
    { id: 11, question: "Which of these is a popular CSS-in-JS library?", type: "mcq", options: ["Sass", "Bootstrap", "Styled Components", "Tailwind"], category: "Technical", skillArea: "CSS" },
    { id: 12, question: "What does SEO stand for?", type: "mcq", options: ["System Engine Optimization", "Search Engine Optimization", "Secure Entry Option", "Static Element Object"], category: "Technical", skillArea: "General" }
  ],
  "Backend Development": [
    { id: 5, question: "What is the main purpose of an index in a database?", type: "mcq", options: ["To store data", "To speed up data retrieval", "To encrypt data", "To backup data"], category: "Technical", skillArea: "Database" },
    { id: 6, question: "Which HTTP method is used to update an existing resource?", type: "mcq", options: ["GET", "POST", "PUT", "DELETE"], category: "Technical", skillArea: "API" },
    { id: 7, question: "What is middleware in Express.js?", type: "mcq", options: ["A database layer", "Functions that execute during the request cycle", "A front-end framework", "A load balancer"], category: "Technical", skillArea: "Node.js" },
    { id: 8, question: "What does ACID stand for in database transactions?", type: "mcq", options: ["Atomicity, Consistency, Isolation, Durability", "Accuracy, Complexity, Integrity, Design", "Access, Control, Internal, Data", "Always Clean In Data"], category: "Technical", skillArea: "Database" },
    { id: 9, question: "Which of these is a NoSQL database?", type: "mcq", options: ["PostgreSQL", "MySQL", "MongoDB", "SQLite"], category: "Technical", skillArea: "Database" },
    { id: 10, question: "What is JWT used for?", type: "mcq", options: ["Database caching", "User authentication", "Image processing", "Unit testing"], category: "Technical", skillArea: "Security" },
    { id: 11, question: "Which status code represents 'Not Found'?", type: "mcq", options: ["200", "401", "404", "500"], category: "Technical", skillArea: "API" },
    { id: 12, question: "What is the purpose of hashing passwords?", type: "mcq", options: ["To compress them", "To store them securely", "To make them easier to remember", "To speed up login"], category: "Technical", skillArea: "Security" }
  ],
  "Data Science & AI": [
    { id: 5, question: "Which library is most commonly used for data manipulation in Python?", type: "mcq", options: ["Matplotlib", "Pandas", "Scikit-Learn", "TensorFlow"], category: "Technical", skillArea: "Python" },
    { id: 6, question: "What is supervised learning?", type: "mcq", options: ["Learning without labels", "Learning with labeled data", "Learning through rewards", "Learning from scratch"], category: "Technical", skillArea: "ML" },
    { id: 7, question: "Which of these is a common metric for evaluating regression models?", type: "mcq", options: ["Accuracy", "F1 Score", "Mean Squared Error", "Precision"], category: "Technical", skillArea: "ML" },
    { id: 8, question: "What is the purpose of 'overfitting' in machine learning?", type: "mcq", options: ["Improving generalization", "Model performing well on training data but poorly on test data", "Speeding up training", "Reducing model size"], category: "Technical", skillArea: "ML" },
    { id: 9, question: "What does 'NLP' stand for?", type: "mcq", options: ["Natural Language Processing", "Node Language Protocol", "Network Layer Performance", "Neural Logic Path"], category: "Technical", skillArea: "AI" },
    { id: 10, question: "Which activation function is commonly used in hidden layers of a neural network?", type: "mcq", options: ["Linear", "Sigmoid", "ReLU", "Step"], category: "Technical", skillArea: "Deep Learning" },
    { id: 11, question: "What is a 'DataFrame'?", type: "mcq", options: ["A 2D labeled data structure", "A type of plot", "A machine learning algorithm", "A database table"], category: "Technical", skillArea: "Data Analysis" },
    { id: 12, question: "Which of these is used for deep learning?", type: "mcq", options: ["NumPy", "PyTorch", "BeautifulSoup", "Seaborn"], category: "Technical", skillArea: "Deep Learning" }
  ],
  "DevOps & Cloud": [
    { id: 5, question: "What does CI/CD stand for?", type: "mcq", options: ["Continuous Integration / Continuous Deployment", "Code Inspection / Code Design", "Cloud Infrastructure / Cloud Data", "Command Interface / Command Delivery"], category: "Technical", skillArea: "DevOps" },
    { id: 6, question: "Which tool is widely used for containerization?", type: "mcq", options: ["Jenkins", "Docker", "Ansible", "Terraform"], category: "Technical", skillArea: "Containers" },
    { id: 7, question: "What is the role of Kubernetes?", type: "mcq", options: ["Source code management", "Container orchestration", "Database administration", "Web server"], category: "Technical", skillArea: "Orchestration" },
    { id: 8, question: "Which of these is an 'Infrastructure as Code' tool?", type: "mcq", options: ["Git", "Docker Hub", "Terraform", "Slack"], category: "Technical", skillArea: "IaC" },
    { id: 9, question: "What is a 'load balancer'?", type: "mcq", options: ["A tool to speed up CPU", "Distributes incoming network traffic across multiple servers", "A backup storage", "A security firewall"], category: "Technical", skillArea: "Infrastructure" },
    { id: 10, question: "Which cloud provider offers 'AWS'?", type: "mcq", options: ["Google", "Microsoft", "Amazon", "IBM"], category: "Technical", skillArea: "Cloud" },
    { id: 11, question: "What is the purpose of a monitoring tool like Prometheus?", type: "mcq", options: ["To write code", "To track system performance and health", "To deploy applications", "To manage users"], category: "Technical", skillArea: "Monitoring" },
    { id: 12, question: "What does 'serverless' computing mean?", type: "mcq", options: ["No servers are involved", "Developers don't have to manage server infrastructure", "Running apps on a local machine", "Using only physical hardware"], category: "Technical", skillArea: "Cloud" }
  ]
};

const generatePhase2Questions = async (interest, level, goal) => {
  if (!openai) {
    console.warn('⚠️ OpenAI not configured — returning fallback phase 2 questions.');
    return PHASE2_FALLBACKS[interest] || PHASE2_FALLBACKS["Frontend Development"];
  }

  const prompt = `
    Generate exactly 8 skill-specific MCQ questions for a student interested in "${interest}".
    The student's level is "${level}" and their goal is "${goal}".
    
    Focus on diagnosing specific knowledge gaps relevant to this field.
    
    Each question must be a JSON object with:
    - id (start from 5)
    - question (string)
    - type: "mcq"
    - options (exactly 4 options)
    - category (Technical, Soft Skills, or Leadership)
    - skillArea (e.g. "React", "Database", "AWS")
    
    Return exactly as a JSON object with a single key "questions" containing the array.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const parsed = JSON.parse(response.choices[0].message.content);
    return parsed.questions || (Array.isArray(parsed) ? parsed : []);
  } catch (error) {
    console.error("AI Phase 2 Question Generation Error:", error);
    return PHASE2_FALLBACKS[interest] || PHASE2_FALLBACKS["Frontend Development"];
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
  generatePhase1Questions,
  generatePhase2Questions,
  evaluateAssessment,
  generateCounsellingResponse
};
