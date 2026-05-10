import { useState, useEffect, useRef, useMemo } from 'react';
import AppLayout from '../components/AppLayout';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  Calendar, 
  Info, 
  Sparkles, 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  AlertCircle,
  Zap 
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

async function callCounsellingAPI(history, context, message) {
  const res = await api.post('/ai/counselling', {
    message,
    context,
    history
  });
  return res.data.reply;
}

const Counselling = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: "Welcome. I have analyzed your latest skill assessment and current roadmap progress. How can I assist with your career trajectory today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(() => {
    const saved = localStorage.getItem('tbx_voice_enabled');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const scrollRef = useRef(null);
  const speechRef = useRef(null);

  // Voice Toggle Persistence
  useEffect(() => {
    localStorage.setItem('tbx_voice_enabled', JSON.stringify(voiceEnabled));
  }, [voiceEnabled]);

  // TTS Helpers
  const cancel = () => window.speechSynthesis.cancel();
  const speak = (text) => {
    if (!voiceEnabled) return;
    cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    
    const preferredVoice = voices.find(v => 
      (v.lang.startsWith('en') && (v.name.includes('Google UK') || v.name.includes('Samantha')))
    ) || voices.find(v => v.lang.startsWith('en'));

    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.rate = 0.92;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    window.speechSynthesis.speak(utterance);
    speechRef.current = utterance;
  };

  useEffect(() => {
    return () => cancel();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    const context = {
      interest: user?.careerInterest || 'Tech',
      skillProfile: { technical: 78, soft: 92 },
      roadmap: { currentMilestone: 'Advanced Architecture' }
    };

    const userMsg = { 
      role: 'user', 
      content: trimmed, 
      ts: new Date(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    cancel(); // cancel any ongoing speech

    try {
      const history = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content
      }));
      const reply = await callCounsellingAPI(history, context, trimmed);
      const aiMsg = { 
        role: 'assistant', 
        content: reply, 
        ts: new Date(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
      speak(reply);
    } catch (err) {
      let friendlyMessage = `Error: ${err.message}`;
      if (err.message.includes('429')) {
        friendlyMessage = "I'm receiving too many requests right now. Please wait about 15-30 seconds and try again.";
      }
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: friendlyMessage,
        ts: new Date(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    setMessages([{ 
      role: 'assistant', 
      content: "Welcome. I have analyzed your latest skill assessment and current roadmap progress. How can I assist with your career trajectory today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  const handleReplay = (text) => {
    speak(text);
  };

  // Dynamic suggested prompts based on career interest
  const suggestedPrompts = useMemo(() => {
    const interest = user?.careerInterest?.toLowerCase() || '';
    
    if (interest.includes('tech') || interest.includes('software') || interest.includes('developer')) {
      return [
        "What are the best learning paths for me?",
        "Help me find relevant internships.",
        "How should I prepare for system design?"
      ];
    }
    if (interest.includes('business') || interest.includes('management') || interest.includes('marketing')) {
      return [
        "Which certifications are valued?",
        "Tell me about Product Management roles.",
        "Can you help with interview prep?"
      ];
    }
    return [
      "What should I learn next?",
      "How to prepare for interviews?",
      "Which certifications are valued?"
    ];
  }, [user?.careerInterest]);

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
        <div className="flex items-center gap-3 md:gap-4 mr-2 border-r border-border pr-4">
           <button 
             onClick={() => setVoiceEnabled(!voiceEnabled)}
             className={`p-1.5 transition-colors ${voiceEnabled ? 'text-accent' : 'text-secondary opacity-50'}`}
             title={voiceEnabled ? "Mute Voice" : "Enable Voice"}
           >
             {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
           </button>
           <button 
             onClick={handleClearChat}
             className="text-secondary hover:text-accent transition-colors"
             title="Clear Chat"
           >
             <RotateCcw size={18} />
           </button>
        </div>

        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold">
          <Zap size={12} className="text-accent" />
          <span className="text-accent hidden sm:inline">AI Active</span>
          <Sparkles size={14} className="text-accent" />
        </div>
        <button onClick={handleBookSession} className="btn-outline py-2 px-4 md:px-6 text-[10px] hidden sm:block">
          Session History
        </button>
      </div>
    </>
  );

  return (
    <AppLayout topBar={topBar}>
      <style>
        {`
          @keyframes bounce {
            0%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-6px); }
          }
          .typing-dot {
            display: inline-block;
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background-color: currentColor;
            animation: bounce 1.4s infinite ease-in-out both;
          }
          .typing-dot:nth-child(1) { animation-delay: -0.32s; }
          .typing-dot:nth-child(2) { animation-delay: -0.16s; }
        `}
      </style>
      <div className="flex flex-col xl:flex-row flex-1 overflow-hidden h-full">
         
         {/* Chat Window */}
         <div className="flex-1 flex flex-col bg-white min-h-0">
            {/* Context Header */}
            <div className="p-3 md:p-4 border-b border-border bg-background/50 flex justify-between items-center shrink-0">
               <p className="text-[10px] uppercase tracking-widest text-secondary font-bold truncate">
                  Context: <span className="text-primary italic font-serif">{user?.careerInterest || 'Tech'} / Your Level</span>
               </p>
               <div className="flex gap-2 shrink-0 ml-4">
                  <span className="text-[8px] uppercase tracking-widest font-bold text-accent 
                  hidden sm:flex items-center gap-1">
                    <Zap size={10} /> Gemini AI
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
                        <div className={`w-8 h-8 md:w-10 md:h-10 flex-shrink-0 flex items-center justify-center font-serif text-base md:text-lg ${msg.role === 'user' ? 'bg-primary text-white' : (msg.isError ? 'bg-red-500 text-white' : 'bg-accent text-white')}`}>
                           {msg.role === 'user' ? userInitial : (msg.isError ? <AlertCircle size={18} /> : <Sparkles size={18} />)}
                        </div>
                        <div className={`group relative space-y-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                           <p className="text-[10px] uppercase tracking-widest text-secondary font-bold">
                              {msg.role === 'user' ? userName : 'AI Counsellor'}
                           </p>
                           <div className={`p-4 md:p-6 rounded-sm text-base md:text-lg font-serif leading-relaxed italic ${msg.role === 'user' ? 'text-primary bg-background/30' : (msg.isError ? 'text-red-700 bg-red-50 border border-red-200' : 'text-secondary bg-accent/5')}`}>
                              {msg.content}
                              
                              {msg.role === 'assistant' && !msg.isError && (
                                <button 
                                  onClick={() => handleReplay(msg.content)}
                                  className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-white shadow-sm border border-border rounded-full text-accent hover:bg-accent hover:text-white"
                                  title="Replay Voice"
                                >
                                  <Volume2 size={12} />
                                </button>
                              )}
                           </div>
                           <p className="text-[8px] text-secondary/50 font-bold uppercase tracking-widest">
                             {msg.timestamp}
                           </p>
                        </div>
                     </div>
                  </motion.div>
                ))}
               
                {isTyping && (
                  <div className="flex justify-start">
                     <div className="flex gap-4 md:gap-6 items-center">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-accent text-white flex items-center justify-center">
                           <div className="flex gap-1 items-center justify-center">
                              <span className="typing-dot" />
                              <span className="typing-dot" />
                              <span className="typing-dot" />
                           </div>
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
                <div className="mt-3 md:mt-4 flex flex-wrap gap-3 md:gap-6 items-center">
                  <p className="text-[8px] uppercase tracking-widest text-secondary font-bold">Suggested:</p>
                  {suggestedPrompts.map((prompt, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleSuggestedPrompt(prompt)} 
                      className={`text-[8px] uppercase tracking-widest text-accent hover:underline ${idx > 1 ? 'hidden sm:block' : ''}`}
                    >
                      "{prompt}"
                    </button>
                  ))}
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
                     Powered by Talent-BridgeX Intelligence. Your conversations are 
                     processed securely to refine your personalized career roadmap.
                  </p>
               </div>
            </div>
         </aside>

      </div>
    </AppLayout>
  );
};

export default Counselling;
