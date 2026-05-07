import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Upload, Check, Loader2, Camera, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';

const getInitials = (name = '') =>
  name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U';

const Register = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    country: '',
    university: '',
    fieldOfStudy: '',
    yearOfStudy: '',
    careerInterest: '',
    linkedinUrl: '',
  });

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Photo must be under 5MB.');
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // 1. Register user — get back user + token
      const user = await register(formData);

      // 2. Upload avatar to Supabase Storage if provided
      if (avatarFile && user?.id) {
        try {
          const uploadData = new FormData();
          uploadData.append('avatar', avatarFile);
          const uploadRes = await apiClient.post(`/users/${user.id}/avatar`, uploadData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          if (uploadRes.data?.avatar_url) {
            toast.success('Profile photo uploaded!');
          }
        } catch (uploadErr) {
          // Avatar upload failure is non-critical
          console.warn('Avatar upload failed:', uploadErr.message);
          toast.info('Profile created — you can add a photo later from your Profile page.');
        }
      }

      toast.success('Registration successful! Taking you to your assessment…');
      navigate('/assessment');
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Left Rail */}
      <div className="md:w-1/3 bg-primary p-12 text-white flex flex-col justify-between border-r border-border">
        <div>
          <Link to="/" className="text-2xl font-serif tracking-tighter uppercase font-bold mb-24 block">
            Talent-Bridge<span className="text-accent">X</span>
          </Link>
          <div className="space-y-12">
            <div>
              <p className="text-xs uppercase tracking-widest text-white/50 mb-2">Progress</p>
              <div className="flex gap-2">
                {[1, 2, 3].map(s => (
                  <div key={s} className={`h-[1px] flex-1 transition-all duration-500 ${step >= s ? 'bg-accent' : 'bg-white/20'}`} />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-serif leading-tight">Join the next generation of global leaders.</h2>
              <p className="text-sm text-white/60 leading-relaxed font-serif italic">
                "Education is the passport to the future, for tomorrow belongs to those who prepare for it today."
              </p>
            </div>
          </div>
        </div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">Registration Node: TBX-772-SIGMA</div>
      </div>

      {/* Right Rail - Form */}
      <div className="flex-1 p-8 md:p-24 overflow-y-auto">
        <div className="max-w-md mx-auto">
          <div className="mb-12">
            <h3 className="text-3xl font-serif mb-2">Create your account</h3>
            <p className="text-secondary text-sm">Step {step} of 3</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <AnimatePresence mode="wait">
              {/* Step 1 — Basic Info */}
              {step === 1 && (
                <motion.div key="step1" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-secondary block">Full Name</label>
                    <input type="text" name="name" required id="reg-name" value={formData.name} onChange={handleInputChange}
                      className="w-full bg-transparent border-b border-border py-2 focus:border-accent outline-none transition-colors"
                      placeholder="Enter your full name" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-secondary block">Email Address</label>
                    <input type="email" name="email" required id="reg-email" value={formData.email} onChange={handleInputChange}
                      className="w-full bg-transparent border-b border-border py-2 focus:border-accent outline-none transition-colors"
                      placeholder="name@university.edu" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-secondary block">Password</label>
                    <input type="password" name="password" required minLength={8} id="reg-password" value={formData.password} onChange={handleInputChange}
                      className="w-full bg-transparent border-b border-border py-2 focus:border-accent outline-none transition-colors"
                      placeholder="Min. 8 characters" />
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-secondary block">Country</label>
                      <input type="text" name="country" required value={formData.country} onChange={handleInputChange}
                        className="w-full bg-transparent border-b border-border py-2 focus:border-accent outline-none transition-colors"
                        placeholder="USA, UK, etc." />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-secondary block">University</label>
                      <input type="text" name="university" required value={formData.university} onChange={handleInputChange}
                        className="w-full bg-transparent border-b border-border py-2 focus:border-accent outline-none transition-colors"
                        placeholder="Global University" />
                    </div>
                  </div>
                  <button type="button" id="reg-step1-next" onClick={nextStep} className="btn-primary w-full py-4 flex justify-center items-center gap-2">
                    Continue <ArrowRight size={16} />
                  </button>
                </motion.div>
              )}

              {/* Step 2 — Academic Info */}
              {step === 2 && (
                <motion.div key="step2" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-secondary block">Field of Study</label>
                    <input type="text" name="fieldOfStudy" required value={formData.fieldOfStudy} onChange={handleInputChange}
                      className="w-full bg-transparent border-b border-border py-2 focus:border-accent outline-none transition-colors"
                      placeholder="e.g. Computer Science" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-secondary block">Year of Study</label>
                    <select name="yearOfStudy" required value={formData.yearOfStudy} onChange={handleInputChange}
                      className="w-full bg-transparent border-b border-border py-2 focus:border-accent outline-none transition-colors">
                      <option value="">Select Year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                      <option value="Postgraduate">Postgraduate</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-secondary block">Career Interest</label>
                    <select name="careerInterest" required value={formData.careerInterest} onChange={handleInputChange}
                      className="w-full bg-transparent border-b border-border py-2 focus:border-accent outline-none transition-colors">
                      <option value="">Select Interest</option>
                      <option value="Tech">Technology</option>
                      <option value="Design">Design</option>
                      <option value="Business">Business</option>
                      <option value="Research">Research</option>
                      <option value="Creative">Creative</option>
                    </select>
                  </div>
                  <div className="flex gap-4">
                    <button type="button" onClick={prevStep} className="btn-outline flex-1 py-4 flex justify-center items-center gap-2">
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button type="button" id="reg-step2-next" onClick={nextStep} className="btn-primary flex-1 py-4 flex justify-center items-center gap-2">
                      Continue <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3 — Photo & LinkedIn */}
              {step === 3 && (
                <motion.div key="step3" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                  {/* Avatar Upload */}
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-widest text-secondary block">Profile Photo (Optional)</label>
                    <div className="flex items-center gap-6">
                      {/* Preview */}
                      <div className="w-20 h-20 border border-border bg-background flex items-center justify-center shrink-0 overflow-hidden">
                        {avatarPreview ? (
                          <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl font-serif text-secondary">{getInitials(formData.name)}</span>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <button
                          type="button"
                          id="reg-avatar-upload"
                          onClick={() => fileInputRef.current?.click()}
                          className="btn-outline py-2 px-4 text-[10px] flex items-center gap-2 w-full justify-center"
                        >
                          <Camera size={14} /> Upload Photo
                        </button>
                        {avatarPreview && (
                          <button type="button" onClick={() => { setAvatarPreview(null); setAvatarFile(null); }}
                            className="text-[10px] uppercase tracking-widest text-secondary hover:text-primary transition-colors flex items-center gap-1 w-full justify-center">
                            <X size={12} /> Remove
                          </button>
                        )}
                        <p className="text-[10px] text-secondary text-center">JPG or PNG, max 5MB</p>
                      </div>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-secondary block">LinkedIn Profile URL</label>
                    <input type="url" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleInputChange}
                      className="w-full bg-transparent border-b border-border py-2 focus:border-accent outline-none transition-colors"
                      placeholder="https://linkedin.com/in/username" />
                  </div>

                  <div className="p-6 border border-border bg-accent/5">
                    <p className="text-xs text-secondary leading-relaxed">
                      By completing registration, you agree to our Terms of Service and Privacy Policy.
                      You will be redirected to the AI Skill Assessment.
                    </p>
                  </div>
                  
                  <div className="flex gap-4">
                    <button type="button" onClick={prevStep} className="btn-outline flex-1 py-4 flex justify-center items-center gap-2">
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button type="submit" id="reg-submit" disabled={isLoading}
                      className="btn-primary flex-1 py-4 flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                      {isLoading ? (
                        <><Loader2 size={16} className="animate-spin" /> Creating…</>
                      ) : (
                        <>Finalize <Check size={16} /></>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <div className="mt-12 pt-12 border-t border-border text-center">
            <p className="text-xs text-secondary uppercase tracking-widest">
              Already have an account? <Link to="/login" className="text-accent hover:underline">Login here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
