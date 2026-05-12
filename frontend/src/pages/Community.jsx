import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, MessageSquare, Video, Plus, ArrowUpRight, MessageCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { communityStats, studyGroups as staticStudyGroups, forumPosts, mentors } from '../data/community';
import apiClient from '../api/apiClient';
import { useEffect } from 'react';

const Community = () => {
  const [activeTab, setActiveTab] = useState('Groups');
  const [studyGroups, setStudyGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joiningGroup, setJoiningGroup] = useState(null);
  const [connectingMentor, setConnectingMentor] = useState(null);
  const [requestingMatch, setRequestingMatch] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get('/community/groups');
        const data = response.data || [];
        setStudyGroups(data.length > 0 ? data : staticStudyGroups);
      } catch (err) {
        console.warn('Community API unavailable, using fallback:', err.message);
        setStudyGroups(staticStudyGroups);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  const handleJoinGroup = async (group) => {
    if (!user) { toast.error('Please log in to join groups.'); return; }
    setJoiningGroup(group.name);
    await new Promise(r => setTimeout(r, 900)); // simulate API
    setJoiningGroup(null);
    toast.success(`Joined "${group.name}"! Check your email for session details.`);
  };

  const handleConnectMentor = async (mentor) => {
    if (!user) { toast.error('Please log in to connect with mentors.'); return; }
    setConnectingMentor(mentor.name);
    await new Promise(r => setTimeout(r, 800));
    setConnectingMentor(null);
    toast.success(`Connection request sent to ${mentor.name}!`);
  };

  const handleRequestMatch = async () => {
    if (!user) { toast.error('Please log in to request AI matching.'); return; }
    setRequestingMatch(true);
    await new Promise(r => setTimeout(r, 1200));
    setRequestingMatch(false);
    toast.success('AI matching complete! Check the mentor list below — matches are now ranked for you.');
  };

  const handleCreateNew = () => {
    if (!user) { toast.error('Please log in to create a group.'); return; }
    toast.info('Group creation coming soon — we\'re building the group management feature!');
  };

  const topBar = (
    <>
      <div className="flex items-center gap-3 text-secondary">
        <Users size={18} />
        <h2 className="text-xs uppercase tracking-widest font-bold hidden sm:block">Community & Peer Learning</h2>
        <h2 className="text-xs uppercase tracking-widest font-bold sm:hidden">Community</h2>
      </div>
      
      <div className="flex items-center gap-4 md:gap-8 shrink-0">
        <div className="flex items-center gap-2 border-r border-border pr-4 md:pr-8">
          <span className="text-[10px] uppercase tracking-widest text-secondary font-bold hidden sm:block">Reputation</span>
          <span className="text-sm font-serif italic text-accent">{communityStats.reputation}</span>
        </div>
        <button
          onClick={handleCreateNew}
          id="community-create-new"
          className="btn-primary py-2 px-4 md:px-6 text-[10px] flex items-center gap-2"
        >
          <Plus size={14} /> <span className="hidden sm:inline">Create New</span>
        </button>
      </div>
    </>
  );

  return (
    <AppLayout topBar={topBar}>
      {/* Community Hero */}
      <div className="bg-primary text-white px-6 py-10 md:p-12 lg:p-20 overflow-hidden relative">
        <div className="max-w-4xl relative z-10 space-y-4 md:space-y-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif leading-none tracking-tighter">Learn together.<br />Grow together.</h1>
          <p className="text-base md:text-xl text-white/60 font-serif italic max-w-xl">
            A global network of students, alumni, and industry experts collaborating on the next frontier of intelligence.
          </p>
        </div>
        <div className="mt-8 md:mt-0 md:absolute md:bottom-0 md:right-0 md:p-12 flex gap-8 md:gap-12 text-left md:text-right">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Active Groups</p>
            <p className="text-2xl md:text-3xl font-serif">{communityStats.activeGroups}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Live Now</p>
            <p className="text-2xl md:text-3xl font-serif">{communityStats.liveSessions}</p>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="bg-white border-b border-border px-6 md:px-8 pt-4">
        <div className="flex gap-8 md:gap-12 overflow-x-auto">
          {['Groups', 'Forum', 'Mentorship'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[10px] uppercase tracking-widest font-bold pb-4 transition-all relative shrink-0 ${
                activeTab === tab ? 'text-primary' : 'text-secondary hover:text-primary'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div layoutId="communityTab" className="absolute bottom-0 left-0 right-0 h-1 bg-accent" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'Groups' && (
              <motion.div 
                key="groups"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border"
              >
                {studyGroups.map((group, i) => (
                  <div key={i} className="p-6 md:p-8 bg-white hover:bg-background transition-all group">
                    <div className="flex justify-between items-start mb-4 md:mb-6">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-accent">{group.domain}</span>
                      <div className="flex items-center gap-2 text-secondary">
                        <Users size={12} />
                        <span className="text-[10px] font-mono">{group.members}</span>
                      </div>
                    </div>
                    <h3 className="text-xl md:text-2xl font-serif leading-tight group-hover:text-accent transition-colors mb-3 md:mb-4">{group.name}</h3>
                    <p className="text-xs text-secondary leading-relaxed mb-6 md:mb-8 line-clamp-2">{group.description}</p>
                    <div className="pt-4 md:pt-6 border-t border-border flex justify-between items-center">
                      <div className="flex items-center gap-2 text-secondary">
                        <Video size={14} />
                        <span className="text-[10px] uppercase tracking-widest font-bold">Next: {group.nextSession}</span>
                      </div>
                      <button
                        onClick={() => handleJoinGroup(group)}
                        disabled={joiningGroup === group.name}
                        className="text-[10px] uppercase tracking-widest font-bold text-accent hover:underline flex items-center gap-1 disabled:opacity-60"
                        id={`join-group-${i}`}
                      >
                        {joiningGroup === group.name ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <ArrowUpRight size={14} />
                        )}
                        Join
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'Forum' && (
              <motion.div 
                key="forum"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-px bg-border border border-border"
              >
                {forumPosts.map((post, i) => (
                  <div key={i} className="p-4 md:p-8 bg-white hover:bg-background transition-all group cursor-pointer">
                    <div className="flex items-start gap-4 md:gap-8">
                      <div className="text-center border-r border-border pr-4 md:pr-8 shrink-0">
                        <p className="text-lg md:text-xl font-serif">{post.upvotes}</p>
                        <p className="text-[8px] uppercase tracking-widest text-secondary font-bold">Votes</p>
                      </div>
                      <div className="flex-1 min-w-0 space-y-2 md:space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map(tag => (
                            <span key={tag} className="text-[8px] uppercase tracking-widest font-bold border border-border px-2 py-0.5">{tag}</span>
                          ))}
                        </div>
                        <h3 className="text-lg md:text-2xl font-serif group-hover:text-accent transition-colors">{post.title}</h3>
                        <div className="flex flex-wrap items-center gap-3 md:gap-6 text-[10px] uppercase tracking-widest text-secondary">
                          <span>By <span className="text-primary font-bold">{post.author}</span> ({post.reputation})</span>
                          <span>{post.time}</span>
                        </div>
                      </div>
                      <div className="shrink-0 ml-auto">
                        <div className="flex items-center gap-2 text-secondary">
                          <MessageSquare size={14} />
                          <span className="text-[10px] uppercase tracking-widest font-bold">{post.replies}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'Mentorship' && (
              <motion.div 
                key="mentorship"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-10 md:space-y-12"
              >
                <div className="p-6 md:p-12 border border-border bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-12">
                  <div className="max-w-xl space-y-4">
                    <h2 className="text-3xl md:text-4xl font-serif italic">Your Intelligence Mentor</h2>
                    <p className="text-sm text-secondary leading-relaxed">
                      Our AI matching engine identifies senior students and alumni whose career paths and technical skill vectors align with your current trajectory.
                    </p>
                  </div>
                  <button
                    onClick={handleRequestMatch}
                    disabled={requestingMatch}
                    id="community-ai-match"
                    className="btn-primary py-3 md:py-4 px-8 md:px-12 uppercase tracking-[0.2em] text-xs shrink-0 flex items-center gap-2 disabled:opacity-60"
                  >
                    {requestingMatch && <Loader2 size={14} className="animate-spin" />}
                    Request AI Matching
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                  {mentors.map((mentor, i) => (
                    <div key={i} className="p-6 md:p-8 border border-border bg-white flex justify-between items-start group">
                      <div className="space-y-4 md:space-y-6 min-w-0 flex-1 mr-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-primary text-white flex items-center justify-center text-lg md:text-xl font-serif shrink-0">
                            {mentor.name[0]}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-base md:text-lg font-serif font-bold truncate">{mentor.name}</h4>
                            <p className="text-[10px] uppercase tracking-widest text-accent font-bold">{mentor.role}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {mentor.expertise.map(skill => (
                            <span key={skill} className="text-[8px] uppercase tracking-widest font-bold bg-background border border-border px-3 py-1">{skill}</span>
                          ))}
                        </div>
                        <button
                          onClick={() => handleConnectMentor(mentor)}
                          disabled={connectingMentor === mentor.name}
                          id={`connect-mentor-${i}`}
                          className="btn-outline py-2 px-6 text-[10px] flex items-center gap-2 disabled:opacity-60"
                        >
                          {connectingMentor === mentor.name ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <MessageCircle size={14} />
                          )}
                          {connectingMentor === mentor.name ? 'Connecting…' : 'Connect'}
                        </button>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-1">Match Score</p>
                        <p className="text-3xl md:text-4xl font-serif text-accent">{mentor.matchScore}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppLayout>
  );
};

export default Community;
