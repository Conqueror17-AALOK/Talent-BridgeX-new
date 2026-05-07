import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Briefcase, 
  Users, 
  MessageSquare, 
  LineChart, 
  User, 
  LogOut,
  FolderKanban,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const getInitials = (name = '') =>
  name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const menuItems = [
    { name: 'Dashboard',   icon: <LayoutDashboard size={18} />, path: '/dashboard' },
    { name: 'Learn',       icon: <BookOpen size={18} />,        path: '/learn' },
    { name: 'Opportunities', icon: <Briefcase size={18} />,     path: '/opportunities' },
    { name: 'Projects',    icon: <FolderKanban size={18} />,    path: '/projects' },
    { name: 'Community',   icon: <Users size={18} />,           path: '/community' },
    { name: 'Analytics',   icon: <LineChart size={18} />,       path: '/analytics' },
    { name: 'Counselling', icon: <MessageSquare size={18} />,   path: '/counselling' },
  ];

  const handleLinkClick = () => { if (onClose) onClose(); };

  const handleLogout = () => {
    logout();
    onClose?.();
    navigate('/');
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen w-64 border-r border-border flex flex-col bg-background z-50
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <Link to="/" className="text-xl font-serif tracking-tighter uppercase font-bold" onClick={handleLinkClick}>
            Talent-Bridge<span className="text-accent">X</span>
          </Link>
          <button className="lg:hidden p-1 text-secondary hover:text-primary transition-colors" onClick={onClose} aria-label="Close navigation">
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 py-6 overflow-y-auto">
          <div className="px-4 mb-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-secondary font-bold px-4 mb-4">Navigation</p>
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.path}
                    onClick={handleLinkClick}
                    className={`flex items-center gap-4 px-4 py-3 text-xs uppercase tracking-widest transition-all ${
                      location.pathname === item.path 
                      ? 'bg-primary text-white font-bold' 
                      : 'text-secondary hover:text-primary hover:bg-border/50'
                    }`}
                  >
                    <span className={location.pathname === item.path ? 'text-accent' : ''}>{item.icon}</span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="px-4 mt-6 pt-6 border-t border-border">
            <p className="text-[10px] uppercase tracking-[0.2em] text-secondary font-bold px-4 mb-4">Account</p>
            <ul className="space-y-1">
              <li>
                <Link to="/profile" onClick={handleLinkClick} className="flex items-center gap-4 px-4 py-3 text-xs uppercase tracking-widest text-secondary hover:text-primary transition-all">
                  <User size={18} /> Profile
                </Link>
              </li>
            </ul>
          </div>
        </nav>
        
        {/* User footer */}
        <div className="p-5 border-t border-border">
          {user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name} className="w-8 h-8 object-cover border border-border shrink-0" />
                ) : (
                  <div className="w-8 h-8 bg-primary text-white flex items-center justify-center font-serif text-sm shrink-0">
                    {getInitials(user.name)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-bold truncate">{user.name}</p>
                  <p className="text-[10px] uppercase tracking-widest text-accent truncate">{user.careerInterest || 'Student'}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 text-xs uppercase tracking-widest text-secondary hover:text-primary transition-all w-full"
              >
                <LogOut size={16} /> Log Out
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary w-full text-center py-2 text-xs block">Sign In</Link>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
