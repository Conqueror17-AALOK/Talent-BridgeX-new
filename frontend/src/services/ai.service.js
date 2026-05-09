import api from '../lib/api';

export const assessmentService = {
  getQuestions: async (interest) => {
    const response = await api.get(`/assessment/questions?interest=${interest}`);
    return response.data;
  },

  getPhase1: async () => {
    const response = await api.get('/assessment/phase1');
    return response.data;
  },

  getPhase2: async (interest, level, goal) => {
    const response = await api.get(`/assessment/phase2?interest=${encodeURIComponent(interest)}&level=${encodeURIComponent(level)}&goal=${encodeURIComponent(goal)}`);
    return response.data;
  },

  submitAssessment: async (userId, answers, interest) => {
    const response = await api.post('/assessment/submit', { userId, answers, interest });
    return response.data;
  },
};

export const roadmapService = {
  generate: async (data) => {
    // data: { userId, scores, interest, currentLevel, answers, gaps, strengths, overallFeedback }
    const response = await api.post('/roadmap/generate', data);
    return response.data;
  },

  get: async (userId) => {
    const response = await api.get(`/roadmap/${userId}`);
    return response.data;
  },
};
