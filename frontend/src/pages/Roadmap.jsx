import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ExternalLink, 
  RefreshCcw, 
  Loader2,
  ChevronRight,
  Target,
  Zap,
  BarChart3
} from 'lucide-react';
import { roadmapService } from '../services/ai.service';
import { authService } from '../services/auth.service';

import { useLocation, useNavigate } from 'react-router-dom';

const Roadmap = () => {
  const location = useLocation();
  const [roadmap, setRoadmap] = useState(location.state?.roadmap || null);
  const [loading, setLoading] = useState(!location.state?.roadmap);
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  useEffect(() => {
    const fetchRoadmap = async () => {
      // If we already have roadmap from state, don't fetch again unless user refresh
      if (roadmap) {
        setLoading(false);
        return;
      }

      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const data = await roadmapService.get(user.id);
        setRoadmap(data);
      } catch (error) {
        console.error("Failed to fetch roadmap, checking local cache:", error);
        const cached = localStorage.getItem(`roadmap_${user.id}`);
        if (cached) {
          try {
            setRoadmap(JSON.parse(cached));
          } catch (e) {
            console.error('Local cache corruption:', e);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, [user?.id, roadmap]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-accent" size={48} />
        <p className="text-[10px] uppercase tracking-[0.3em] text-secondary animate-pulse">Retrieving learning path...</p>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center">
        <div className="max-w-md w-full border border-border p-12 bg-white space-y-8">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-accent/5 rounded-full flex items-center justify-center">
              <Target size={32} className="text-accent" />
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-serif">No roadmap found</h1>
            <p className="text-secondary font-serif italic">Complete your skill assessment to generate your personalized learning journey.</p>
          </div>
          <button 
            onClick={() => navigate('/assessment')}
            className="btn-primary w-full py-4 text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
          >
            Take Assessment <ChevronRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b border-border py-12 px-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 text-[10px] uppercase tracking-widest font-bold bg-accent text-white">
                {roadmap.level}
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-secondary">Skill Roadmap</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif leading-tight">{roadmap.roadmapTitle}</h1>
          </div>
          
          <a 
            href={roadmap.roadmapUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-primary flex items-center gap-2 text-[10px] uppercase tracking-widest py-4 px-8"
          >
            Open Full Roadmap on roadmap.sh <ExternalLink size={14} />
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-8 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Feedback Section */}
          <div className="border border-border p-10 bg-white space-y-8">
            <div className="flex items-center gap-3">
              <Zap size={18} className="text-accent" />
              <h3 className="text-xs uppercase tracking-[0.3em] text-secondary font-bold">Personalized Analysis</h3>
            </div>
            <p className="text-2xl font-serif italic text-primary leading-relaxed">
              "{roadmap.overallFeedback}"
            </p>
          </div>

          {/* Scores Breakdown if exists */}
          {roadmap.scores && (
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <BarChart3 size={18} className="text-accent" />
                <h3 className="text-xs uppercase tracking-[0.3em] text-secondary font-bold">Score Breakdown</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(roadmap.scores).map(([key, value]) => (
                  <div key={key} className="border border-border p-6 bg-white space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase tracking-widest text-secondary font-bold">{key.replace('_', ' ')}</span>
                      <span className="text-xl font-serif">{value}%</span>
                    </div>
                    <div className="w-full bg-border h-[2px] relative">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${value}%` }}
                        className="absolute inset-y-0 left-0 bg-primary"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-8">
          {/* Strengths & Gaps */}
          <div className="border border-border p-8 bg-white space-y-10">
            <div className="space-y-6">
              <h4 className="text-[10px] uppercase tracking-widest text-secondary font-bold">Core Strengths</h4>
              <div className="space-y-3">
                {roadmap.strengths?.map((s, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm font-serif italic text-primary">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    {s}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] uppercase tracking-widest text-secondary font-bold">Growth Areas</h4>
              <div className="space-y-3">
                {roadmap.gaps?.map((g, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm font-serif italic text-primary">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                    {g}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-border">
              <button 
                onClick={() => navigate('/assessment')}
                className="btn-outline w-full py-4 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest"
              >
                <RefreshCcw size={14} /> Retake Assessment
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Roadmap;
