import { useState, useEffect, useRef, useMemo } from 'react';
import AppLayout from '../components/AppLayout';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Calendar, Info, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { io } from 'socket.io-client';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

const Counselling = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Welcome. I have analyzed your latest skill assessment and current roadmap progress. How can I assist with your career trajectory today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const scrollRef = useRef(null);

  // Lazy-initialize socket so it doesn't fire on every render
  const socket = useMemo(() => {
    const s = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      autoConnect: false,
      reconnectionAttempts: 3,
    });
    return s;
  }, []);

  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {
      setIsConnected(true);
      if (user?.id) socket.emit('join-counselling', user.id);
    });

    socket.on('connect_error', () => {
      setIsConnected(false);
      toast.error('Could not connect to AI counsellor. Is the backend running?');
    });

    socket.on('receive-message', (msg) => {
      setMessages(prev => {
        // Deduplicate user message echoes
        if (msg.role === 'user' && prev[prev.length - 1]?.content === msg.content) return prev;
        return [...prev, msg];
      });
      if (msg.role === 'assistant') setIsTyping(false);
    });

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('receive-message');
      socket.disconnect();
    };
  }, [socket, user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    if (!isConnected) {
      toast.error('Not connected to AI server. Please refresh the page.');
      return;
    }

    // Optimistically add user message to UI
    setMessages(prev => [...prev, { role: 'user', content: trimmed }]);
    setIsTyping(true);

    socket.emit('send-message', { 
      userId: user?.id || 'anonymous', 
      message: trimmed,
      context: {
        interest: user?.careerInterest || 'Tech',
        skillProfile: { technical: 78, soft: 92 },
        roadmap: { currentMilestone: 'Advanced Architecture' }
      }
    });
    
    setInput('');
  };

  const handleSuggestedPrompt = (prompt) => {
    setInput(prompt);
  };

  const handleBookSession = () => {
    toast.info('Human session booking coming soon — we\'ll notify you when it\'s available.');
  };

  const userName = user?.name || 'User';
  const userInitial = userName[0]?.toUpperCase() || 'U';

  const topBar = (
    <>
      <div className="flex items-center gap-3 text-secondary">
        <MessageSquare size={18} />
        <h2 className="text-xs uppercase tracking-widest font-bold">AI Career Counsellor</h2>
      </div>
      
      <div className="flex items-center gap-4 md:gap-6 shrink-0">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold">
          <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-400'}`} />
          <span className={`hidden sm:inline ${isConnected ? 'text-accent' : 'text-secondary'}`}>
            {isConnected ? 'Intelligence Active' : 'Disconnected'}
          </span>
          <Sparkles size={14} className="text-accent" />
        </div>
        <button onClick={handleBookSession} className="btn-outline py-2 px-4 md:px-6 text-[10px] hidden sm:block" id="counselling-history">
          Session History
        </button>
      </div>
    </>
  );

  return (
    <AppLayout topBar={topBar}>
      <div className="flex flex-col xl:flex-row flex-1 overflow-hidden h-full">
         
         {/* Chat Window */}
         <div className="flex-1 flex flex-col bg-white min-h-0">
            {/* Context Header */}
            <div className="p-3 md:p-4 border-b border-border bg-background/50 flex justify-between items-center shrink-0">
               <p className="text-[10px] uppercase tracking-widest text-secondary font-bold truncate">
                  Context: <span className="text-primary italic font-serif">{user?.careerInterest || 'Tech'} / Your Level</span>
               </p>
               <div className="flex gap-2 shrink-0 ml-4">
                  <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-400'}`} />
                  <span className="text-[8px] uppercase tracking-widest font-bold text-secondary hidden sm:block">
                    {isConnected ? 'Real-time Analysis' : 'Offline'}
                  </span>
               </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 space-y-8 md:space-y-12">
               {messages.map((msg, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                     <div className={`max-w-[85%] md:max-w-2xl flex gap-4 md:gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-8 h-8 md:w-10 md:h-10 flex-shrink-0 flex items-center justify-center font-serif text-base md:text-lg ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-accent text-white'}`}>
                           {msg.role === 'user' ? userInitial : <Sparkles size={18} />}
                        </div>
                        <div className={`space-y-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                           <p className="text-[10px] uppercase tracking-widest text-secondary font-bold">
                              {msg.role === 'user' ? userName : 'AI Counsellor'}
                           </p>
                           <div className={`text-base md:text-lg font-serif leading-relaxed italic ${msg.role === 'user' ? 'text-primary' : 'text-secondary'}`}>
                              {msg.content}
                           </div>
                        </div>
                     </div>
                  </motion.div>
               ))}
               
               {isTyping && (
                  <div className="flex justify-start">
                     <div className="flex gap-4 md:gap-6 items-center">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-accent text-white flex items-center justify-center">
                           <Loader2 size={18} className="animate-spin" />
                        </div>
                        <p className="text-[10px] uppercase tracking-widest text-secondary italic">Analyzing data points…</p>
                     </div>
                  </div>
               )}
            </div>

            {/* Input Area */}
            <div className="p-4 md:p-8 border-t border-border shrink-0">
               <form onSubmit={handleSend} className="flex gap-3 md:gap-4 items-end">
                  <textarea 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Ask about your roadmap, opportunities, or skill gaps…"
                    className="flex-1 bg-background border border-border p-4 md:p-6 h-20 md:h-24 focus:border-accent outline-none transition-colors resize-none font-serif italic text-base md:text-lg"
                  />
                  <button
                    type="submit"
                    id="counselling-send"
                    disabled={!input.trim() || isTyping}
                    className="btn-primary p-4 md:p-6 h-20 md:h-24 flex items-center justify-center group shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                     <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  </button>
               </form>
               <div className="mt-3 md:mt-4 flex flex-wrap gap-3 md:gap-6">
                  <p className="text-[8px] uppercase tracking-widest text-secondary font-bold">Suggested:</p>
                  <button onClick={() => handleSuggestedPrompt("What should I learn next?")} className="text-[8px] uppercase tracking-widest text-accent hover:underline">"What should I learn next?"</button>
                  <button onClick={() => handleSuggestedPrompt("Which internship fits me?")} className="text-[8px] uppercase tracking-widest text-accent hover:underline hidden sm:block">"Which internship fits me?"</button>
                  <button onClick={() => handleSuggestedPrompt("What are my biggest skill gaps?")} className="text-[8px] uppercase tracking-widest text-accent hover:underline hidden md:block">"What are my biggest skill gaps?"</button>
               </div>
            </div>
         </div>

         {/* Context Sidebar — only xl+ */}
         <aside className="w-80 xl:w-96 border-l border-border bg-background p-8 hidden xl:block overflow-y-auto shrink-0">
            <div className="space-y-12">
               <section className="space-y-6">
                  <h3 className="text-xs uppercase tracking-widest font-bold border-b border-border pb-2">Human Consultation</h3>
                  <div className="p-6 bg-white border border-border space-y-6">
                     <p className="text-xs text-secondary leading-relaxed font-serif italic">
                        Sometimes you need a human perspective. Schedule a session with one of our certified career consultants.
                     </p>
                     <div className="space-y-3">
                        <div className="p-3 border border-border flex items-center justify-between group cursor-pointer hover:border-accent">
                           <div className="flex items-center gap-3">
                              <Calendar size={14} className="text-secondary" />
                              <span className="text-[10px] uppercase tracking-widest font-bold">Next Slot: Tomorrow, 09:00</span>
                           </div>
                           <ArrowRight size={14} className="text-border group-hover:text-accent" />
                        </div>
                     </div>
                     <button onClick={handleBookSession} className="w-full btn-outline py-3 text-[10px]" id="book-human-session">
                       Book Human Session
                     </button>
                  </div>
               </section>

               <section className="space-y-6">
                  <h3 className="text-xs uppercase tracking-widest font-bold border-b border-border pb-2">Intelligence Context</h3>
                  <div className="space-y-4">
                     <div className="p-4 border border-border bg-white">
                        <p className="text-[8px] uppercase tracking-widest text-secondary mb-1">Top Strength</p>
                        <p className="text-xs font-serif font-bold">System Architecture (92%)</p>
                     </div>
                     <div className="p-4 border border-border bg-white">
                        <p className="text-[8px] uppercase tracking-widest text-secondary mb-1">Critical Gap</p>
                        <p className="text-xs font-serif font-bold">Distributed Databases</p>
                     </div>
                     <div className="p-4 border border-border bg-white">
                        <p className="text-[8px] uppercase tracking-widest text-secondary mb-1">Target Role</p>
                        <p className="text-xs font-serif font-bold">{user?.careerInterest || 'Tech'} Engineer</p>
                     </div>
                  </div>
               </section>

               <div className="p-6 bg-primary text-white space-y-4">
                  <div className="flex items-center gap-3">
                     <Info size={16} className="text-accent" />
                     <h4 className="text-[10px] uppercase tracking-widest font-bold">Privacy Note</h4>
                  </div>
                  <p className="text-[10px] leading-relaxed text-white/50 italic">
                     Conversations are encrypted and used only to refine your personalized career roadmap.
                  </p>
               </div>
            </div>
         </aside>

      </div>
    </AppLayout>
  );
};

export default Counselling;
