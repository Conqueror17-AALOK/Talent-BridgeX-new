import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error: authError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Welcome back! Redirecting to dashboard…');
      navigate('/dashboard');
    } catch (error) {
      // toast.error is already handled in AuthContext or here
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Rail */}
      <div className="hidden md:flex md:w-1/2 bg-primary p-24 text-white flex-col justify-between relative overflow-hidden">
        <div className="z-10">
          <Link to="/" className="text-2xl font-serif tracking-tighter uppercase font-bold mb-24 block">
            Talent-Bridge<span className="text-accent">X</span>
          </Link>
          <div className="max-w-md">
            <h2 className="text-6xl font-serif leading-none mb-8 tracking-tighter">Welcome back to the frontier.</h2>
            <p className="text-xl text-white/60 font-serif italic">Your personalized career intelligence is waiting.</p>
          </div>
        </div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 border border-white/10 rounded-full" />
        <div className="absolute -bottom-12 -right-12 w-96 h-96 border border-white/5 rounded-full" />
        <div className="z-10 text-[10px] uppercase tracking-[0.2em] text-white/40">Secure Access Protocol // Alpha-9</div>
      </div>

      {/* Right Rail - Form */}
      <div className="flex-1 p-8 md:p-24 flex items-center justify-center">
        <div className="max-w-sm w-full">
          <div className="mb-12">
            <h1 className="text-3xl font-serif mb-2">Access Platform</h1>
            <p className="text-secondary text-sm">Enter your credentials below</p>
          </div>

          {authError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 flex items-center gap-3 text-red-600 text-xs font-serif italic">
              <AlertCircle size={16} />
              {authError}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-secondary block">Email Address</label>
              <input
                type="email"
                required
                id="login-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-border py-2 focus:border-accent outline-none transition-colors"
                placeholder="name@university.edu"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase tracking-widest text-secondary block">Password</label>
                <Link to="/forgot-password" id="forgot-password-link" className="text-[10px] uppercase tracking-widest text-accent hover:underline">Forgot?</Link>
              </div>
              <input
                type="password"
                required
                id="login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-border py-2 focus:border-accent outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>
            
            <button
              type="submit"
              id="login-submit"
              disabled={loading}
              className="btn-primary w-full py-4 flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Authenticating…</>
              ) : (
                <>Login <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="mt-12 pt-12 border-t border-border text-center">
            <p className="text-xs text-secondary uppercase tracking-widest">
              New to Talent-BridgeX? <Link to="/register" className="text-accent hover:underline">Register now</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
