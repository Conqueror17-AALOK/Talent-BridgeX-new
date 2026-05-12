import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Assessment from './pages/Assessment';
import Learn from './pages/Learn';
import ModuleDetail from './pages/ModuleDetail';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Opportunities from './pages/Opportunities';
import OpportunityDetail from './pages/OpportunityDetail';
import Analytics from './pages/Analytics';
import Community from './pages/Community';
import Counselling from './pages/Counselling';
import Profile from './pages/Profile';
import Roadmap from './pages/Roadmap';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import RegistrationPending from './pages/RegistrationPending';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <>
      <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/registration-pending" element={<RegistrationPending />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/assessment" element={<ProtectedRoute><Assessment /></ProtectedRoute>} />
        <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
        <Route path="/learn" element={<ProtectedRoute><Learn /></ProtectedRoute>} />
        <Route path="/learn/:id" element={<ProtectedRoute><ModuleDetail /></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
        <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
        <Route path="/opportunities" element={<ProtectedRoute><Opportunities /></ProtectedRoute>} />
        <Route path="/opportunities/:id" element={<ProtectedRoute><OpportunityDetail /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
        <Route path="/counselling" element={<ProtectedRoute><Counselling /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </Router>
  </>
  );
}

export default App;
