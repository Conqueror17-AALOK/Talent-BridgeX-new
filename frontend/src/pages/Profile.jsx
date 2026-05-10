import { useState, useRef, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import { motion } from 'framer-motion';
import { Edit2, ExternalLink, Globe, MapPin, BookOpen, Camera, Save, X, Loader2, FileText, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/apiClient';
import SEO from '../components/SEO';

const getInitials = (name = '') =>
  name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const fileInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    university: '',
    country: '',
    linkedin_url: '',
    portfolio_url: '',
    career_interest: '',
    avatar_url: null,
    resume_url: null,
  });

  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');

  // Seed form from auth context
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        bio: user.bio || '',
        university: user.university || '',
        country: user.country || '',
        linkedin_url: user.linkedin_url || '',
        portfolio_url: user.portfolio_url || '',
        career_interest: user.careerInterest || '',
        avatar_url: user.avatar_url || null,
        resume_url: user.resume_url || null,
      });
      fetchSkills();
    }
  }, [user]);

  const fetchSkills = async () => {
    if (!user?.id) return;
    try {
      const res = await apiClient.get(`/users/${user.id}/skills`);
      setSkills(res.data.strengths || []);
    } catch (err) {
      console.warn('Failed to fetch skills:', err.message);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Photo must be under 5MB.');
      return;
    }

    // Optimistic preview
    const previewUrl = URL.createObjectURL(file);
    setProfile(prev => ({ ...prev, avatar_url: previewUrl }));
    setIsUploadingAvatar(true);

    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await apiClient.post(`/users/${user.id}/avatar`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const newUrl = res.data.avatar_url;
      setProfile(prev => ({ ...prev, avatar_url: newUrl }));
      updateUser({ avatar_url: newUrl });
      toast.success('Profile photo updated!');
    } catch (err) {
      toast.error('Photo upload failed. Please try again.');
      setProfile(prev => ({ ...prev, avatar_url: user?.avatar_url || null }));
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;
    setIsSaving(true);
    try {
      // 1. Save profile basic info
      const res = await apiClient.patch(`/users/${user.id}`, {
        name: profile.name,
        bio: profile.bio,
        university: profile.university,
        country: profile.country,
        linkedin_url: profile.linkedin_url,
        portfolio_url: profile.portfolio_url,
        career_interest: profile.career_interest,
      });

      // 2. Save skills to skill_profiles
      await apiClient.patch(`/users/${user.id}/skills`, { strengths: skills });

      updateUser({
        ...res.data,
        careerInterest: res.data.career_interest
      });
      setIsEditing(false);
      toast.success('Profile saved!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingResume(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const res = await apiClient.post(`/users/${user.id}/resume`, formData);
      setProfile(prev => ({ ...prev, resume_url: res.data.resume_url }));
      updateUser({ resume_url: res.data.resume_url });
      toast.success('Resume uploaded successfully!');
    } catch (err) {
      toast.error('Resume upload failed.');
    } finally {
      setIsUploadingResume(false);
    }
  };

  const addSkill = (e) => {
    if (e.key === 'Enter' && newSkill.trim()) {
      if (!skills.includes(newSkill.trim())) {
        setSkills([...skills, newSkill.trim()]);
      }
      setNewSkill('');
      e.preventDefault();
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const staticData = {
    skills: ['System Architecture', 'Go', 'Redis', 'Distributed Systems', 'API Design', 'PostgreSQL', 'Kubernetes'],
    experience: [
      { role: 'Backend Engineering Intern', company: 'Stripe', period: '2025 - Present' },
      { role: 'Open Source Contributor', company: 'Redis Foundation', period: '2024 - 2025' }
    ],
    projects: [
      { name: 'DistCache-v1', desc: 'A distributed LRU cache with consistent hashing.', link: '#' },
      { name: 'Payment-Gate', desc: 'Secure transaction layer for microservices.', link: '#' }
    ]
  };

  const topBar = (
    <>
      <div className="flex items-center gap-3 text-secondary">
        <Globe size={18} />
        <h2 className="text-xs uppercase tracking-widest font-bold hidden sm:block">Public Intelligence Profile</h2>
        <h2 className="text-xs uppercase tracking-widest font-bold sm:hidden">Profile</h2>
      </div>
      
      <div className="flex items-center gap-3 md:gap-6 shrink-0">
        <div className="text-[10px] uppercase tracking-widest font-bold text-accent hidden md:block">
          talentbridge.com/u/{user?.name?.split(' ')[0]?.toLowerCase() || 'profile'}
        </div>
        {isEditing ? (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="btn-outline py-2 px-4 text-[10px] flex items-center gap-2"
            >
              <X size={14} /> Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="btn-primary py-2 px-4 md:px-6 text-[10px] flex items-center gap-2 disabled:opacity-60"
            >
              {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              <span className="hidden sm:inline">{isSaving ? 'Saving…' : 'Save'}</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary py-2 px-4 md:px-6 text-[10px] flex items-center gap-2"
          >
            <Edit2 size={14} /> <span className="hidden sm:inline">Edit Profile</span>
          </button>
        )}
      </div>
    </>
  );

  return (
    <AppLayout topBar={topBar}>
      <SEO title="Profile" />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto py-10 md:py-16 px-4 md:px-8 space-y-16 md:space-y-24">
          
          {/* Header / Intro */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
            <div className="md:col-span-8 space-y-6 md:space-y-8">
              {isEditing ? (
                <input
                  value={profile.name}
                  onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                  className="text-5xl md:text-7xl font-serif leading-none tracking-tighter bg-transparent border-b-2 border-accent outline-none w-full"
                />
              ) : (
                <h1 className="text-5xl sm:text-7xl md:text-9xl font-serif leading-none tracking-tighter">{profile.name || user?.name}</h1>
              )}
              <p className="text-xl md:text-2xl font-serif italic text-accent">{profile.career_interest ? `${profile.career_interest} Candidate` : 'Student'}</p>
              
              <div className="flex flex-wrap gap-4 md:gap-8 text-[10px] uppercase tracking-widest font-bold text-secondary">
                <div className="flex items-center gap-2"><MapPin size={14} /> {profile.country || 'Location'}</div>
                <div className="flex items-center gap-2"><BookOpen size={14} />{profile.university || 'University'}</div>
                {profile.linkedin_url && (
                  <div className="flex items-center gap-2">
                    <ExternalLink size={14} />
                    <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">LinkedIn</a>
                  </div>
                )}
                {profile.portfolio_url && (
                  <div className="flex items-center gap-2">
                    <Globe size={14} />
                    <a href={profile.portfolio_url} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">{profile.portfolio_url}</a>
                  </div>
                )}
              </div>
            </div>
            
            {/* Avatar */}
            <div className="md:col-span-4 flex md:justify-end">
              <div className="relative w-48 h-60 md:w-64 md:h-80 bg-primary border border-border p-2 group">
                <div className="w-full h-full border border-white/20 overflow-hidden flex items-center justify-center">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                  ) : (
                    <span className="text-white/30 font-serif text-7xl md:text-8xl">
                      {getInitials(profile.name || user?.name)}
                    </span>
                  )}
                </div>
                {/* Upload overlay */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer"
                  aria-label="Change profile photo"
                >
                  {isUploadingAvatar ? (
                    <Loader2 size={24} className="text-white animate-spin" />
                  ) : (
                    <Camera size={24} className="text-white" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
            </div>
          </div>

          {/* Bio & Skills */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24">
            <div className="md:col-span-7 space-y-10 md:space-y-12">
              <section className="space-y-6 md:space-y-8">
                <h2 className="text-xs uppercase tracking-widest font-bold border-b border-border pb-2">Professional Thesis</h2>
                {isEditing ? (
                  <textarea
                    value={profile.bio}
                    onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                    rows={5}
                    className="w-full bg-transparent border border-border p-4 focus:border-accent outline-none resize-none font-serif italic text-lg text-secondary"
                    placeholder="Describe your professional thesis and goals…"
                  />
                ) : (
                  <div className="text-secondary leading-relaxed font-serif text-lg md:text-xl italic">
                    "{profile.bio || 'Add a professional bio to tell your story.'}"
                  </div>
                )}
              </section>

              <section className="space-y-6 md:space-y-8">
                <h2 className="text-xs uppercase tracking-widest font-bold border-b border-border pb-2">Technical Core</h2>
                {isEditing ? (
                  <div className="space-y-4">
                    <input
                      value={newSkill}
                      onChange={e => setNewSkill(e.target.value)}
                      onKeyDown={addSkill}
                      placeholder="Add a skill and press Enter…"
                      className="w-full bg-transparent border border-border p-3 text-xs outline-none focus:border-accent"
                    />
                    <div className="flex flex-wrap gap-2">
                      {skills.map(skill => (
                        <span key={skill} className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold bg-background border border-border pl-3 pr-2 py-1">
                          {skill}
                          <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => removeSkill(skill)} />
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {skills.length > 0 ? skills.map(skill => (
                      <span key={skill} className="text-[10px] uppercase tracking-[0.2em] font-bold border border-border px-4 md:px-6 py-2 md:py-3 hover:border-accent hover:text-accent cursor-default transition-all">
                        {skill}
                      </span>
                    )) : (
                      <p className="text-xs text-secondary italic">No skills added yet.</p>
                    )}
                  </div>
                )}
              </section>
            </div>

            <div className="md:col-span-5 space-y-10 md:space-y-12">
              {isEditing && (
                <section className="space-y-4 p-6 border border-border">
                  <h2 className="text-xs uppercase tracking-widest font-bold border-b border-border pb-2">Edit Links</h2>
                  <div className="space-y-3">
                    <input value={profile.university} onChange={e => setProfile(p => ({ ...p, university: e.target.value }))}
                      placeholder="University" className="w-full bg-transparent border-b border-border py-2 focus:border-accent outline-none text-sm" />
                    <input value={profile.country} onChange={e => setProfile(p => ({ ...p, country: e.target.value }))}
                      placeholder="Country" className="w-full bg-transparent border-b border-border py-2 focus:border-accent outline-none text-sm" />
                    <input value={profile.linkedin_url} onChange={e => setProfile(p => ({ ...p, linkedin_url: e.target.value }))}
                      placeholder="LinkedIn URL" className="w-full bg-transparent border-b border-border py-2 focus:border-accent outline-none text-sm" />
                    <input value={profile.portfolio_url} onChange={e => setProfile(p => ({ ...p, portfolio_url: e.target.value }))}
                      placeholder="Portfolio URL" className="w-full bg-transparent border-b border-border py-2 focus:border-accent outline-none text-sm" />
                  </div>
                </section>
              )}

              <section className="space-y-6 md:space-y-8">
                <h2 className="text-xs uppercase tracking-widest font-bold border-b border-border pb-2">Professional Credentials</h2>
                <div className="p-6 border border-border bg-white space-y-4">
                   <div className="flex items-center gap-3 text-secondary">
                      <FileText size={18} />
                      <span className="text-[10px] uppercase tracking-widest font-bold">Resumé / CV</span>
                   </div>
                   {profile.resume_url ? (
                     <div className="flex justify-between items-center">
                        <a href={profile.resume_url} target="_blank" rel="noreferrer" className="text-sm font-serif italic text-accent hover:underline flex items-center gap-2">
                           View Current Resume <ExternalLink size={12} />
                        </a>
                        {isEditing && (
                          <button onClick={() => resumeInputRef.current?.click()} className="text-[10px] uppercase font-bold text-secondary hover:text-primary transition-colors">Replace</button>
                        )}
                     </div>
                   ) : (
                     <p className="text-xs text-secondary italic">No resume uploaded yet.</p>
                   )}
                   {isEditing && (
                     <>
                        <button 
                          onClick={() => resumeInputRef.current?.click()}
                          disabled={isUploadingResume}
                          className="w-full btn-outline py-3 text-[10px] flex items-center justify-center gap-2"
                        >
                           {isUploadingResume ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                           {isUploadingResume ? 'Uploading…' : 'Upload Resume (PDF)'}
                        </button>
                        <input ref={resumeInputRef} type="file" accept=".pdf" className="hidden" onChange={handleResumeUpload} />
                     </>
                   )}
                </div>
              </section>

              <section className="space-y-6 md:space-y-8">
                <h2 className="text-xs uppercase tracking-widest font-bold border-b border-border pb-2">Verified Experience</h2>
                <div className="space-y-8 md:space-y-10">
                  {staticData.experience.map((exp, i) => (
                    <div key={i} className="relative pl-8 md:pl-10 border-l border-border">
                      <div className="absolute left-[-4px] top-1.5 w-2 h-2 bg-accent" />
                      <p className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-1">{exp.period}</p>
                      <h4 className="text-base md:text-lg font-serif font-bold">{exp.role}</h4>
                      <p className="text-sm font-serif italic text-accent">{exp.company}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-6 md:space-y-8">
                <h2 className="text-xs uppercase tracking-widest font-bold border-b border-border pb-2">Intelligence Projects</h2>
                <div className="grid grid-cols-1 gap-4">
                  {staticData.projects.map((proj, i) => (
                    <div key={i} className="p-5 md:p-6 border border-border bg-white group hover:bg-background transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-base font-serif font-bold group-hover:text-accent transition-colors">{proj.name}</h4>
                        <ExternalLink size={14} className="text-border group-hover:text-accent shrink-0 ml-2" />
                      </div>
                      <p className="text-xs text-secondary leading-relaxed font-serif italic">{proj.desc}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* Platform Milestones */}
          <section className="pt-12 md:pt-16 border-t border-border space-y-10 md:space-y-12">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
              <h3 className="text-3xl md:text-5xl font-serif">Platform Validation.</h3>
              <p className="text-[10px] uppercase tracking-widest text-secondary font-bold">Verified by Talent-BridgeX AI</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border border border-border">
              {[
                { label: 'Intelligence Level', value: '4.8 / 5.0', desc: 'Top 5% of Global Backend Candidates' },
                { label: 'Contribution Score', value: '850', desc: 'Active in 4 high-scale community nodes' },
                { label: 'Module Completion', value: '18', desc: 'Certified in System Design & Architecture' }
              ].map((stat, i) => (
                <div key={i} className="p-6 md:p-10 bg-white space-y-4">
                  <p className="text-[10px] uppercase tracking-widest text-secondary font-bold">{stat.label}</p>
                  <p className="text-3xl md:text-4xl font-serif text-accent">{stat.value}</p>
                  <p className="text-xs font-serif italic text-secondary leading-relaxed">{stat.desc}</p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
