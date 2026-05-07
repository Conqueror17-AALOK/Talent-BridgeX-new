import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Derives initials from a name string
const getInitials = (name = '') =>
  name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="border-b border-border bg-background sticky top-0 z-50">
      <div className="py-5 px-6 md:px-8 flex justify-between items-center">
        {/* Logo */}
        <div className="flex-1">
          <Link to="/" className="text-xl md:text-2xl font-serif tracking-tighter uppercase font-bold">
            Talent-Bridge<span className="text-accent">X</span>
          </Link>
        </div>

        {/* Desktop center nav */}
        <div className="hidden md:flex flex-1 justify-center space-x-10">
          <Link to="/learn" className="text-xs uppercase tracking-widest hover:text-accent transition-colors">Learning</Link>
          <Link to="/opportunities" className="text-xs uppercase tracking-widest hover:text-accent transition-colors">Opportunities</Link>
          <Link to="/community" className="text-xs uppercase tracking-widest hover:text-accent transition-colors">Community</Link>
        </div>

        {/* Desktop right actions */}
        <div className="hidden md:flex flex-1 justify-end space-x-8 items-center">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 group"
                aria-label="Account menu"
              >
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.name}
                    className="w-9 h-9 object-cover border border-border rounded-none"
                  />
                ) : (
                  <div className="w-9 h-9 bg-primary text-white flex items-center justify-center font-serif text-base">
                    {getInitials(user.name)}
                  </div>
                )}
                <span className="text-xs uppercase tracking-widest font-bold group-hover:text-accent transition-colors hidden lg:block">
                  {user.name?.split(' ')[0]}
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-12 w-48 bg-white border border-border shadow-lg z-50">
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest hover:bg-background transition-colors"
                  >
                    <User size={14} /> Profile
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest hover:bg-background transition-colors border-t border-border"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest hover:bg-background transition-colors border-t border-border text-left"
                  >
                    <LogOut size={14} /> Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="text-xs uppercase tracking-widest hover:text-accent transition-colors">Login</Link>
              <Link to="/register" className="btn-primary">Register Free</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-secondary hover:text-primary transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          id="navbar-mobile-toggle"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-6 pb-6 space-y-4">
          <Link to="/learn" className="block py-3 text-xs uppercase tracking-widest hover:text-accent transition-colors border-b border-border" onClick={() => setMobileOpen(false)}>Learning</Link>
          <Link to="/opportunities" className="block py-3 text-xs uppercase tracking-widest hover:text-accent transition-colors border-b border-border" onClick={() => setMobileOpen(false)}>Opportunities</Link>
          <Link to="/community" className="block py-3 text-xs uppercase tracking-widest hover:text-accent transition-colors border-b border-border" onClick={() => setMobileOpen(false)}>Community</Link>

          {user ? (
            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b border-border">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name} className="w-8 h-8 object-cover border border-border" />
                ) : (
                  <div className="w-8 h-8 bg-primary text-white flex items-center justify-center font-serif text-sm">
                    {getInitials(user.name)}
                  </div>
                )}
                <span className="text-xs uppercase tracking-widest font-bold">{user.name}</span>
              </div>
              <Link to="/dashboard" className="block text-xs uppercase tracking-widest hover:text-accent" onClick={() => setMobileOpen(false)}>Dashboard</Link>
              <Link to="/profile" className="block text-xs uppercase tracking-widest hover:text-accent" onClick={() => setMobileOpen(false)}>Profile</Link>
              <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="text-xs uppercase tracking-widest text-secondary hover:text-primary">Log Out</button>
            </div>
          ) : (
            <div className="flex gap-4 pt-2">
              <Link to="/login" className="text-xs uppercase tracking-widest hover:text-accent transition-colors" onClick={() => setMobileOpen(false)}>Login</Link>
              <Link to="/register" className="btn-primary text-sm" onClick={() => setMobileOpen(false)}>Register Free</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
