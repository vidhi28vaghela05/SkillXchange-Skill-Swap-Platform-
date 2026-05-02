import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Zap, MessageSquare, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: 'Profile', path: '/dashboard', icon: User },
    { name: 'Matches', path: '/matches', icon: Search },
    { name: 'Requests', path: '/requests', icon: MessageSquare },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2.5 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl shadow-lg shadow-primary-500/20 group-hover:rotate-6 transition-transform">
              <Zap className="text-white w-6 h-6" fill="white" />
            </div>
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
              SkillXchange
            </span>
          </Link>

          {user && (
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`px-5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all duration-200 ${
                      isActive 
                        ? 'bg-primary-50 text-primary-600' 
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon size={18} /> {link.name}
                    {isActive && (
                      <motion.div 
                        layoutId="nav-pill"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          )}

          <div className="flex items-center space-x-4">
            {user ? (
              <button 
                onClick={() => { logout(); navigate('/login'); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all font-semibold"
              >
                <LogOut size={18} /> <span className="hidden sm:inline">Logout</span>
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-slate-600 font-bold hover:text-primary-600 px-4">Login</Link>
                <Link to="/register" className="bg-primary-600 text-white px-6 py-2.5 rounded-2xl font-bold shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-all active:scale-95">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
