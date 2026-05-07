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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/learn/:id" element={<ModuleDetail />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/opportunities/:id" element={<OpportunityDetail />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/community" element={<Community />} />
        <Route path="/counselling" element={<Counselling />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
