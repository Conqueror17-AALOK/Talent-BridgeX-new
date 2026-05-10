import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const LandingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background text-primary">
      <SEO />
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="py-24 px-8 border-b border-border overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="md:col-span-8"
            >
              <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-serif leading-none mb-6 md:mb-8 tracking-tighter">
                Your skills.<br />Your path.<br /><span className="italic text-accent">Your future.</span>
              </h1>
              <p className="text-base md:text-xl text-secondary max-w-xl mb-8 md:mb-12 font-serif italic">
                A professional intelligence platform guiding the next generation of global talent from education to excellence.
              </p>
              <div className="flex flex-wrap gap-6">
                <Link to="/register" className="btn-primary flex items-center gap-2 py-4 px-10 text-base">
                  Get Started <ArrowRight size={18} />
                </Link>
                <button className="btn-outline py-4 px-10 text-base">
                  See How It Works
                </button>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="md:col-span-4 relative"
            >
              <div className="aspect-[3/4] border border-border bg-primary/5 p-4">
                <div className="w-full h-full border border-border flex items-center justify-center bg-white/50 backdrop-blur-sm">
                   <div className="text-[10px] font-mono text-secondary/40 p-8 overflow-hidden leading-relaxed">
                     {/* Decorative code/data snippet */}
                     {Array.from({length: 20}).map((_, i) => (
                       <div key={i} className="mb-1">
                         0x{Math.random().toString(16).slice(2, 10).toUpperCase()} &gt;&gt; SKILL_VECTOR_LOADED [{(Math.random() * 100).toFixed(2)}%]
                       </div>
                     ))}
                   </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 border border-border bg-background p-4 md:p-6 w-36 md:w-48 shadow-sm">
                <p className="text-xs uppercase tracking-tighter text-secondary mb-1">Global Reach</p>
                <p className="text-2xl font-serif">18 Countries</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Strip */}
        <section className="border-b border-border py-12 px-8 bg-primary text-white">
          <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 md:gap-12">
            <div>
              <p className="text-sm uppercase tracking-widest text-white/50 mb-2">Placements</p>
              <p className="text-4xl font-serif">4,200+</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-widest text-white/50 mb-2">Employers</p>
              <p className="text-4xl font-serif">320 Global</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-widest text-white/50 mb-2">Active Students</p>
              <p className="text-4xl font-serif">15k+</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-widest text-white/50 mb-2">Career Paths</p>
              <p className="text-4xl font-serif">85% Success</p>
            </div>
          </div>
        </section>

        {/* Learn -> Assess -> Opportunity */}
        <section className="py-24 px-8 border-b border-border">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 border-l border-t border-border"
          >
            <motion.div variants={itemVariants} className="p-8 md:p-12 border-b border-r border-border hover:bg-accent/5 transition-colors group">
              <span className="text-xs font-serif italic text-accent mb-4 block">Step 01</span>
              <h3 className="text-4xl font-serif mb-6 group-hover:translate-x-2 transition-transform">Learn</h3>
              <p className="text-secondary mb-8 leading-relaxed">
                Master industry-relevant skills through curated modules designed by world-class educators and industry leaders.
              </p>
              <ul className="space-y-4 text-xs uppercase tracking-widest text-secondary">
                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-accent"></div> Technical Deep-dives</li>
                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-accent"></div> Soft Skill Mastery</li>
                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-accent"></div> Portfolio Building</li>
              </ul>
            </motion.div>

            <motion.div variants={itemVariants} className="p-8 md:p-12 border-b border-r border-border hover:bg-accent/5 transition-colors group">
              <span className="text-xs font-serif italic text-accent mb-4 block">Step 02</span>
              <h3 className="text-4xl font-serif mb-6 group-hover:translate-x-2 transition-transform">Assess</h3>
              <p className="text-secondary mb-8 leading-relaxed">
                Validate your expertise with our AI-driven skill assessment platform. Receive a detailed roadmap tailored to your goals.
              </p>
              <hr className="mb-8" />
              <ul className="space-y-4 text-xs uppercase tracking-widest text-secondary">
                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-accent"></div> Real-time Feedback</li>
                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-accent"></div> Gap Analysis</li>
                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-accent"></div> Certified Scoring</li>
              </ul>
            </motion.div>

            <motion.div variants={itemVariants} className="p-8 md:p-12 border-b border-r md:border-b-0 border-border hover:bg-accent/5 transition-colors group">
              <span className="text-xs font-serif italic text-accent mb-4 block">Step 03</span>
              <h3 className="text-4xl font-serif mb-6 group-hover:translate-x-2 transition-transform">Opportunity</h3>
              <p className="text-secondary mb-8 leading-relaxed">
                Connect with global employers, freelance gigs, and collaborative projects that match your unique skill profile.
              </p>
              <hr className="mb-8" />
              <ul className="space-y-4 text-xs uppercase tracking-widest text-secondary">
                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-accent"></div> Internship Matching</li>
                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-accent"></div> Freelance Gigs</li>
                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-accent"></div> Research Projects</li>
              </ul>
            </motion.div>
          </motion.div>
        </section>

        {/* Editorial Content Section */}
        <section className="py-24 px-8 border-b border-border bg-white">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 md:gap-24">
            <div className="md:w-1/3">
              <h2 className="text-5xl font-serif leading-tight">Bridging the gap between education and industry.</h2>
            </div>
            <div className="md:w-2/3 md:columns-2 gap-12 text-secondary leading-relaxed">
              <p className="mb-8 break-inside-avoid">
                In an era of rapid technological advancement, traditional education often struggles to keep pace with the evolving demands of the global workforce. Talent-BridgeX was conceived to solve this critical disconnect.
              </p>
              <p className="mb-8 break-inside-avoid">
                By leveraging advanced AI and a global network of industry partners, we provide students with more than just a certificate. We provide a dynamic, living profile that evolves with the market, ensuring you are always ready for what comes next.
              </p>
              <p className="mb-8 break-inside-avoid">
                Our platform doesn't just list jobs; it identifies the precise skills you need to land them. It doesn't just offer courses; it builds a personalized learning roadmap based on your unique career aspirations.
              </p>
              <blockquote className="border-l-2 border-accent pl-6 py-2 text-primary font-serif italic text-xl break-inside-avoid">
                "Our mission is to democratize career readiness, ensuring that every student, regardless of their background, has a clear path to global success."
              </blockquote>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-24 px-8 bg-background border-t border-border">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="max-w-sm">
              <p className="text-2xl font-serif tracking-tighter uppercase font-bold mb-6">
                Talent-Bridge<span className="text-accent">X</span>
              </p>
              <p className="text-secondary text-sm">
                The global intelligence layer for the future workforce. Built for students, powered by intelligence.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
              <div>
                <p className="text-xs uppercase tracking-widest font-bold mb-4">Platform</p>
                <ul className="space-y-2 text-sm text-secondary">
                  <li><Link to="/learn" className="hover:text-accent">Learning</Link></li>
                  <li><Link to="/assessment" className="hover:text-accent">Assessment</Link></li>
                  <li><Link to="/opportunities" className="hover:text-accent">Opportunities</Link></li>
                </ul>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest font-bold mb-4">Community</p>
                <ul className="space-y-2 text-sm text-secondary">
                  <li><Link to="/projects" className="hover:text-accent">Forum</Link></li>
                  <li><Link to="/community" className="hover:text-accent">Study Groups</Link></li>
                  <li><Link to="/counselling" className="hover:text-accent">Mentorship</Link></li>
                </ul>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest font-bold mb-4">Legal</p>
                <ul className="space-y-2 text-sm text-secondary">
                  <li><a href="#" className="hover:text-accent">Privacy</a></li>
                  <li><a href="#" className="hover:text-accent">Terms</a></li>
                  <li><a href="#" className="hover:text-accent">Contact</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-12 md:mt-24 pt-8 md:pt-12 border-t border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[10px] uppercase tracking-widest text-secondary">
            <p>&copy; 2026 Talent-BridgeX. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-primary transition-colors">Twitter</a>
              <a href="#" className="hover:text-primary transition-colors">Instagram</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;
