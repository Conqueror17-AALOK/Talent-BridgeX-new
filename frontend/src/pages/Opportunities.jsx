import { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, DollarSign, Clock, Zap, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { toast } from 'sonner';
import { opportunityTabs, opportunities as staticOpportunities } from '../data/opportunities';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

const Opportunities = () => {
  const [activeTab, setActiveTab] = useState(opportunityTabs[0]);
  const [opportunities, setOpportunities] = useState([]);
  const [applying, setApplying] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    apiClient.get('/jobs')
      .then(res => setOpportunities(res.data))
      .catch(err => {
        console.error('Failed to fetch jobs:', err);
        setOpportunities(staticOpportunities);
      });
  }, []);

  const handleQuickApply = async (opp) => {
    if (!user) {
      toast.error('Please log in to apply for opportunities.');
      return;
    }
    setApplying(opp.id);
    try {
      // Post application to backend
      await apiClient.post(`/opportunities/${opp.id}/apply`, {
        user_id: user.id,
      });
      toast.success(`Application submitted for "${opp.title}" at ${opp.company}!`);
    } catch (err) {
      // If endpoint doesn't exist yet, show graceful message
      if (err.response?.status === 404) {
        toast.info(`Application tracking coming soon! For now, view the full details to apply.`);
      } else {
        toast.error(err.response?.data?.error || 'Failed to submit application. Please try again.');
      }
    } finally {
      setApplying(null);
    }
  };

  const topBar = (
    <>
      <div className="flex items-center gap-3 text-secondary">
        <Briefcase size={18} />
        <h2 className="text-xs uppercase tracking-widest font-bold">Opportunity Matchmaking</h2>
      </div>
      
      <div className="flex items-center gap-4 md:gap-8 shrink-0">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold">
          <Zap size={14} className="text-accent" />
          <span className="hidden sm:inline">AI Engine: <span className="text-accent">Optimized</span></span>
        </div>
      </div>
    </>
  );

  return (
    <AppLayout topBar={topBar}>
      <SEO title="Opportunities | Matchmaking" description="Browse and apply for opportunities matched to your skill profile." />
      
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        
        {/* Main List */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 min-w-0">
          <div className="max-w-5xl mx-auto space-y-10 md:space-y-12">
             
             <div className="space-y-4 md:space-y-6">
                {/* Tabs */}
                <div className="flex gap-6 md:gap-12 border-b border-border overflow-x-auto">
                  {opportunityTabs.map(tab => (
                    <button 
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`text-[10px] uppercase tracking-widest font-bold pb-4 transition-all relative shrink-0 ${
                        activeTab === tab ? 'text-primary' : 'text-secondary hover:text-primary'
                      }`}
                    >
                      {tab}
                      {activeTab === tab && (
                        <motion.div layoutId="activeTabOpp" className="absolute bottom-0 left-0 right-0 h-1 bg-accent" />
                      )}
                    </button>
                  ))}
                </div>
                
                <div className="flex justify-between items-center py-2">
                   <p className="text-[10px] uppercase tracking-widest text-secondary font-bold">
                      {opportunities.filter(o => o.type === activeTab).length} Matches Found
                   </p>
                   <div className="flex gap-4">
                      <select className="bg-transparent border border-border px-3 md:px-4 py-2 text-[10px] uppercase tracking-widest outline-none">
                         <option>Match Score: High to Low</option>
                         <option>Date: Recent</option>
                      </select>
                   </div>
                </div>
             </div>

             <div className="space-y-6 md:space-y-8">
                <AnimatePresence mode="wait">
                  {opportunities
                    .filter(o => o.type === activeTab)
                    .map((opp, i) => (
                      <motion.div 
                        key={opp.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-white border border-border p-6 md:p-10 group hover:border-accent transition-all relative overflow-hidden"
                      >
                        {/* Match Score */}
                         <div className="absolute top-0 right-0 p-4 md:p-8 text-right">
                            <p className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-1">AI Match</p>
                            <p className={`text-3xl md:text-4xl font-serif ${(opp.matchScore || 85) > 90 ? 'text-accent' : 'text-primary'}`}>{opp.matchScore || 85}%</p>
                         </div>

                        <div className="max-w-2xl space-y-6 md:space-y-8 pr-20 md:pr-0">
                           <div className="space-y-2">
                              <p className="text-xs font-serif italic text-accent">{opp.company}</p>
                              <h3 className="text-2xl md:text-4xl font-serif leading-tight group-hover:translate-x-2 transition-transform">{opp.title}</h3>
                           </div>

                           <div className="flex flex-wrap gap-x-6 md:gap-x-12 gap-y-4">
                              <div className="flex items-center gap-2 text-secondary">
                                 <MapPin size={14} />
                                 <span className="text-[10px] uppercase tracking-widest font-bold">{opp.location}</span>
                              </div>
                              <div className="flex items-center gap-2 text-secondary">
                                 <DollarSign size={14} />
                                 <span className="text-[10px] uppercase tracking-widest font-bold">{opp.stipend}</span>
                              </div>
                              <div className="flex items-center gap-2 text-secondary">
                                 <Clock size={14} />
                                 <span className="text-[10px] uppercase tracking-widest font-bold">{opp.duration}</span>
                              </div>
                           </div>

                            <div className="flex flex-wrap gap-2">
                               {(opp.skills || []).map((skill, si) => (
                                  <span key={si} className="text-[8px] uppercase tracking-widest font-bold border border-border px-3 py-1 bg-background">
                                     {skill}
                                  </span>
                               ))}
                            </div>

                           <hr className="border-border" />

                           <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                              <p className="text-[10px] uppercase tracking-widest text-secondary font-mono italic">Posted {opp.postedDate}</p>
                              <div className="flex gap-3 flex-wrap">
                                {/* Quick Apply */}
                                <button
                                  onClick={() => handleQuickApply(opp)}
                                  disabled={applying === opp.id}
                                  id={`apply-${opp.id}`}
                                  className="btn-outline py-3 px-6 text-[10px] flex items-center gap-2 disabled:opacity-60"
                                >
                                  {applying === opp.id ? (
                                    <Loader2 size={14} className="animate-spin" />
                                  ) : null}
                                  {applying === opp.id ? 'Applying…' : 'Quick Apply'}
                                </button>
                                {/* View Details */}
                                <Link
                                  to={`/opportunities/${opp.id}`}
                                  className="btn-primary py-3 px-8 text-[10px] flex items-center gap-2 w-fit"
                                  id={`view-opp-${opp.id}`}
                                >
                                  View Opportunity <ArrowRight size={14} />
                                </Link>
                              </div>
                           </div>
                        </div>
                      </motion.div>
                    ))
                  }
                </AnimatePresence>
             </div>

          </div>
        </div>

        {/* Filter Sidebar */}
        <aside className="w-80 border-l border-border bg-white p-8 hidden lg:block overflow-y-auto shrink-0">
           <div className="space-y-12">
              <section className="space-y-6">
                 <h4 className="text-[10px] uppercase tracking-widest font-bold border-b border-border pb-2">Location Preference</h4>
                 <div className="space-y-3">
                    {['Remote', 'United States', 'Europe', 'Asia Pacific'].map(loc => (
                       <label key={loc} className="flex items-center gap-3 cursor-pointer group">
                          <div className="w-4 h-4 border border-border group-hover:border-accent transition-colors flex items-center justify-center">
                             <div className="w-2 h-2 bg-accent opacity-0 group-hover:opacity-20 transition-opacity" />
                          </div>
                          <span className="text-xs uppercase tracking-widest text-secondary group-hover:text-primary transition-colors">{loc}</span>
                       </label>
                    ))}
                 </div>
              </section>

              <section className="space-y-6">
                 <h4 className="text-[10px] uppercase tracking-widest font-bold border-b border-border pb-2">Domain Focus</h4>
                 <div className="flex flex-wrap gap-2">
                    {['FinTech', 'AI', 'HealthTech', 'E-commerce', 'SaaS'].map(dom => (
                       <span key={dom} className="text-[8px] uppercase tracking-widest font-bold border border-border px-3 py-1 hover:border-accent cursor-pointer transition-colors">
                          {dom}
                       </span>
                    ))}
                 </div>
              </section>

              <section className="space-y-6">
                 <h4 className="text-[10px] uppercase tracking-widest font-bold border-b border-border pb-2">Match Precision</h4>
                 <div className="space-y-6">
                    <div className="h-[2px] bg-border relative">
                       <div className="absolute inset-y-0 left-0 w-3/4 bg-accent" />
                       <div className="absolute top-1/2 left-3/4 -translate-y-1/2 w-4 h-4 bg-primary rotate-45 border-2 border-white" />
                    </div>
                    <div className="flex justify-between text-[10px] uppercase tracking-widest text-secondary font-bold">
                       <span>Any</span>
                       <span className="text-accent">High (&gt;75%)</span>
                    </div>
                 </div>
              </section>

              <div className="p-6 bg-background border border-border space-y-4">
                 <p className="text-[10px] uppercase tracking-widest font-bold text-primary">Intelligence Note</p>
                 <p className="text-[10px] leading-relaxed text-secondary italic">
                    The AI Match score is calculated using cosine similarity between your validated skill profile and the opportunity's requirement vector.
                 </p>
              </div>
           </div>
        </aside>

      </div>
    </AppLayout>
  );
};

export default Opportunities;
