import { motion } from 'framer-motion';
import { Mail, ArrowLeft, ExternalLink } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import SEO from '../components/SEO';

const RegistrationPending = () => {
  const location = useLocation();
  const email = location.state?.email || 'your email address';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <SEO title="Confirm Email | Talent-BridgeX" description="Please verify your email address to continue." />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white border border-border p-8 md:p-16 shadow-sm space-y-10"
      >
        <div className="space-y-4">
          <div className="w-16 h-16 bg-accent/10 flex items-center justify-center rounded-full">
            <Mail className="text-accent" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif tracking-tighter leading-none">Confirm your email.</h1>
          <p className="text-secondary font-serif italic text-lg leading-relaxed">
            We've sent a verification link to <span className="text-primary font-bold not-italic">{email}</span>. 
            Please check your inbox and click the link to activate your account.
          </p>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-background border border-border space-y-3">
             <p className="text-[10px] uppercase tracking-widest font-bold text-primary">Why verify?</p>
             <p className="text-xs leading-relaxed text-secondary italic">
               To ensure the integrity of our student network, all accounts must be validated via an institutional or verified email address.
             </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href={`https://${email.split('@')[1]}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-primary py-4 px-8 text-[10px] flex items-center justify-center gap-2 flex-1"
            >
              Open Webmail <ExternalLink size={14} />
            </a>
            <Link to="/login" className="btn-outline py-4 px-8 text-[10px] flex items-center justify-center gap-2 flex-1">
               <ArrowLeft size={14} /> Back to Login
            </Link>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-center">
           <p className="text-[10px] uppercase tracking-widest text-secondary font-bold">
             Didn't receive the email? <button className="text-accent hover:underline">Resend Verification</button>
           </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegistrationPending;
