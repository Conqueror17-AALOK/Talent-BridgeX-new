import AppLayout from '../components/AppLayout';
import { motion } from 'framer-motion';
import { Bell, Search, ArrowUpRight, Sparkles, Loader2 } from 'lucide-react';
import SEO from '../components/SEO';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { roadmapService } from '../services/ai.service';

const getInitials = (name = '') =>
  name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(true);
  const [roadmap, setRoadmap] = useState(null);
  const [roadmapLoading, setRoadmapLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      setSuggestionsLoading(true);
      try {
        let skills = [];
        if (user?.id) {
          const skillsRes = await apiClient.get(`/users/${user.id}/skills`);
          skills = skillsRes.data.strengths || [];
        }
        
        // If no skills yet, use defaults
        if (skills.length === 0) {
          skills = ['React', 'Node.js', 'Python'];
        }

        const response = await apiClient.post('/ai/suggest', { skills });
        setAiSuggestions(response.data.suggestions || []);
      } catch (error) {
        console.warn('AI suggestions unavailable:', error.message);
        setAiSuggestions(['Frontend Engineer', 'Full Stack Developer', 'Software Engineer']);
      } finally {
        setSuggestionsLoading(false);
      }
    };
    if (user) fetchSuggestions();
  }, [user]);

  useEffect(() => {
    const fetchRoadmap = async () => {
      if (!user?.id) return;
      try {
        const data = await roadmapService.get(user.id);
        setRoadmap(data);
      } catch (error) {
        console.warn('Roadmap fetch error:', error.message);
      } finally {
        setRoadmapLoading(false);
      }
    };
    fetchRoadmap();
  }, [user]);

  const handleApplyNow = (row) => {
    toast.info(`Opening opportunities for "${row.name}"…`);
    navigate('/opportunities');
  };

  const handleViewHistory = () => {
    toast.info('Application history coming soon — check Analytics for now.');
    navigate('/analytics');
  };

  const handleActionItem = (action) => {
    if (action.type === 'Learning') navigate('/learn');
    else if (action.type === 'Opportunity') navigate('/opportunities');
    else if (action.type === 'Community') navigate('/community');
  };

  const topBar = (
    <>
      <div className="flex items-center gap-3 text-secondary min-w-0">
        <Search size={18} className="shrink-0" />
        <input
          type="text"
          placeholder="Search resources..."
          className="bg-transparent border-none outline-none text-sm uppercase tracking-widest w-0 sm:w-48 md:w-64 transition-all"
        />
      </div>
      
      <div className="flex items-center gap-4 md:gap-8 shrink-0">
        <div className="text-right border-r border-border pr-4 md:pr-8 hidden sm:block">
          <p className="text-[10px] uppercase tracking-widest text-secondary font-bold">University</p>
          <p className="text-xs font-serif italic truncate max-w-[160px]">{user?.university || 'Your University'}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="relative p-2 text-secondary hover:text-primary transition-colors" aria-label="Notifications">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-accent rounded-full" />
          </button>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-serif font-bold leading-none">{user?.name || 'Student'}</p>
              <p className="text-[10px] uppercase tracking-widest text-accent font-bold mt-1">{user?.careerInterest || 'Candidate'}</p>
            </div>
            <Link to="/profile">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} className="w-9 h-9 object-cover border border-border shrink-0" />
              ) : (
                <div className="w-9 h-9 bg-primary text-white flex items-center justify-center font-serif text-base shrink-0 hover:bg-accent transition-colors">
                  {getInitials(user?.name)}
                </div>
              )}
            </Link>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <AppLayout topBar={topBar}>
      <SEO title="Dashboard" />
      
      <div className="p-4 md:p-8">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto space-y-10 md:space-y-12"
        >
          {/* Header / Overview */}
          <motion.div variants={itemVariants} className="space-y-6 md:space-y-10">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 border-b border-border pb-4">
              <h1 className="text-3xl md:text-5xl font-serif">Intelligence Overview</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-secondary">Last Sync: Today, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} GMT</p>
            </div>

            {/* Roadmap Hero Card */}
            {roadmapLoading ? (
              <div className="bg-white border border-border p-12 text-center">
                <Loader2 size={24} className="animate-spin mx-auto text-accent mb-4" />
                <p className="text-[10px] uppercase tracking-widest text-secondary font-bold">Synchronizing Intelligence...</p>
              </div>
            ) : roadmap ? (
              <div className="bg-primary text-white p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-10 group relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                
                <div className="space-y-6 text-center md:text-left flex-1 relative z-10">
                  <div className="flex items-center justify-center md:justify-start gap-4">
                    <span className="px-3 py-1 bg-accent text-primary text-[10px] uppercase tracking-[0.2em] font-bold">
                      {roadmap.level}
                    </span>
                    <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-white/60">Career Trajectory</h3>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-serif leading-tight">{roadmap.roadmapTitle}</h2>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    {roadmap.gaps?.slice(0, 4).map((gap, i) => (
                      <span key={i} className="text-[10px] uppercase tracking-widest text-accent font-bold px-2 py-1 border border-accent/30 bg-accent/5">
                        {gap}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col items-center md:items-end gap-6 shrink-0 relative z-10">
                  <div className="text-right hidden md:block">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold mb-2">Completion Vector</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-serif text-accent">{Math.round((roadmap.completedTopics / roadmap.totalTopics) * 100) || 0}%</span>
                      <span className="text-xs text-white/60 uppercase tracking-widest font-bold">Progress</span>
                    </div>
                  </div>
                  <Link 
                    to="/roadmap" 
                    className="btn-primary bg-accent hover:bg-white text-primary flex items-center gap-3 px-10 py-5 text-xs font-bold uppercase tracking-widest transition-all hover:scale-105"
                  >
                    View Roadmap <ArrowUpRight size={16} />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-border p-10 md:p-16 text-center space-y-8">
                <div className="space-y-4">
                  <h3 className="text-3xl md:text-4xl font-serif">Unlock Your Precision Career Roadmap</h3>
                  <p className="text-secondary font-serif italic max-w-xl mx-auto text-lg">
                    Our AI has detected an incomplete profile. Execute the skill assessment to map your path to industry standards.
                  </p>
                </div>
                <div className="flex justify-center">
                  <button 
                    onClick={() => navigate('/assessment')}
                    className="btn-primary px-12 py-5 text-xs font-bold uppercase tracking-[0.2em]"
                  >
                    Start Intelligence Assessment
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Asymmetric Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            
            {/* Left Column */}
            <div className="md:col-span-8 space-y-10 md:space-y-12">
              <motion.section variants={itemVariants} className="space-y-6">
                <h3 className="text-xs uppercase tracking-widest font-bold border-b border-border pb-2">Priority Recommended Actions</h3>
                <div className="space-y-px bg-border">
                  {[
                    { title: 'Complete Module 3: System Architecture', type: 'Learning', priority: 'High' },
                    { title: 'Apply to Research Internship at DeepMind', type: 'Opportunity', priority: 'Match: 92%' },
                    { title: 'Join "Advanced React" Peer Study Group', type: 'Community', priority: 'Starts in 2h' },
                  ].map((action, i) => (
                    <button
                      key={i}
                      onClick={() => handleActionItem(action)}
                      className="bg-white p-4 md:p-6 flex justify-between items-center hover:bg-background transition-colors group cursor-pointer gap-4 w-full text-left"
                    >
                      <div className="flex items-center gap-4 md:gap-6 min-w-0">
                        <span className="text-xs font-serif italic text-accent shrink-0">0{i+1}</span>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold uppercase tracking-wide group-hover:text-accent transition-colors truncate">{action.title}</h4>
                          <p className="text-[10px] uppercase tracking-widest text-secondary mt-1">{action.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-secondary hidden sm:block">{action.priority}</span>
                        <ArrowUpRight size={14} className="text-border group-hover:text-accent transition-all" />
                      </div>
                    </button>
                  ))}
                </div>
              </motion.section>

              <motion.section variants={itemVariants} className="space-y-6">
                <h3 className="text-xs uppercase tracking-widest font-bold border-b border-border pb-2 flex items-center gap-2">
                  <Sparkles size={14} className="text-accent" /> AI Career Suggestions
                </h3>
                <div className="space-y-px bg-border">
                  {suggestionsLoading ? (
                    <div className="bg-white p-6 text-center text-sm text-secondary italic">Analyzing your profile…</div>
                  ) : aiSuggestions.map((job, i) => (
                    <div key={i} className="bg-white p-4 md:p-6 flex justify-between items-center hover:bg-background transition-colors group cursor-pointer gap-4">
                      <div className="flex items-center gap-4 md:gap-6 min-w-0">
                        <span className="text-xs font-serif italic text-accent shrink-0">0{i+1}</span>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold uppercase tracking-wide group-hover:text-accent transition-colors truncate">{job}</h4>
                          <p className="text-[10px] uppercase tracking-widest text-secondary mt-1">Suggested Role</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-accent hidden sm:block">High Match</span>
                        <ArrowUpRight size={14} className="text-border group-hover:text-accent transition-all" />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>

              <motion.section variants={itemVariants} className="space-y-6">
                <h3 className="text-xs uppercase tracking-widest font-bold border-b border-border pb-2">Upcoming Deadlines</h3>
                <div className="overflow-x-auto">
                  <table className="data-table min-w-[480px]">
                    <thead>
                      <tr>
                        <th>Opportunity Name</th>
                        <th>Category</th>
                        <th>Deadline</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'Vercel Summer Fellowship', cat: 'Internship', date: 'May 12, 2026' },
                        { name: 'Open Source Grant v2', cat: 'Research', date: 'May 20, 2026' },
                        { name: 'Frontend Architect Role', cat: 'Full-time', date: 'June 02, 2026' },
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-background transition-colors">
                          <td className="font-serif italic text-base">{row.name}</td>
                          <td className="text-[10px] uppercase tracking-widest text-secondary">{row.cat}</td>
                          <td className="text-xs font-mono">{row.date}</td>
                          <td>
                            <button
                              onClick={() => handleApplyNow(row)}
                              className="text-accent hover:underline text-[10px] uppercase tracking-widest font-bold"
                            >
                              Apply Now
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.section>
            </div>

            {/* Right Column */}
            <div className="md:col-span-4 space-y-10 md:space-y-12">
              <motion.section variants={itemVariants} className="space-y-6">
                <h3 className="text-xs uppercase tracking-widest font-bold border-b border-border pb-2">Skill Profile Radar</h3>
                <div className="aspect-square bg-white border border-border flex items-center justify-center p-8">
                  <div className="w-full h-full border border-border border-dashed flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-full rotate-45 border-r border-b border-border/30" />
                      <div className="absolute w-full h-full -rotate-45 border-r border-b border-border/30" />
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-secondary/40 font-mono text-center">
                      COGNITIVE_MAP_LOADED<br />[RENDER_ACTIVE]
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-border p-4">
                    <p className="text-[10px] uppercase tracking-widest text-secondary mb-1">Technical</p>
                    <p className="text-xl font-serif">78%</p>
                  </div>
                  <div className="border border-border p-4">
                    <p className="text-[10px] uppercase tracking-widest text-secondary mb-1">Soft Skills</p>
                    <p className="text-xl font-serif">92%</p>
                  </div>
                </div>
              </motion.section>

              <motion.section variants={itemVariants} className="space-y-6">
                <h3 className="text-xs uppercase tracking-widest font-bold border-b border-border pb-2">Recent Intelligence</h3>
                <div className="space-y-6">
                  {[
                    { text: 'Skill assessment "Communication" updated.', time: '2h ago' },
                    { text: 'New internship match: Stripe (San Francisco)', time: '5h ago' },
                    { text: 'Completed "Cloud Computing" module.', time: 'Yesterday' },
                  ].map((feed, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-1.5 h-1.5 bg-accent mt-1.5 shrink-0" />
                      <div>
                        <p className="text-xs leading-relaxed">{feed.text}</p>
                        <p className="text-[10px] uppercase tracking-widest text-secondary mt-1">{feed.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={handleViewHistory} className="w-full btn-outline py-3 text-[10px]">
                  View Full History
                </button>
              </motion.section>
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
