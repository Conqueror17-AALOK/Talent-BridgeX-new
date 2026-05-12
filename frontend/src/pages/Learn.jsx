import AppLayout from '../components/AppLayout';
import { Search, Filter, BookOpen, Clock, BarChart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { categories as staticCategories, modules as staticModules } from '../data/learning';
import { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { Loader2 } from 'lucide-react';

const Learn = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(staticCategories);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await apiClient.get('/learning/modules');
        const data = response.data || [];
        setModules(data.length > 0 ? data : staticModules);
      } catch (err) {
        console.warn('Learning API unavailable, using fallback:', err.message);
        setModules(staticModules);
      } finally {
        setLoading(false);
      }
    };
    fetchModules();
  }, []);

  const topBar = (
    <>
      <div className="flex items-center gap-3 text-secondary">
        <BookOpen size={18} />
        <h2 className="text-xs uppercase tracking-widest font-bold">Learning Academy</h2>
      </div>
      
      <div className="flex items-center gap-4 md:gap-6 shrink-0">
        <div className="flex items-center gap-2 border-r border-border pr-4 md:pr-6">
          <span className="text-[10px] uppercase tracking-widest text-secondary font-bold hidden sm:block">Credits</span>
          <span className="text-sm font-serif italic text-accent">12.5k</span>
        </div>
        <div className="flex items-center gap-3">
          <Search size={18} className="text-secondary" />
          <Filter size={18} className="text-secondary hidden sm:block" />
        </div>
      </div>
    </>
  );

  return (
    <AppLayout topBar={topBar}>
      <SEO title="Learning Academy" description="Curated intelligence modules designed to bridge the gap between academic theory and global market practice." />
      <div className="p-4 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto space-y-12 md:space-y-16">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8 border-b border-border pb-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-serif mb-4 leading-none">Expand your frontier.</h1>
              <p className="text-secondary font-serif italic text-base md:text-lg leading-relaxed">
                Curated intelligence modules designed to bridge the gap between academic theory and global market practice.
              </p>
            </div>
            <div className="flex gap-3 md:gap-4">
              <div className="border border-border p-4 bg-white">
                <p className="text-[10px] uppercase tracking-widest text-secondary mb-1">Enrolled</p>
                <p className="text-2xl font-serif">12</p>
              </div>
              <div className="border border-border p-4 bg-white">
                <p className="text-[10px] uppercase tracking-widest text-secondary mb-1">Completed</p>
                <p className="text-2xl font-serif">08</p>
              </div>
            </div>
          </div>

          {/* Categorized Modules */}
          {categories.map((category, idx) => (
            <section key={idx} className="space-y-6 md:space-y-8">
              <div className="flex items-center gap-6 md:gap-8">
                <h3 className="text-xs uppercase tracking-widest font-bold whitespace-nowrap">{category}</h3>
                <div className="h-[0.5px] bg-border w-full" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
                {modules
                  .filter(m => m.category === category)
                  .map((module, mIdx) => (
                    <Link 
                      to={`/learn/${module.id}`} 
                      key={mIdx}
                      className="p-6 md:p-8 bg-white hover:bg-background transition-all group relative overflow-hidden"
                    >
                      <div className="space-y-4 md:space-y-6">
                        <div className="flex justify-between items-start">
                           <span className="text-[10px] uppercase tracking-widest font-bold text-accent">Module {mIdx + 1}</span>
                           <div className="flex gap-3 md:gap-4">
                             <div className="flex items-center gap-1 text-secondary">
                               <Clock size={12} />
                               <span className="text-[10px] font-mono">{module.duration}</span>
                             </div>
                             <div className="flex items-center gap-1 text-secondary">
                               <BarChart size={12} />
                               <span className="text-[10px] font-mono">{module.level}</span>
                             </div>
                           </div>
                        </div>
                        
                        <h4 className="text-xl md:text-2xl font-serif leading-tight group-hover:text-accent transition-colors">{module.title}</h4>
                        <p className="text-xs text-secondary leading-relaxed line-clamp-3">
                          {module.description}
                        </p>
                        
                        <div className="pt-4 md:pt-6 border-t border-border flex justify-between items-center">
                           <div className="flex -space-x-2">
                             {[1,2,3].map(i => (
                               <div key={i} className="w-6 h-6 border border-white bg-primary text-[8px] flex items-center justify-center text-white">
                                 U{i}
                               </div>
                             ))}
                             <span className="pl-4 text-[10px] uppercase tracking-widest text-secondary pt-1.5 hidden sm:inline">+124 Peers</span>
                           </div>
                           <ArrowRight size={16} className="text-border group-hover:text-accent group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </section>
          ))}

        </div>
      </div>
    </AppLayout>
  );
};

export default Learn;
