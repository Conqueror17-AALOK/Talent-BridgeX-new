import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Filter, Search, Users, Globe, MapPin, ArrowUpRight, Loader2 } from 'lucide-react';
import { projectTypes, projects as staticProjects } from '../data/projects';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/apiClient';
import { useEffect } from 'react';

const Projects = () => {
  const [activeTab, setActiveTab] = useState(projectTypes[0]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joiningProject, setJoiningProject] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get('/projects');
        const data = response.data || [];
        setProjects(data.length > 0 ? data : staticProjects);
      } catch (err) {
        console.warn('Projects API unavailable, using fallback:', err.message);
        setProjects(staticProjects);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleNewProject = () => {
    if (!user) { toast.error('Please log in to create a project.'); return; }
    toast.info('Project creation wizard coming soon!');
  };

  const handleJoinProject = async (project) => {
    if (!user) { toast.error('Please log in to join a project.'); return; }
    setJoiningProject(project.id);
    try {
      await apiClient.post(`/projects/${project.id}/join`, { user_id: user.id });
      toast.success(`Joined "${project.title}"! Check your email for next steps.`);
    } catch (err) {
      if (err.response?.status === 404) {
        toast.info('Join request sent! The project lead will contact you.');
      } else {
        toast.error(err.response?.data?.error || 'Failed to join project.');
      }
    } finally {
      setJoiningProject(null);
    }
  };

  const topBar = (
    <>
      <div className="flex items-center gap-3 text-secondary">
        <Globe size={18} />
        <h2 className="text-xs uppercase tracking-widest font-bold">Project Collaboration</h2>
      </div>
      
      <div className="flex items-center gap-4 md:gap-8 shrink-0">
        <div className="text-right border-r border-border pr-4 md:pr-8 hidden sm:block">
          <p className="text-[10px] uppercase tracking-widest text-secondary font-bold">Applications</p>
          <p className="text-xs font-serif italic">02 Pending</p>
        </div>
        <button
          onClick={handleNewProject}
          id="projects-new"
          className="btn-primary py-2 px-4 md:px-6 text-[10px] flex items-center gap-2"
        >
          <Plus size={14} /> <span className="hidden sm:inline">New Project</span>
        </button>
      </div>
    </>
  );

  return (
    <AppLayout topBar={topBar}>
      <SEO title="Projects | Open Collaborations" description="Browse and join open projects." />
      
      {/* Filters & Tabs */}
      <div className="bg-white border-b border-border px-4 md:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex gap-6 md:gap-12 overflow-x-auto">
            {projectTypes.map(type => (
              <button 
                key={type}
                onClick={() => setActiveTab(type)}
                className={`text-[10px] uppercase tracking-widest font-bold pb-2 transition-all relative shrink-0 ${
                  activeTab === type ? 'text-primary' : 'text-secondary hover:text-primary'
                }`}
              >
                {type}
                {activeTab === type && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                )}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-secondary text-[10px] uppercase tracking-widest border border-border px-3 py-2 bg-background cursor-pointer hover:bg-border transition-colors">
              <Filter size={14} /> <span className="hidden sm:inline">Filter</span>
            </div>
            <div className="flex items-center gap-2 text-secondary text-[10px] uppercase tracking-widest border border-border px-3 py-2 bg-background">
              <Search size={14} /> <span className="hidden sm:inline">Search</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto space-y-10 md:space-y-12">
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 border-b border-border pb-4">
             <div>
                <h1 className="text-3xl md:text-5xl font-serif">Open Collaborations</h1>
                <p className="text-[10px] uppercase tracking-widest text-secondary mt-2">Active Nodes: {projects.filter(p => p.type === activeTab).length}</p>
             </div>
             <div className="flex gap-4 text-[10px] uppercase tracking-widest font-bold text-secondary">
                <span className="hidden sm:block">Sort by:</span>
                <button className="text-primary underline">Recent</button>
                <button className="hover:text-primary transition-colors">Match %</button>
             </div>
          </div>

          <div className="space-y-px bg-border border border-border">
            <AnimatePresence mode="wait">
              {projects
                .filter(p => {
                  const pType = (p.type || '').toLowerCase();
                  const tab = activeTab.toLowerCase();
                  return pType.includes(tab.split(' ')[0]) || tab.includes(pType);
                })
                .map((project, i) => (
                  <motion.div 
                    key={project.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white p-6 md:p-8 flex flex-col md:grid md:grid-cols-12 gap-6 md:gap-8 hover:bg-background transition-all group"
                  >
                    <div className="md:col-span-4 space-y-4">
                      <div className="flex gap-3 items-center">
                         <span className={`text-[8px] uppercase tracking-widest px-2 py-0.5 font-bold ${
                           project.status === 'Urgent' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-accent/5 text-accent border border-accent/20'
                         }`}>
                           {project.status}
                         </span>
                         <span className="text-[10px] uppercase tracking-widest text-secondary font-mono">ID: {project.id}</span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-serif leading-tight group-hover:text-accent transition-colors">{project.title}</h3>
                      <p className="text-xs text-secondary leading-relaxed line-clamp-2">{project.description}</p>
                    </div>

                    <div className="md:col-span-3 md:border-l md:border-border md:pl-8 flex flex-row md:flex-col justify-start md:justify-center gap-4 flex-wrap">
                       <div className="flex items-center gap-3 text-secondary">
                          <MapPin size={14} />
                          <span className="text-[10px] uppercase tracking-widest font-bold">{project.location}</span>
                       </div>
                       <div className="flex items-center gap-3 text-secondary">
                          <Users size={14} />
                          <span className="text-[10px] uppercase tracking-widest font-bold">{project.current_members || project.currentMembers || 1} / {project.team_size || project.teamSize || 4} Members</span>
                       </div>
                       <div className="flex items-center gap-3 text-secondary">
                          <Plus size={14} />
                          <span className="text-[10px] uppercase tracking-widest font-bold">{project.duration}</span>
                       </div>
                    </div>

                    <div className="md:col-span-3 md:border-l md:border-border md:pl-8 flex flex-wrap content-center gap-2">
                       {(project.skills || []).map((skill, si) => (
                         <span key={si} className="text-[8px] uppercase tracking-widest font-bold border border-border px-3 py-1 bg-background">
                            {skill}
                         </span>
                       ))}
                    </div>

                    <div className="md:col-span-2 flex flex-row md:flex-col items-center md:justify-center gap-3">
                       <button
                         onClick={() => handleJoinProject(project)}
                         disabled={joiningProject === project.id}
                         id={`join-project-${project.id}`}
                         className="btn-primary py-2 px-4 text-[10px] flex items-center gap-2 disabled:opacity-60"
                       >
                         {joiningProject === project.id ? <Loader2 size={12} className="animate-spin" /> : null}
                         {joiningProject === project.id ? 'Joining…' : 'Apply'}
                       </button>
                       <Link to={`/projects/${project.id}`} className="btn-outline py-2 px-4 text-[10px] flex items-center gap-2" id={`view-project-${project.id}`}>
                          View <ArrowUpRight size={14} />
                       </Link>
                    </div>
                  </motion.div>
                ))
              }
            </AnimatePresence>
          </div>

        </div>
      </div>
    </AppLayout>
  );
};

export default Projects;
