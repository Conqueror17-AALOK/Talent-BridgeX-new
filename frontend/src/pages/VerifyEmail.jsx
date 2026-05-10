import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import SEO from '../components/SEO';

const VerifyEmail = () => {
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('Validating your credentials...');
  const navigate = useNavigate();

  useEffect(() => {
    const checkVerification = async () => {
      // Supabase automatically handles the hash token and establishes a session 
      // if the link is valid. We just need to check if we have a user now.
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (session) {
          setStatus('success');
          setMessage('Email verified successfully! Your account is now active.');
          // Optional: Sync user data to local storage if needed
          localStorage.setItem('tbx_token', session.access_token);
          localStorage.setItem('tbx_user', JSON.stringify({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || 'User'
          }));
          
          setTimeout(() => navigate('/dashboard'), 3000);
        } else {
          // If no session, wait a bit or check if there was an error in the URL params
          const params = new URLSearchParams(window.location.search);
          if (params.get('error')) {
            setStatus('error');
            setMessage(params.get('error_description') || 'Verification failed. The link may be expired.');
          } else {
            // Sometimes it takes a moment for the session to be picked up from the hash
            setTimeout(() => {
              supabase.auth.getSession().then(({ data: { session: s } }) => {
                if (s) {
                   setStatus('success');
                   setMessage('Email verified successfully!');
                   setTimeout(() => navigate('/dashboard'), 2000);
                } else {
                   setStatus('error');
                   setMessage('No active session found. Please try logging in.');
                }
              });
            }, 1000);
          }
        }
      } catch (err) {
        setStatus('error');
        setMessage(err.message || 'An unexpected error occurred during verification.');
      }
    };

    checkVerification();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <SEO title="Verify Email | Talent-BridgeX" description="Verifying your account." />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white border border-border p-8 md:p-12 text-center space-y-8"
      >
        {status === 'verifying' && (
          <>
            <div className="flex justify-center">
              <Loader2 size={48} className="animate-spin text-accent" />
            </div>
            <h1 className="text-3xl font-serif">Verifying Email</h1>
            <p className="text-sm text-secondary font-serif italic">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="flex justify-center">
              <CheckCircle size={48} className="text-green-500" />
            </div>
            <h1 className="text-3xl font-serif">Verified!</h1>
            <p className="text-sm text-secondary font-serif italic">{message}</p>
            <Link to="/dashboard" className="btn-primary w-full py-4 text-[10px] block">
              Go to Dashboard
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="flex justify-center">
              <XCircle size={48} className="text-red-500" />
            </div>
            <h1 className="text-3xl font-serif">Verification Failed</h1>
            <p className="text-sm text-secondary font-serif italic">{message}</p>
            <Link to="/login" className="btn-primary w-full py-4 text-[10px] block">
              Back to Login
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
