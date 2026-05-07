import { useParams, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import { ArrowLeft, Globe, MapPin, Calendar, Clock, DollarSign, CheckCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { opportunities } from '../data/opportunities';

const OpportunityDetail = () => {
  const { id } = useParams();
  const opp = opportunities.find(o => o.id === id);

  if (!opp) return <div>Opportunity not found</div>;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-20 border-b border-border bg-white px-8 flex justify-between items-center z-30">
          <Link to="/opportunities" className="flex items-center gap-2 text-secondary hover:text-primary transition-colors text-[10px] uppercase tracking-widest font-bold">
             <ArrowLeft size={16} /> Back to Matches
          </Link>
          
          <div className="flex items-center gap-8">
            <div className="text-right border-r border-border pr-8">
              <p className="text-[10px] uppercase tracking-widest text-secondary font-bold">Match Confidence</p>
              <p className="text-xs font-serif italic text-accent">{opp.matchScore}% Precise</p>
            </div>
            <button className="btn-primary py-2 px-10 text-[10px]">Submit Application</button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto py-16 px-8 space-y-24">
            
            {/* Hero Header */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
               <div className="md:col-span-9 space-y-8">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-primary text-white flex items-center justify-center font-serif text-2xl font-bold">
                        {opp.company[0]}
                     </div>
                     <div>
                        <p className="text-xs font-serif italic text-accent">{opp.company}</p>
                        <p className="text-[10px] uppercase tracking-widest text-secondary font-bold">Verified Institution</p>
                     </div>
                  </div>
                  <h1 className="text-8xl font-serif leading-tight tracking-tighter">{opp.title}</h1>
               </div>
               
               <div className="md:col-span-3 pt-4">
                  <div className="p-8 border border-border bg-white space-y-6 text-center">
                     <div className="w-20 h-20 border-4 border-accent border-t-transparent rounded-full mx-auto flex items-center justify-center">
                        <span className="text-2xl font-serif font-bold">{opp.matchScore}%</span>
                     </div>
                     <p className="text-[10px] uppercase tracking-widest text-secondary font-bold">Compatibility Vector</p>
                     <hr className="border-border" />
                     <p className="text-[10px] leading-relaxed text-secondary italic">Your skill profile aligns exceptionally well with this role's requirements.</p>
                  </div>
               </div>
            </div>

            {/* Quick Metadata Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-border">
               {[
                 { label: 'Location', value: opp.location, icon: <MapPin size={16} /> },
                 { label: 'Stipend', value: opp.stipend, icon: <DollarSign size={16} /> },
                 { label: 'Duration', value: opp.duration, icon: <Clock size={16} /> },
                 { label: 'Posted', value: opp.postedDate, icon: <Calendar size={16} /> },
               ].map((item, i) => (
                 <div key={i} className="p-8 border-r border-border last:border-r-0 bg-white flex flex-col items-center justify-center text-center">
                    <div className="text-secondary mb-3">{item.icon}</div>
                    <p className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-1">{item.label}</p>
                    <p className="text-sm font-serif italic">{item.value}</p>
                 </div>
               ))}
            </div>

            {/* Main Content Sections */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-24">
               
               <div className="md:col-span-8 space-y-16">
                  <section className="space-y-8">
                     <h2 className="text-xs uppercase tracking-widest font-bold border-b border-border pb-2">Full Opportunity Brief</h2>
                     <div className="prose prose-slate max-w-none">
                        <div className="text-secondary leading-relaxed font-serif text-xl italic space-y-8">
                           <p>{opp.description}</p>
                           <p>
                             As a {opp.title} at {opp.company}, you will be part of a high-performance environment where technical excellence and innovative thinking are the primary drivers. 
                             This role requires a deep understanding of {opp.skills.slice(0, 2).join(' and ')}, as well as the ability to operate effectively in a geo-distributed team structure.
                           </p>
                           <p>
                             Our recruitment process through Talent-BridgeX is accelerated for candidates with match scores exceeding 85%, ensuring you bypass traditional screening layers and connect directly with engineering leadership.
                           </p>
                        </div>
                     </div>
                  </section>

                  <section className="space-y-8">
                     <h2 className="text-xs uppercase tracking-widest font-bold border-b border-border pb-2">Technical Skill Alignment</h2>
                     <div className="space-y-px bg-border border border-border">
                        {opp.skills.map((skill, i) => (
                           <div key={i} className="bg-white p-6 flex justify-between items-center group">
                              <div className="flex items-center gap-4">
                                 <div className="w-1 h-1 bg-accent" />
                                 <span className="text-xs uppercase tracking-widest font-bold">{skill}</span>
                              </div>
                              <div className="flex items-center gap-4">
                                 <span className="text-[10px] uppercase tracking-widest text-green-600 font-bold">Validated Skill</span>
                                 <CheckCircle size={14} className="text-green-600" />
                              </div>
                           </div>
                        ))}
                     </div>
                  </section>
               </div>

               <aside className="md:col-span-4 space-y-12">
                  <section className="space-y-6">
                     <h2 className="text-xs uppercase tracking-widest font-bold border-b border-border pb-2">Institution Profile</h2>
                     <div className="bg-white border border-border p-8 space-y-6">
                        <h4 className="text-2xl font-serif">{opp.company}</h4>
                        <p className="text-xs text-secondary leading-relaxed font-serif italic">
                           A global leader in {opp.domain}, {opp.company} is dedicated to building infrastructure that powers the future of digital economy.
                        </p>
                        <div className="space-y-3 pt-4 border-t border-border">
                           <a href="#" className="flex items-center justify-between group">
                              <span className="text-[10px] uppercase tracking-widest text-secondary group-hover:text-primary transition-colors">Corporate Website</span>
                              <ExternalLink size={14} className="text-border group-hover:text-accent" />
                           </a>
                           <a href="#" className="flex items-center justify-between group">
                              <span className="text-[10px] uppercase tracking-widest text-secondary group-hover:text-primary transition-colors">LinkedIn Profile</span>
                              <ExternalLink size={14} className="text-border group-hover:text-accent" />
                           </a>
                        </div>
                     </div>
                  </section>

                  <section className="p-8 bg-primary text-white space-y-6">
                     <div className="flex items-center gap-3">
                        <ShieldCheck size={20} className="text-accent" />
                        <h4 className="text-xs uppercase tracking-widest font-bold">Accelerated Path</h4>
                     </div>
                     <p className="text-xs leading-relaxed text-white/60 font-serif italic">
                        Because your match score is above 85%, your application will be fast-tracked to the final interview stage.
                     </p>
                     <button className="w-full btn-primary py-3 text-[10px] bg-accent border-accent hover:bg-accent/80">Submit & Track</button>
                  </section>
               </aside>

            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default OpportunityDetail;
