import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import SEO from '../components/SEO';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await apiClient.post('/auth/forgot-password', { email });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <SEO title="Forgot Password | Talent-BridgeX" description="Reset your account password." />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white border border-border p-8 md:p-12 shadow-sm"
      >
        <Link to="/login" className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-secondary hover:text-primary transition-colors mb-8">
           <ArrowLeft size={14} /> Back to Login
        </Link>

        {submitted ? (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle size={48} className="text-green-500" />
            </div>
            <h1 className="text-3xl font-serif">Check your inbox.</h1>
            <p className="text-sm text-secondary leading-relaxed font-serif italic">
              If an account exists for {email}, we've sent a password reset link. Please check your email and follow the instructions.
            </p>
            <Link to="/login" className="btn-primary w-full py-4 text-[10px] block text-center">
              Return to Login
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-serif tracking-tighter">Reset password.</h1>
              <p className="text-xs text-secondary uppercase tracking-widest font-bold">Enter your registered email address</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 p-4 text-red-600 text-xs font-serif italic">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-secondary">Institutional Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={16} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-background border border-border py-4 pl-12 pr-4 text-sm font-serif outline-none focus:border-accent transition-colors"
                    placeholder="name@university.edu"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 text-[10px] flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                {loading ? 'Processing...' : 'Send Reset Link'}
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
