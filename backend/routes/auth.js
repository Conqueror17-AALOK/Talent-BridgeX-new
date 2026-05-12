const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

// Use service role key for admin operations if available, fall back to anon key
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
);

// POST /api/auth/register
router.post('/register', async (req, res) => {
  console.log('Registration request body:', req.body);
  const { name, email, password, university, country, fieldOfStudy, yearOfStudy, careerInterest, linkedinUrl } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  try {
    // 1. Create user in Supabase Auth
    console.log('Creating user in Supabase Auth...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, university, country, careerInterest }
    });

    if (authError) {
      console.error('Supabase authError:', authError);
      throw authError;
    }

    console.log('User created successfully:', authData.user.id);

    // 2. Upsert profile row (trigger may handle this, but we ensure all fields)
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: authData.user.id,
        name,
        email,
        university: university || null,
        country: country || null,
        field_of_study: fieldOfStudy || null,
        year_of_study: yearOfStudy || null,
        career_interest: careerInterest || null,
        linkedin_url: linkedinUrl || null,
      });

    if (profileError) console.warn('Profile upsert warning:', profileError.message);

    // 3. Sign in to get a session token
    const { data: sessionData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) throw signInError;

    res.status(201).json({
      user: {
        id: authData.user.id,
        name,
        email,
        university,
        careerInterest,
        avatar_url: null,
      },
      token: sessionData.session.access_token,
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(400).json({ 
      error: err.message || 'Registration failed',
      details: err.details || null,
      hint: err.hint || null
    });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) throw error;

    // Fetch profile for additional info
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    res.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        name: profile?.name || data.user.user_metadata?.name || 'User',
        university: profile?.university || null,
        careerInterest: profile?.career_interest || null,
        avatar_url: profile?.avatar_url || null,
      },
      token: data.session.access_token,
    });
  } catch (err) {
    res.status(401).json({ error: 'Invalid email or password.' });
  }
});

// POST /api/auth/logout
router.post('/logout', async (req, res) => {
  try {
    await supabase.auth.signOut();
    res.json({ message: 'Logged out successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required.' });

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password`,
    });
    if (error) throw error;
    res.json({ message: 'Password reset link sent to your email.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
