import { useParams, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, FileText, CheckCircle, Clock, BarChart, ExternalLink } from 'lucide-react';
import { modules } from '../data/learning';

const ModuleDetail = () => {
  const { id } = useParams();
  const module = modules.find(m => m.id === id);

  if (!module) return <div>Module not found</div>;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-20 border-b border-border bg-white px-8 flex justify-between items-center z-30">
          <Link to="/learn" className="flex items-center gap-2 text-secondary hover:text-primary transition-colors text-[10px] uppercase tracking-widest font-bold">
             <ArrowLeft size={16} /> Back to Academy
          </Link>
          
          <div className="flex items-center gap-6">
            <span className="text-[10px] uppercase tracking-widest text-secondary font-bold">Status: <span className="text-accent">In Progress</span></span>
            <button className="btn-primary py-2 px-6 text-[10px]">Mark as Complete</button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto py-16 px-8 space-y-16">
            
            {/* Header */}
            <div className="space-y-6">
              <div className="flex gap-4">
                <span className="text-[10px] uppercase tracking-widest font-bold text-accent px-3 py-1 border border-accent/20 bg-accent/5">{module.category}</span>
                <span className="text-[10px] uppercase tracking-widest font-bold text-secondary px-3 py-1 border border-border bg-background">{module.level}</span>
              </div>
              <h1 className="text-7xl font-serif leading-tight tracking-tighter">{module.title}</h1>
              <div className="flex items-center gap-8 py-8 border-y border-border">
                <div className="flex items-center gap-2">
                   <Clock size={16} className="text-secondary" />
                   <span className="text-xs uppercase tracking-widest font-bold">{module.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                   <FileText size={16} className="text-secondary" />
                   <span className="text-xs uppercase tracking-widest font-bold">{module.prerequisites.length} Prerequisites</span>
                </div>
                <div className="flex items-center gap-2">
                   <CheckCircle size={16} className="text-secondary" />
                   <span className="text-xs uppercase tracking-widest font-bold">Quiz Included</span>
                </div>
              </div>
            </div>

            {/* Video Section */}
            <div className="aspect-video bg-primary border border-border relative group overflow-hidden">
               {/* Video Embed Placeholder */}
               <div className="absolute inset-0 flex items-center justify-center">
                  <Play size={64} className="text-white opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all cursor-pointer" />
               </div>
               <div className="absolute bottom-8 left-8">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-mono">ENCRYPTED_STREAM_NODE_A12</p>
               </div>
            </div>

            {/* Main Article Content */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
              <div className="md:col-span-8 space-y-12">
                <article className="prose prose-slate max-w-none">
                   <div className="space-y-8 text-secondary leading-relaxed font-serif text-lg italic">
                     {module.content.split('\n\n').map((paragraph, i) => (
                       <p key={i}>{paragraph}</p>
                     ))}
                   </div>
                </article>

                <div className="p-12 bg-white border border-border space-y-8">
                   <h3 className="text-2xl font-serif italic border-b border-border pb-4">Knowledge Check</h3>
                   <p className="text-sm text-secondary">Complete this brief assessment to unlock your certification and move to the next module.</p>
                   <button className="btn-primary w-full py-4 uppercase tracking-[0.2em] text-xs">Start Quiz</button>
                </div>
              </div>

              {/* Sidebar */}
              <div className="md:col-span-4 space-y-12">
                <section className="space-y-6">
                  <h4 className="text-[10px] uppercase tracking-widest font-bold border-b border-border pb-2">Prerequisites</h4>
                  <ul className="space-y-3">
                    {module.prerequisites.map((pre, i) => (
                      <li key={i} className="flex items-center gap-3 text-xs uppercase tracking-widest text-secondary">
                        <div className="w-1 h-1 bg-accent" /> {pre}
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="space-y-6">
                  <h4 className="text-[10px] uppercase tracking-widest font-bold border-b border-border pb-2">Resources</h4>
                  <ul className="space-y-4">
                    <li className="flex justify-between items-center group cursor-pointer">
                       <span className="text-xs uppercase tracking-widest text-secondary group-hover:text-primary transition-colors">Architecture Whitepaper</span>
                       <ExternalLink size={14} className="text-border group-hover:text-accent" />
                    </li>
                    <li className="flex justify-between items-center group cursor-pointer">
                       <span className="text-xs uppercase tracking-widest text-secondary group-hover:text-primary transition-colors">Case Study: Netflix Scale</span>
                       <ExternalLink size={14} className="text-border group-hover:text-accent" />
                    </li>
                  </ul>
                </section>
              </div>
            </div>

            {/* Related Projects */}
            <section className="pt-16 border-t border-border space-y-8">
               <div className="flex justify-between items-end">
                  <h3 className="text-4xl font-serif">Apply your knowledge.</h3>
                  <p className="text-[10px] uppercase tracking-widest text-secondary font-bold">Related Projects</p>
               </div>
               <div className="space-y-px bg-border border border-border">
                  {[
                    { name: 'Build a Distributed Cache', type: 'Community', matches: '98%' },
                    { name: 'Microservices Mesh Design', type: 'University', matches: '92%' }
                  ].map((project, i) => (
                    <div key={i} className="bg-white p-6 flex justify-between items-center hover:bg-background transition-colors group cursor-pointer">
                      <div className="flex items-center gap-6">
                        <span className="text-xs font-serif italic text-accent">P0{i+1}</span>
                        <div>
                          <h4 className="text-sm font-bold uppercase tracking-wide group-hover:text-accent transition-colors">{project.name}</h4>
                          <p className="text-[10px] uppercase tracking-widest text-secondary mt-1">{project.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                         <span className="text-[10px] uppercase tracking-widest font-bold text-accent">Skill Match: {project.matches}</span>
                         <button className="btn-outline py-2 px-4 text-[8px]">View Project</button>
                      </div>
                    </div>
                  ))}
               </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
};

export default ModuleDetail;
