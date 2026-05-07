export const categories = [
  "Technical Deep-dives",
  "Soft Skill Mastery",
  "Domain Knowledge"
];

export const modules = [
  {
    id: "sys-arch-101",
    title: "System Architecture Fundamentals",
    category: "Technical Deep-dives",
    description: "An editorial deep-dive into scalable system design, covering load balancing, microservices, and database sharding.",
    duration: "4.5 Hours",
    level: "Intermediate",
    prerequisites: ["Data Structures", "Networking Basics"],
    videoUrl: "https://www.youtube.com/embed/SqcXyL2RaDU",
    content: `
      ## The Philosophy of Scale
      Scaling a system is not just about adding more servers. It's about understanding the bottlenecks of your architecture.
      
      ### Vertical vs Horizontal Scaling
      Vertical scaling (scaling up) means adding more power (CPU, RAM) to an existing server. Horizontal scaling (scaling out) means adding more servers to your pool of resources.
      
      ### The CAP Theorem
      In theoretical computer science, the CAP theorem states that it is impossible for a distributed data store to simultaneously provide more than two out of the following three guarantees: Consistency, Availability, and Partition Tolerance.
    `,
    quiz: [
      {
        question: "Which component of the CAP theorem ensures all nodes see the same data at the same time?",
        options: ["Consistency", "Availability", "Partition Tolerance"],
        answer: "Consistency"
      }
    ]
  },
  {
    id: "comm-exec-202",
    title: "Executive Communication for Engineers",
    category: "Soft Skill Mastery",
    description: "Learn how to translate complex technical concepts into business value for stakeholders and executives.",
    duration: "2 Hours",
    level: "Advanced",
    prerequisites: ["None"],
    videoUrl: "https://www.youtube.com/embed/example",
    content: "Content about executive communication...",
    quiz: []
  },
  {
    id: "fin-tech-303",
    title: "FinTech & Global Markets",
    category: "Domain Knowledge",
    description: "Understanding the intersection of technology and global finance, from HFT to blockchain settlement.",
    duration: "6 Hours",
    level: "Intermediate",
    prerequisites: ["Basic Economics"],
    videoUrl: "https://www.youtube.com/embed/example",
    content: "Content about FinTech...",
    quiz: []
  }
];
