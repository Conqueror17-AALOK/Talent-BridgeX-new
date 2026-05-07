import api from '../lib/api';

export const assessmentService = {
  getQuestions: async (interest) => {
    const response = await api.get(`/assessment/questions?interest=${interest}`);
    return response.data;
  },

  submitAssessment: async (userId, answers, interest) => {
    const response = await api.post('/assessment/submit', { userId, answers, interest });
    return response.data;
  },
};

export const roadmapService = {
  generate: async (userId, scores, interest, currentLevel) => {
    const response = await api.post('/roadmap/generate', { userId, scores, interest, currentLevel });
    return response.data;
  },

  get: async (userId) => {
    const response = await api.get(`/roadmap/${userId}`);
    return response.data;
  },
};
