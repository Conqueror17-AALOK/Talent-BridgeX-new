import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import { assessmentService, roadmapService } from '../services/ai.service';
import { authService } from '../services/auth.service';

const Assessment = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Fallback to 'Tech' if no interest found
        const interest = user?.user_metadata?.careerInterest || 'Tech';
        const data = await assessmentService.getQuestions(interest);
        setQuestions(data);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      } finally {
        setLoadingQuestions(false);
      }
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      setProgress(((currentQuestion + 1) / questions.length) * 100);
    }
  }, [currentQuestion, questions]);

  const handleAnswer = (answer) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: answer });
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    setIsGenerating(true);
    try {
      const interest = user?.user_metadata?.careerInterest || 'Tech';
      // 1. Submit Assessment
      const assessmentResult = await assessmentService.submitAssessment(user.id, answers, interest);
      
      // 2. Generate Roadmap based on results
      await roadmapService.generate(
        user.id, 
        assessmentResult.result.scores, 
        interest, 
        user?.user_metadata?.yearOfStudy || '1'
      );

      navigate('/dashboard');
    } catch (error) {
      console.error("Post-assessment processing failed:", error);
      setIsGenerating(false);
    }
  };

  if (loadingQuestions) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
         <div className="text-center space-y-4">
            <Loader2 size={32} className="animate-spin mx-auto text-accent" />
            <p className="text-[10px] uppercase tracking-widest text-secondary font-bold">Initializing Intelligence Node...</p>
         </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="max-w-md w-full border border-border bg-white p-12 text-center space-y-6">
          <h1 className="text-3xl font-serif">Assessment Unavailable</h1>
          <p className="text-secondary font-serif italic">
            We could not load the assessment questions. Please check your connection and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary w-full py-4 text-xs"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-primary text-white flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center space-y-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center"
          >
            <Loader2 size={48} className="animate-spin text-accent mb-8" />
            <h2 className="text-4xl font-serif mb-4">Generating your roadmap...</h2>
            <p className="text-white/60 font-serif italic mb-12">
              Our AI is analyzing your responses to build a precision career path tailored to your strengths and gaps.
            </p>
            
            <div className="w-full bg-white/10 h-[1px] relative overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 4 }}
                className="absolute inset-y-0 left-0 bg-accent"
              />
            </div>
            
            <div className="mt-8 space-y-2 text-[10px] uppercase tracking-[0.2em] text-white/30 text-left w-full font-mono">
              <p>&gt; ANALYZING_COGNITIVE_PATTERNS...</p>
              <p>&gt; CALCULATING_SKILL_VECTORS...</p>
              <p>&gt; MAPPING_CAREER_TRAJECTORIES...</p>
              <p>&gt; SYNCING_WITH_GLOBAL_MARKET_DATA...</p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header / Progress */}
      <header className="border-b border-border py-5 md:py-8 px-4 md:px-8 flex justify-between items-center bg-white sticky top-0 z-50">
        <div className="flex items-center gap-3 md:gap-4">
           <span className="text-xl md:text-2xl font-serif font-bold uppercase tracking-tighter">TB<span className="text-accent">X</span></span>
           <span className="text-xs uppercase tracking-widest text-secondary border-l border-border pl-3 md:pl-4 hidden sm:block">Skill Assessment</span>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <div className="w-24 sm:w-48 bg-border h-[2px] relative overflow-hidden">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${progress}%` }}
               className="absolute inset-y-0 left-0 bg-primary"
             />
          </div>
          <span className="text-[10px] uppercase tracking-widest text-secondary font-bold">
            {currentQuestion + 1}/{questions.length}
          </span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="max-w-2xl w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8 md:space-y-12"
            >
              <div className="space-y-4">
                <span className="text-xs font-serif italic text-accent uppercase tracking-widest">Inquiry {questions[currentQuestion].id}</span>
                <h2 className="text-3xl md:text-5xl font-serif leading-tight">{questions[currentQuestion].question}</h2>
              </div>

              <div className="space-y-4">
                {questions[currentQuestion].type === 'mcq' && (
                  <div className="grid grid-cols-1 gap-4">
                    {questions[currentQuestion].options.map((option, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleAnswer(option)}
                        className="text-left p-6 border border-border hover:border-accent hover:bg-accent/5 transition-all group flex justify-between items-center"
                      >
                        <span className="text-sm uppercase tracking-wide group-hover:text-primary">{option}</span>
                        <ArrowRight size={16} className="text-border group-hover:text-accent group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
                )}

                {questions[currentQuestion].type === 'ranking' && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    {questions[currentQuestion].options.map((option, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleAnswer(option)}
                        className="text-center py-6 md:py-10 border border-border hover:border-accent hover:bg-accent/5 transition-all group"
                      >
                        <p className="text-[10px] uppercase tracking-widest text-secondary mb-2">Level {idx + 1}</p>
                        <p className="text-sm font-bold uppercase tracking-widest">{option}</p>
                      </button>
                    ))}
                  </div>
                )}

                {questions[currentQuestion].type === 'short_answer' && (
                  <div className="space-y-6">
                    <textarea 
                      className="w-full bg-transparent border border-border p-6 h-48 focus:border-accent outline-none transition-colors resize-none font-serif italic text-lg"
                      placeholder={questions[currentQuestion].placeholder}
                    />
                    <button 
                      onClick={() => handleAnswer("Short answer submitted")}
                      className="btn-primary w-full py-4 flex justify-center items-center gap-2"
                    >
                      Confirm Submission <Check size={16} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <footer className="border-t border-border py-5 md:py-8 px-4 md:px-8 bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <p className="text-[10px] uppercase tracking-[0.2em] text-secondary">
          Data Integrity Status: <span className="text-green-600 font-bold">VERIFIED</span>
        </p>
        <div className="text-[10px] uppercase tracking-[0.2em] text-secondary">
          Assessment Engine v2.4.0
        </div>
      </footer>
    </div>
  );
};

export default Assessment;
