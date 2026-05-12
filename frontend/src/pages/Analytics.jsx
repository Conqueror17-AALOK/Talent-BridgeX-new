import AppLayout from '../components/AppLayout';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LineChart as LineIcon, Loader2 } from 'lucide-react';
import { skillGrowth, weeklyActivity, applications as staticApplications, milestones } from '../data/analytics';
import { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get('/analytics');
        setStats(response.data);
      } catch (err) {
        console.warn('Analytics API unavailable:', err.message);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };
    fetchStats();
  }, []);

  const topBar = (
    <>
      <div className="flex items-center gap-3 text-secondary">
        <LineIcon size={18} />
        <h2 className="text-xs uppercase tracking-widest font-bold">Progress Analytics</h2>
      </div>
      
      <div className="flex items-center gap-4 md:gap-8 shrink-0">
        <div className="flex items-center gap-2 md:gap-3">
          <span className="text-[10px] uppercase tracking-widest text-secondary font-bold hidden sm:block">Period:</span>
          <select className="bg-transparent text-[10px] uppercase tracking-widest font-bold border-none outline-none text-accent">
            <option>Last 6 Months</option>
            <option>Year to Date</option>
          </select>
        </div>
        <button className="btn-outline py-2 px-4 md:px-6 text-[10px]">Export PDF</button>
      </div>
    </>
  );

  return (
    <AppLayout topBar={topBar}>
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-secondary animate-pulse">Syncing Intelligence Data...</p>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 p-4 md:p-8 lg:p-12"
        >
          <div className="max-w-7xl mx-auto space-y-12 md:space-y-20">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8 border-b border-border pb-8">
              <div className="max-w-2xl">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl md:text-7xl font-serif mb-4 leading-none tracking-tight"
                >
                  Intelligence <span className="italic text-accent">Metrics.</span>
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-secondary font-serif italic text-base md:text-lg leading-relaxed"
                >
                  A comprehensive breakdown of your skill evolution, market compatibility, and academic trajectory.
                </motion.p>
              </div>
              <div className="grid grid-cols-2 gap-3 md:gap-4 w-full md:w-auto">
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="p-4 md:p-6 border border-border bg-white shadow-sm"
                >
                  <p className="text-[10px] uppercase tracking-widest text-secondary mb-1">Enrolled Modules</p>
                  <p className="text-2xl md:text-3xl font-serif">{stats?.completedModulesCount || 0}</p>
                </motion.div>
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="p-4 md:p-6 border border-border bg-white shadow-sm"
                >
                  <p className="text-[10px] uppercase tracking-widest text-secondary mb-1">Applications</p>
                  <p className="text-2xl md:text-3xl font-serif">{stats?.applicationsCount || 0}</p>
                </motion.div>
              </div>
            </div>

            {/* Skill Profile Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="p-8 border border-border bg-[#FDFCFB] relative overflow-hidden group">
                  <div className="relative z-10">
                    <p className="text-[10px] uppercase tracking-widest text-secondary mb-4">Technical Proficiency</p>
                    <div className="flex items-end gap-2">
                      <span className="text-5xl font-serif">{stats?.skillProfile?.scores?.technical || 0}</span>
                      <span className="text-xs uppercase tracking-widest text-secondary mb-2 font-bold">/ 100</span>
                    </div>
                    <div className="mt-6 w-full h-1 bg-border overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${stats?.skillProfile?.scores?.technical || 0}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-primary"
                      />
                    </div>
                  </div>
                  <div className="absolute -right-4 -bottom-4 text-primary/5 select-none pointer-events-none group-hover:scale-110 transition-transform duration-500">
                    <LineIcon size={120} />
                  </div>
               </div>
               
               <div className="p-8 border border-border bg-[#FDFCFB] relative overflow-hidden group">
                  <div className="relative z-10">
                    <p className="text-[10px] uppercase tracking-widest text-secondary mb-4">Soft Skills Index</p>
                    <div className="flex items-end gap-2">
                      <span className="text-5xl font-serif">{stats?.skillProfile?.scores?.soft || 0}</span>
                      <span className="text-xs uppercase tracking-widest text-secondary mb-2 font-bold">/ 100</span>
                    </div>
                    <div className="mt-6 w-full h-1 bg-border overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${stats?.skillProfile?.scores?.soft || 0}%` }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                        className="h-full bg-accent"
                      />
                    </div>
                  </div>
                  <div className="absolute -right-4 -bottom-4 text-accent/5 select-none pointer-events-none group-hover:scale-110 transition-transform duration-500">
                    <LineIcon size={120} />
                  </div>
               </div>

               <div className="p-8 border border-border bg-[#1A1A2E] text-white flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/60 mb-2">System Insight</p>
                    <p className="text-sm font-serif italic">"Your technical growth is outpacing 85% of your peer group. Consider focusing on executive communication to bridge the gap."</p>
                  </div>
                  <button className="text-[10px] uppercase tracking-widest font-bold text-accent mt-4 flex items-center gap-2 hover:translate-x-1 transition-transform w-fit">
                    View Detailed Report →
                  </button>
               </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
              
              {/* Skill Evolution Chart */}
              <div className="md:col-span-8 border border-border p-6 md:p-8 bg-white">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 md:mb-12">
                  <h3 className="text-xs uppercase tracking-widest font-bold">Skill Evolution Trajectory</h3>
                  <div className="flex gap-4 md:gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary" />
                      <span className="text-[10px] uppercase tracking-widest text-secondary">Technical</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-accent" />
                      <span className="text-[10px] uppercase tracking-widest text-secondary">Soft Skills</span>
                    </div>
                  </div>
                </div>
                <div className="h-64 md:h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={skillGrowth}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0DDD8" />
                      <XAxis 
                        dataKey="month" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fill: '#6B6B6B', fontWeight: 'bold'}}
                        padding={{ left: 20, right: 20 }}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fill: '#6B6B6B', fontWeight: 'bold'}}
                        width={30}
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: 0, border: '1px solid #E0DDD8', fontSize: '10px', textTransform: 'uppercase' }}
                      />
                      <Line type="monotone" dataKey="technical" stroke="#1A1A2E" strokeWidth={2} dot={false} activeDot={{ r: 4, stroke: '#1A1A2E', strokeWidth: 2 }} />
                      <Line type="monotone" dataKey="soft" stroke="#C8973A" strokeWidth={2} dot={false} activeDot={{ r: 4, stroke: '#C8973A', strokeWidth: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Weekly Activity */}
              <div className="md:col-span-4 border border-border p-6 md:p-8 bg-white">
                <h3 className="text-xs uppercase tracking-widest font-bold mb-8 md:mb-12">Intensity Index (Weekly)</h3>
                <div className="h-64 md:h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyActivity}>
                      <XAxis 
                        dataKey="week" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fill: '#6B6B6B', fontWeight: 'bold'}}
                      />
                      <Bar dataKey="completed" fill="#1A1A2E" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* Application Tracker & Milestones */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
               
               {/* Application Table */}
               <div className="md:col-span-8 space-y-8">
                  <h3 className="text-xs uppercase tracking-widest font-bold border-b border-border pb-2">Active Application Pipeline</h3>
                  <div className="overflow-x-auto">
                    <table className="data-table min-w-[480px]">
                      <thead>
                        <tr>
                          <th>Opportunity Node</th>
                          <th>Applied Date</th>
                          <th>AI Match</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {staticApplications.map((app, i) => (
                          <tr key={i} className="hover:bg-background transition-colors">
                            <td className="font-serif italic text-base">{app.name}</td>
                            <td className="text-xs font-mono">{app.date}</td>
                            <td className="text-xs font-bold text-accent">{app.match}</td>
                            <td>
                              <span className={`text-[8px] uppercase tracking-widest px-2 py-0.5 font-bold border ${
                                app.status === 'Rejected' ? 'border-red-200 text-red-600 bg-red-50' :
                                app.status === 'Shortlisted' ? 'border-green-200 text-green-600 bg-green-50' :
                                'border-border text-secondary bg-background'
                              }`}>
                                {app.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               </div>

               {/* Milestones List */}
               <div className="md:col-span-4 space-y-8">
                  <h3 className="text-xs uppercase tracking-widest font-bold border-b border-border pb-2">Significant Milestones</h3>
                  <div className="space-y-10 relative">
                     <div className="absolute left-0 top-2 bottom-0 w-[0.5px] bg-border" />
                     {milestones.map((ms, i) => (
                       <div key={i} className="relative pl-8">
                          <div className="absolute left-[-3px] top-2 w-1.5 h-1.5 bg-primary" />
                          <p className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-1">{ms.date}</p>
                          <p className="text-sm font-serif italic leading-snug">{ms.title}</p>
                       </div>
                     ))}
                  </div>
               </div>

            </div>

            {/* Activity Heatmap */}
            <section className="space-y-8 pb-12">
               <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 border-b border-border pb-4">
                  <h3 className="text-xs uppercase tracking-widest font-bold">Activity Density Map</h3>
                  <p className="text-[10px] uppercase tracking-widest text-secondary">156 Consecutive Days Active</p>
               </div>
               <div className="overflow-x-auto pb-4">
                  <div className="flex gap-1 min-w-max">
                     {Array.from({length: 52}).map((_, col) => (
                       <div key={col} className="flex flex-col gap-1">
                          {Array.from({length: 7}).map((_, row) => {
                            const opacity = Math.random() > 0.3 ? (Math.random() * 0.8 + 0.2) : 0.05;
                            return (
                              <div 
                                key={row} 
                                className="w-3 h-3 bg-primary" 
                                style={{ opacity: opacity }}
                              />
                            );
                          })}
                       </div>
                     ))}
                  </div>
                  <div className="flex justify-between mt-4 text-[8px] uppercase tracking-[0.2em] text-secondary font-bold min-w-max">
                     <span>Jan</span>
                     <span>Mar</span>
                     <span>May</span>
                     <span>Jul</span>
                     <span>Sep</span>
                     <span>Nov</span>
                  </div>
               </div>
            </section>

          </div>
        </motion.div>
      )}
    </AppLayout>
  );
};

export default Analytics;
