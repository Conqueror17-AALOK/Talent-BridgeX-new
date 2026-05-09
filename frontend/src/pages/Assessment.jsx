import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, RefreshCcw } from 'lucide-react';
import { assessmentService, roadmapService } from '../services/ai.service';
import { authService } from '../services/auth.service';
import { toast } from 'sonner';

const Assessment = () => {
  const [phase, setPhase] = useState(1);
  const [phase1Questions, setPhase1Questions] = useState([]);
  const [phase2Questions, setPhase2Questions] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedInterest, setSelectedInterest] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('');
  
  const [loadingPhase1, setLoadingPhase1] = useState(true);
  const [loadingPhase2, setLoadingPhase2] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  useEffect(() => {
    fetchPhase1();
  }, []);

  const fetchPhase1 = async () => {
    setLoadingPhase1(true);
    setError(null);
    try {
      const questions = await assessmentService.getPhase1();
      setPhase1Questions(questions);
    } catch (err) {
      console.error("Failed to fetch Phase 1:", err);
      setError("Unable to initialize assessment. Please check your connection.");
    } finally {
      setLoadingPhase1(false);
    }
  };

  const handleAnswer = async (questionId, answer) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);

    if (questionId === 1) setSelectedInterest(answer);
    if (questionId === 2) setSelectedLevel(answer);
    if (questionId === 3) setSelectedGoal(answer);

    // If last question of phase 1
    if (questionId === 4 && phase2Questions.length === 0) {
      setLoadingPhase2(true);
      try {
        // Use updated values directly if state hasn't updated yet
        const interest = questionId === 1 ? answer : selectedInterest;
        const level = questionId === 2 ? answer : selectedLevel;
        const goal = questionId === 3 ? answer : selectedGoal;
        
        const q2 = await assessmentService.getPhase2(interest, level, goal);
        setPhase2Questions(q2);
        const combined = [...phase1Questions, ...q2];
        setAllQuestions(combined);
        setPhase(2);
        setCurrentIndex(4);
      } catch (err) {
        console.error("Failed to fetch Phase 2:", err);
        setError("Unable to calibrate next phase. Please try again.");
      } finally {
        setLoadingPhase2(false);
      }
    } else {
      if (currentIndex === 11) {
        handleSubmit(newAnswers);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    }
  };

  const handleSubmit = async (finalAnswers) => {
    // Check session before submission
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      toast.error("Session expired — please log in again");
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Submit Assessment
      const result = await assessmentService.submitAssessment(currentUser.id, finalAnswers, selectedInterest);
      
      // 2. Generate Roadmap
      try {
        await roadmapService.generate({
          userId: currentUser.id,
          scores: result.result.scores,
          strengths: result.result.strengths,
          gaps: result.result.gaps,
          overallFeedback: result.result.overallFeedback,
          interest: selectedInterest,
          currentLevel: selectedLevel,
          answers: finalAnswers
        });
        
        // Success: Navigate to /roadmap
        navigate('/roadmap');
      } catch (roadmapError) {
        console.error("Roadmap generation failed:", roadmapError);
        // Fail: Navigate to dashboard so user isn't stuck
        navigate('/dashboard');
      }
    } catch (err) {
      console.error("Submission failed:", err);
      setIsSubmitting(false);
      setError("Failed to finalize assessment. Please try again.");
    }
  };

  if (loadingPhase1) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-accent" size={48} />
        <p className="text-[10px] uppercase tracking-[0.3em] text-secondary animate-pulse">Initializing Intelligence Node...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center">
        <div className="max-w-md space-y-6">
          <h1 className="text-3xl font-serif">Assessment Error</h1>
          <p className="text-secondary font-serif italic">{error}</p>
          <button 
            onClick={() => phase === 1 ? fetchPhase1() : window.location.reload()}
            className="btn-primary w-full py-4 text-[10px] uppercase tracking-widest flex justify-center items-center gap-2"
          >
            <RefreshCcw size={14} /> Retry
          </button>
        </div>
      </div>
    );
  }

  if (loadingPhase2) {
    return (
      <div className="fixed inset-0 z-[100] bg-primary/95 backdrop-blur-sm flex items-center justify-center text-white">
        <div className="text-center space-y-6">
          <Loader2 className="animate-spin text-accent mx-auto" size={64} />
          <h2 className="text-2xl font-serif italic">Calibrating your assessment...</h2>
          <p className="text-[10px] uppercase tracking-widest text-white/40">Analyzing your interest profile</p>
        </div>
      </div>
    );
  }

  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-primary text-white flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center space-y-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
            <Loader2 size={48} className="animate-spin text-accent mb-8" />
            <h2 className="text-4xl font-serif mb-4">Generating your roadmap...</h2>
            <div className="w-full bg-white/10 h-[1px] relative overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 3 }}
                className="absolute inset-y-0 left-0 bg-accent"
              />
            </div>
            <div className="mt-8 space-y-2 text-[10px] uppercase tracking-[0.2em] text-white/30 text-left w-full font-mono">
              <p>&gt; MAPPING_KNOWLEDGE_NODES...</p>
              <p>&gt; SYNCING_ROADMAP_SH_DATA...</p>
              <p>&gt; PERSONALIZING_CURRICULUM...</p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const currentQuestions = phase === 1 ? phase1Questions : allQuestions;
  const currentQuestion = currentQuestions[currentIndex];
  const progress = ((currentIndex + 1) / 12) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <header className="border-b border-border py-6 px-8 flex justify-between items-center bg-white sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-serif font-bold uppercase tracking-tighter">TB<span className="text-accent">X</span></span>
          <span className="text-xs uppercase tracking-widest text-secondary border-l border-border pl-4">Skill Assessment</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="w-48 bg-border h-[2px] relative overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="absolute inset-y-0 left-0 bg-primary"
            />
          </div>
          <span className="text-[10px] uppercase tracking-widest text-secondary font-bold">
            {currentIndex + 1}/12
          </span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full">
          <AnimatePresence mode="wait">
            {currentQuestion && (
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-12"
              >
                <div className="space-y-4">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold">Inquiry {currentIndex + 1}</span>
                  <h2 className="text-4xl md:text-5xl font-serif leading-tight">{currentQuestion.question}</h2>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {currentQuestion.options.map((option, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleAnswer(currentQuestion.id, option)}
                      className="text-left p-6 border border-border bg-white hover:border-accent hover:bg-accent/5 transition-all group flex justify-between items-center"
                    >
                      <span className="text-sm uppercase tracking-widest font-medium group-hover:text-primary">{option}</span>
                      <ArrowRight size={18} className="text-border group-hover:text-accent group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="border-t border-border py-8 px-8 bg-white flex justify-between items-center">
        <p className="text-[10px] uppercase tracking-[0.2em] text-secondary">
          {phase === 1 ? 'Phase 1: Profile Calibration' : 'Phase 2: Skill Diagnosis'}
        </p>
        <div className="text-[10px] uppercase tracking-[0.2em] text-secondary">
          Assessment Engine v2.5.0
        </div>
      </footer>
    </div>
  );
};

export default Assessment;
