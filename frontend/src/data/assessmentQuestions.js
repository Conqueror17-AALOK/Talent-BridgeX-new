export const PHASE1_QUESTIONS = [
  {
    id: 1,
    question: "What is your primary area of interest?",
    type: "mcq",
    category: "Interest",
    options: [
      "Frontend Development",
      "Backend Development",
      "Data Science & AI",
      "DevOps & Cloud",
      "Cybersecurity",
      "Android Development",
      "iOS Development",
      "UX/UI Design",
      "Blockchain",
      "Python / Scripting"
    ]
  },
  {
    id: 2,
    question: "What is your current experience level in this field?",
    type: "mcq",
    category: "Level",
    options: [
      "Complete Beginner — no prior experience",
      "Some Exposure — less than 6 months",
      "Intermediate — 6 months to 2 years",
      "Experienced — 2 or more years"
    ]
  },
  {
    id: 3,
    question: "What is your primary learning goal right now?",
    type: "mcq",
    category: "Goal",
    options: [
      "Get my first job or internship",
      "Switch careers into this field",
      "Deepen existing skills",
      "Build a product or startup"
    ]
  },
  {
    id: 4,
    question: "How many hours per week can you realistically dedicate to learning?",
    type: "mcq",
    category: "Availability",
    options: [
      "Less than 5 hours",
      "5 to 10 hours",
      "10 to 20 hours",
      "More than 20 hours"
    ]
  }
];

export const PHASE2_QUESTIONS = {
  "Frontend Development": [
    { id: 5, question: "Which of these HTML/CSS concepts are you most comfortable with?", type: "mcq", category: "Technical", skillArea: "HTML/CSS", options: ["Basic tags and styling", "Flexbox and Grid layouts", "CSS animations and transitions", "Responsive design and media queries"] },
    { id: 6, question: "Which JavaScript concept do you find most challenging?", type: "mcq", category: "Technical", skillArea: "JavaScript", options: ["DOM manipulation", "Async/await and Promises", "ES6+ features (destructuring, spread, etc.)", "Event handling and closures"] },
    { id: 7, question: "Which frontend framework or library have you worked with?", type: "mcq", category: "Technical", skillArea: "Frameworks", options: ["None yet", "React (basic components)", "React (hooks, context, routing)", "Vue or Angular"] },
    { id: 8, question: "How do you currently manage state in a web app?", type: "mcq", category: "Technical", skillArea: "State Management", options: ["I haven't built apps yet", "useState and props only", "Context API or Redux", "Zustand, Jotai or similar"] },
    { id: 9, question: "Which of these build tools or workflows are you familiar with?", type: "mcq", category: "Technical", skillArea: "Tooling", options: ["None — just a text editor", "Basic npm scripts", "Vite or Webpack setup", "CI/CD pipelines and Docker"] },
    { id: 10, question: "How do you approach making a website accessible?", type: "mcq", category: "Soft Skills", skillArea: "Accessibility", options: ["I haven't thought about it", "I use semantic HTML tags", "I follow WCAG guidelines", "I test with screen readers and audits"] },
    { id: 11, question: "How comfortable are you with consuming REST APIs in a frontend app?", type: "mcq", category: "Technical", skillArea: "APIs", options: ["Not at all", "I can use fetch or axios with help", "Comfortable — I build full CRUD flows", "Expert — I handle auth, errors, caching"] },
    { id: 12, question: "What best describes your current portfolio or project experience?", type: "mcq", category: "Experience", skillArea: "Portfolio", options: ["No projects yet", "1–2 basic projects (todo, calculator)", "3–5 projects including a full-stack app", "Published projects with real users"] }
  ],
  "Backend Development": [
    { id: 5, question: "Which backend language are you most familiar with?", type: "mcq", category: "Technical", skillArea: "Language", options: ["None yet", "Node.js / JavaScript", "Python (Flask or Django)", "Java or Go"] },
    { id: 6, question: "How comfortable are you designing REST APIs?", type: "mcq", category: "Technical", skillArea: "APIs", options: ["I don't know what REST means", "I understand the concepts", "I've built basic CRUD APIs", "I design scalable APIs with auth and versioning"] },
    { id: 7, question: "Which database have you worked with?", type: "mcq", category: "Technical", skillArea: "Databases", options: ["None", "SQL basics (SELECT, INSERT)", "PostgreSQL or MySQL with joins", "Both SQL and NoSQL (MongoDB, Redis)"] },
    { id: 8, question: "How do you handle authentication in a backend app?", type: "mcq", category: "Technical", skillArea: "Auth", options: ["I haven't implemented auth", "Session-based login", "JWT tokens", "OAuth2 / third-party providers"] },
    { id: 9, question: "What is your experience with server deployment?", type: "mcq", category: "Technical", skillArea: "Deployment", options: ["Never deployed anything", "Used a managed platform (Heroku, Railway)", "Deployed to a VPS (DigitalOcean, AWS EC2)", "Use Docker and container orchestration"] },
    { id: 10, question: "How do you approach error handling in your APIs?", type: "mcq", category: "Technical", skillArea: "Reliability", options: ["I don't handle errors specifically", "I use try/catch blocks", "I return consistent error response shapes", "I log, monitor, and alert on errors"] },
    { id: 11, question: "How familiar are you with microservices architecture?", type: "mcq", category: "Technical", skillArea: "Architecture", options: ["Not familiar", "I know what it means", "I've built small microservices", "I design and maintain microservice systems"] },
    { id: 12, question: "How do you currently test your backend code?", type: "mcq", category: "Technical", skillArea: "Testing", options: ["I don't write tests", "I test manually with Postman", "I write unit tests", "I write unit and integration tests with CI"] }
  ]
};

export const GENERIC_PHASE2 = (interest) => [
  { id: 5, question: `How would you rate your current knowledge of ${interest}?`, type: "mcq", category: "Technical", skillArea: "Foundation", options: ["No knowledge", "Basic awareness", "Working knowledge", "Expert level"] },
  { id: 6, question: `How do you primarily learn new concepts in ${interest}?`, type: "mcq", category: "Soft Skills", skillArea: "Learning Style", options: ["Video courses (YouTube, Udemy)", "Books and documentation", "Building projects", "Mentorship and peer learning"] },
  { id: 7, question: "How comfortable are you with reading technical documentation?", type: "mcq", category: "Soft Skills", skillArea: "Documentation", options: ["Very uncomfortable", "I manage with effort", "Comfortable", "I prefer docs over tutorials"] },
  { id: 8, question: "How do you handle a problem you cannot solve alone?", type: "mcq", category: "Soft Skills", skillArea: "Problem Solving", options: ["I get stuck and give up", "I search online for hours", "I ask peers or communities like Stack Overflow", "I break it down systematically before searching"] },
  { id: 9, question: "How many personal or academic projects have you completed?", type: "mcq", category: "Experience", skillArea: "Projects", options: ["None", "1 to 2", "3 to 5", "More than 5"] },
  { id: 10, question: "How comfortable are you with version control (Git)?", type: "mcq", category: "Technical", skillArea: "Git", options: ["Never used Git", "I can commit and push", "Comfortable with branching and merging", "I manage repos, PRs, and code reviews"] },
  { id: 11, question: "How do you approach deadlines and self-paced learning?", type: "mcq", category: "Soft Skills", skillArea: "Time Management", options: ["I struggle to stay consistent", "I complete work last minute", "I follow a loose schedule", "I plan weekly and track progress"] },
  { id: 12, question: "What best describes your collaboration experience?", type: "mcq", category: "Soft Skills", skillArea: "Teamwork", options: ["I've only worked alone", "I've done 1 or 2 group projects", "Regular team projects at school or work", "I lead teams and manage contributions"] }
];
