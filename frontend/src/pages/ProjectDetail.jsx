import { useParams, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Calendar, MapPin, CheckCircle, MessageSquare, Info } from 'lucide-react';
import { projects } from '../data/projects';

const ProjectDetail = () => {
  const { id } = useParams();
  const project = projects.find(p => p.id === id);

  if (!project) return <div>Project not found</div>;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-20 border-b border-border bg-white px-8 flex justify-between items-center z-30">
          <Link to="/projects" className="flex items-center gap-2 text-secondary hover:text-primary transition-colors text-[10px] uppercase tracking-widest font-bold">
             <ArrowLeft size={16} /> Back to Board
          </Link>
          
          <div className="flex items-center gap-6">
            <span className="text-[10px] uppercase tracking-widest text-secondary font-bold">Node Status: <span className="text-accent">{project.status}</span></span>
            <button className="btn-primary py-2 px-8 text-[10px]">Apply to Collaborate</button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto py-16 px-8 space-y-16">
            
            {/* Header Area */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
               <div className="md:col-span-8 space-y-6">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-accent px-3 py-1 border border-accent/20 bg-accent/5">{project.type}</span>
                  <h1 className="text-7xl font-serif leading-tight tracking-tighter">{project.title}</h1>
                  <p className="text-xl text-secondary font-serif italic max-w-2xl">{project.domain}</p>
               </div>
               <div className="md:col-span-4 border border-border p-8 bg-white space-y-6">
                  <div className="flex justify-between items-center border-b border-border pb-4">
                     <span className="text-[10px] uppercase tracking-widest text-secondary font-bold">Posted By</span>
                     <span className="text-sm font-serif italic">{project.postedBy}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-border pb-4">
                     <span className="text-[10px] uppercase tracking-widest text-secondary font-bold">Date</span>
                     <span className="text-sm font-serif italic">{project.postedDate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-[10px] uppercase tracking-widest text-secondary font-bold">Duration</span>
                     <span className="text-sm font-serif italic">{project.duration}</span>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
               {/* Left Column: Description */}
               <div className="md:col-span-8 space-y-12">
                  <section className="space-y-6">
                     <h2 className="text-xs uppercase tracking-widest font-bold border-b border-border pb-2">Project Brief</h2>
                     <div className="text-secondary leading-relaxed font-serif text-lg space-y-6 italic">
                        <p>{project.description}</p>
                        <p>This project focuses on identifying the underlying architectural patterns that allow for seamless scalability while maintaining strict consistency across geo-distributed nodes.</p>
                        <p>Collaborators will be expected to participate in bi-weekly syncs and contribute to the technical documentation as much as the codebase.</p>
                     </div>
                  </section>

                  <section className="space-y-8">
                     <h2 className="text-xs uppercase tracking-widest font-bold border-b border-border pb-2">Technical Requirements</h2>
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-0 border border-border">
                        {project.skills.map((skill, i) => (
                           <div key={i} className="p-8 border-r border-b border-border bg-white text-center last:border-r-0">
                              <p className="text-xs uppercase tracking-widest font-bold">{skill}</p>
                              <p className="text-[10px] text-secondary mt-2">Required Level: Adv.</p>
                           </div>
                        ))}
                     </div>
                  </section>
               </div>

               {/* Right Column: Team & Sidebar */}
               <div className="md:col-span-4 space-y-12">
                  <section className="space-y-6">
                     <h2 className="text-xs uppercase tracking-widest font-bold border-b border-border pb-2">Team Allocation</h2>
                     <div className="space-y-px bg-border border border-border">
                        {[1, 2].map(i => (
                           <div key={i} className="bg-white p-4 flex items-center gap-4">
                              <div className="w-8 h-8 bg-primary text-white flex items-center justify-center text-[10px] font-bold">M{i}</div>
                              <div>
                                 <p className="text-xs font-serif font-bold">Collaborator {i}</p>
                                 <p className="text-[8px] uppercase tracking-widest text-secondary">Frontend Specialist</p>
                              </div>
                           </div>
                        ))}
                        {Array.from({length: project.teamSize - project.currentMembers}).map((_, i) => (
                           <div key={i} className="bg-background p-4 flex items-center gap-4 border border-dashed border-border">
                              <div className="w-8 h-8 border border-dashed border-border flex items-center justify-center text-border"><Users size={14} /></div>
                              <p className="text-[8px] uppercase tracking-widest text-secondary/40 font-bold italic">Open Position</p>
                           </div>
                        ))}
                     </div>
                  </section>

                  <div className="p-8 bg-primary text-white space-y-6">
                     <div className="flex items-center gap-3">
                        <Info size={20} className="text-accent" />
                        <h4 className="text-xs uppercase tracking-widest font-bold">Collaboration Note</h4>
                     </div>
                     <p className="text-xs leading-relaxed text-white/60 font-serif italic">
                        This is an active collaboration node. Participants are expected to adhere to the Global Talent Code of Conduct.
                     </p>
                     <button className="w-full btn-primary py-3 text-[10px] bg-accent border-accent hover:bg-accent/80">Message Lead</button>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetail;
