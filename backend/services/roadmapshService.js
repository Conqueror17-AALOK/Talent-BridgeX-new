/**
 * Service to fetch roadmaps from roadmap.sh API
 */

let cachedRoadmapList = null;

const roadmapshService = {
  /**
   * Fetches the list of all available roadmaps
   * GET https://roadmap.sh/api/v1-roadmap
   */
  getRoadmapList: async () => {
    if (cachedRoadmapList) return cachedRoadmapList;

    const apiUrl = process.env.ROADMAP_SH_API_URL || 'https://roadmap.sh/api/v1-roadmap';
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) return [];
      const data = await response.json();
      cachedRoadmapList = data;
      return cachedRoadmapList;
    } catch (error) {
      console.error('Error fetching roadmap list:', error.message);
      return [];
    }
  },

  /**
   * Fetches a specific roadmap by its slug
   * GET https://roadmap.sh/api/v1-roadmap/${slug}
   */
  getRoadmapBySlug: async (slug) => {
    const apiUrl = process.env.ROADMAP_SH_API_URL || 'https://roadmap.sh/api/v1-roadmap';
    try {
      const response = await fetch(`${apiUrl}/${slug}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error(`Error fetching roadmap for ${slug}:`, error.message);
      return null;
    }
  },

  /**
   * Fuzzy matches user interest to a roadmap slug
   */
  matchRoadmapToInterest: (interest) => {
    if (!interest) return 'full-stack';
    const normalized = interest.toLowerCase().trim();
    
    // Hardcoded fallback map
    const fallbacks = {
      'frontend': 'frontend',
      'backend': 'backend',
      'devops': 'devops',
      'data science': 'data-science',
      'ai': 'ai-data-scientist',
      'ml': 'ai-data-scientist',
      'machine learning': 'ai-data-scientist',
      'android': 'android',
      'ios': 'ios',
      'blockchain': 'blockchain',
      'cybersecurity': 'cyber-security',
      'ux': 'ux-design',
      'design': 'ux-design',
      'python': 'python',
      'javascript': 'javascript',
      'react': 'react'
    };

    // Check direct matches
    if (fallbacks[normalized]) return fallbacks[normalized];

    // Fuzzy matching: check if normalized interest contains any key or vice-versa
    for (const [key, slug] of Object.entries(fallbacks)) {
      if (normalized.includes(key) || key.includes(normalized)) {
        return slug;
      }
    }

    return 'full-stack';
  },

  /**
   * Builds a personalized roadmap based on scores, strengths, and gaps
   */
  buildPersonalisedRoadmap: async (interest, scores, gaps = [], strengths = []) => {
    const slug = roadmapshService.matchRoadmapToInterest(interest);
    const roadmapData = await roadmapshService.getRoadmapBySlug(slug);

    if (!roadmapData) {
      // Graceful fallback
      return {
        roadmapSlug: slug,
        roadmapTitle: interest,
        roadmapUrl: `https://roadmap.sh/${slug}`,
        level: 'beginner',
        topics: [],
        totalTopics: 0,
        completedTopics: 0
      };
    }

    // Determine level
    // scores is an object like { technical: 80, ... }
    const scoreValues = Object.values(scores || {}).filter(v => typeof v === 'number');
    const avgScore = scoreValues.length > 0 
      ? scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length 
      : 0;

    let level = 'beginner';
    let slicePercentage = 0.4;

    if (avgScore > 70) {
      level = 'advanced';
      slicePercentage = 1.0;
    } else if (avgScore >= 40) {
      level = 'intermediate';
      slicePercentage = 0.7;
    }

    // Slice topics
    const rawNodes = roadmapData.topics || roadmapData.nodes || [];
    const slicedCount = Math.ceil(rawNodes.length * slicePercentage);
    const slicedNodes = rawNodes.slice(0, slicedCount);

    // Mark nodes with status
    const topics = slicedNodes.map(node => {
      const title = (node.title || node.name || '').toLowerCase();
      
      let status = 'pending';
      
      // Check for gaps
      if (gaps.some(gap => title.includes(gap.toLowerCase()) || gap.toLowerCase().includes(title))) {
        status = 'focus';
      } 
      // Check for strengths
      else if (strengths.some(strength => title.includes(strength.toLowerCase()) || strength.toLowerCase().includes(title))) {
        status = 'strong';
      }

      return {
        id: node.id || Math.random().toString(36).substr(2, 9),
        title: node.title || node.name,
        description: node.description || '',
        status
      };
    });

    return {
      roadmapSlug: slug,
      roadmapTitle: roadmapData.title || interest,
      roadmapUrl: `https://roadmap.sh/${slug}`,
      level,
      topics,
      totalTopics: topics.length,
      completedTopics: topics.filter(t => t.status === 'strong').length
    };
  }
};

module.exports = roadmapshService;
