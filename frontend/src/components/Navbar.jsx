import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Zap, MessageSquare, Search, Moon, Sun, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axios';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isLanding = location.pathname === '/';
  
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
           (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [pendingCount, setPendingCount] = useState(0);
  const [unreadMsgCount, setUnreadMsgCount] = useState(0);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          // Fetch swap requests
          const res = await api.get('/swap/my');
          const pending = res.data.received.filter(req => req.status === 'pending');
          setPendingCount(pending.length);

          // Fetch unread messages count
          const msgRes = await api.get('/messages/unread/count');
          setUnreadMsgCount(msgRes.data.count);
        } catch (err) {
          console.error(err);
        }
      };
      fetchData();
      
      // Poll every 5 seconds for demo purposes
      const interval = setInterval(fetchData, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Profile', path: '/dashboard', icon: User },
    { name: 'Matches', path: '/matches', icon: Search },
    { name: 'Requests', path: '/requests', icon: Zap },
    { name: 'Messages', path: '/messages', icon: MessageSquare },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isLanding 
        ? 'bg-white/5 backdrop-blur-xl border-b border-white/10 dark:bg-[#0a0a0b]/80' 
        : 'bg-white/80 dark:bg-[#0a0a0b]/80 backdrop-blur-xl border-b border-slate-100 dark:border-white/10'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-1.5 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg shadow-lg shadow-primary-500/20 group-hover:rotate-6 transition-transform">
              <Zap className="text-white w-4 h-4" fill="white" />
            </div>
            <span className={`text-xl font-extrabold tracking-tight dark:text-white ${
              isLanding ? 'text-white' : 'text-slate-900'
            }`}>
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
                    className={`relative px-5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all duration-200 ${
                      isActive 
                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-500/20 dark:text-primary-400' 
                        : `text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 ${isLanding ? 'text-slate-300 hover:text-white' : ''}`
                    }`}
                  >
                    <Icon size={18} /> {link.name}
                    {link.name === 'Requests' && pendingCount > 0 && (
                      <span className="absolute top-1 right-2 w-4 h-4 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full animate-bounce">
                        {pendingCount}
                      </span>
                    )}
                    {link.name === 'Messages' && unreadMsgCount > 0 && (
                      <span className="absolute top-1 right-2 w-4 h-4 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full animate-bounce">
                        {unreadMsgCount}
                      </span>
                    )}
                    {isActive && (
                      <motion.div 
                        layoutId="nav-pill"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-500"
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          )}

          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/10 ${
                isLanding ? 'text-slate-300 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              <button 
                onClick={() => { logout(); navigate('/login'); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-semibold dark:text-slate-400 dark:hover:text-red-400 dark:hover:bg-white/5 ${
                  isLanding ? 'text-slate-300 hover:text-red-400 hover:bg-white/5' : 'text-slate-500 hover:text-red-600 hover:bg-red-50'
                }`}
              >
                <LogOut size={18} /> <span className="hidden sm:inline">Logout</span>
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className={`font-bold px-4 transition-colors dark:text-slate-300 dark:hover:text-white ${
                  isLanding ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-primary-600'
                }`}>Login</Link>
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
