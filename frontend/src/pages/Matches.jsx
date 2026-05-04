import { useState, useEffect } from 'react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, Search, User, ExternalLink, Heart } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { X, ArrowRight } from 'lucide-react';

const Matches = () => {
  const { user: currentUser } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sentRequests, setSentRequests] = useState([]);
  const [bookmarks, setBookmarks] = useState(() => JSON.parse(localStorage.getItem('bookmarks') || '[]'));
  const [searchTerm, setSearchTerm] = useState('');
  
  // Selection state
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [skillOffered, setSkillOffered] = useState('');
  const [skillWanted, setSkillWanted] = useState('');

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const [resMatches, resRequests] = await Promise.all([
          api.get('/users/match'),
          api.get('/swap/my')
        ]);
        setMatches(resMatches.data);
        setSentRequests(resRequests.data.sent.map(r => r.toUser._id));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const toggleBookmark = (id) => {
    if (bookmarks.includes(id)) {
      setBookmarks(bookmarks.filter(b => b !== id));
    } else {
      setBookmarks([...bookmarks, id]);
    }
  };

  const sendRequest = async () => {
    if (!skillOffered || !skillWanted) return alert('Please select both skills');
    try {
      await api.post('/swap/request', { 
        toUserId: selectedUser._id,
        skillOffered,
        skillWanted
      });
      setSentRequests([...sentRequests, selectedUser._id]);
      setShowModal(false);
      setSelectedUser(null);
      setSkillOffered('');
      setSkillWanted('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send request');
    }
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
    // Auto-select if only one option exists
    if (currentUser?.skillsOffered?.length === 1) setSkillOffered(currentUser.skillsOffered[0]);
    if (user.skillsOffered?.length === 1) setSkillWanted(user.skillsOffered[0]);
  };

  const filteredMatches = matches.filter(match => {
    const term = searchTerm.toLowerCase();
    return (
      match.name.toLowerCase().includes(term) ||
      match.skillsOffered.some(s => s.toLowerCase().includes(term)) ||
      match.skillsWanted.some(s => s.toLowerCase().includes(term))
    );
  });

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-500 font-bold animate-pulse">Finding your perfect matches...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 pt-24 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">Discovery</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Connect with people who have exactly what you need.</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            placeholder="Search skills or names..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 dark:text-white rounded-lg py-2.5 pl-10 pr-3 shadow-soft dark:shadow-none focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm"
          />
        </div>
      </div>

      {filteredMatches.length === 0 ? (
        <Card className="p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
            <Search className="text-slate-300 dark:text-slate-500 w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-1">No matches found</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto text-sm">
            {matches.length === 0 
              ? "Try adding more skills to your profile to increase your chances of finding a match!"
              : "No users matched your specific search criteria."}
          </p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.map((match, index) => {
            const isBookmarked = bookmarks.includes(match._id);
            return (
            <Card 
              key={match._id}
              transition={{ delay: index * 0.1 }}
              className="group !p-0 flex flex-col h-full relative overflow-hidden"
            >
              {isBookmarked && (
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-rose-500/10 rounded-full blur-xl pointer-events-none"></div>
              )}
              <div className="p-5 flex-grow relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/40 dark:to-secondary-900/40 rounded-lg overflow-hidden flex items-center justify-center text-primary-600 dark:text-primary-400 font-black text-xl shadow-inner">
                    {match.avatar ? (
                      <img 
                        src={match.avatar.startsWith('data:') ? match.avatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=${match.avatar}`} 
                        alt={match.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      match.name.charAt(0)
                    )}
                  </div>
                  <motion.button 
                    whileTap={{ scale: 0.8 }}
                    onClick={() => toggleBookmark(match._id)}
                    className={`p-2 rounded-full transition-colors ${
                      isBookmarked 
                        ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-500' 
                        : 'bg-slate-50 dark:bg-white/5 text-slate-400 dark:text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10'
                    }`}
                  >
                    <Heart size={18} className={isBookmarked ? 'fill-rose-500' : ''} />
                  </motion.button>
                </div>
                
                <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-0.5">{match.name}</h3>
                <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold mb-5">{match.email}</p>
                
                <div className="space-y-4 mb-4">
                  <div>
                    <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em] block mb-2">Offers</span>
                    <div className="flex flex-wrap gap-1.5">
                      {match.skillsOffered.map(s => (
                        <span key={s} className="bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 text-[10px] px-2 py-1 rounded font-bold border border-slate-100 dark:border-white/5">{s}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em] block mb-2">Wants</span>
                    <div className="flex flex-wrap gap-1.5">
                      {match.skillsWanted.map(s => (
                        <span key={s} className="bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 text-[10px] px-2 py-1 rounded font-bold border border-primary-100 dark:border-primary-500/20">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 mt-auto">
                {sentRequests.includes(match._id) ? (
                  <div className="w-full py-2.5 bg-slate-50 dark:bg-white/5 text-slate-400 dark:text-slate-500 rounded-lg flex items-center justify-center gap-1.5 font-bold cursor-not-allowed border border-slate-100 dark:border-white/5 text-sm">
                    <CheckCircle size={16} /> Request Sent
                  </div>
                ) : (
                  <Button 
                    onClick={() => openModal(match)}
                    className="w-full py-2.5 rounded-lg text-sm"
                  >
                    Connect <Send size={14} />
                  </Button>
                )}
              </div>
            </Card>
            );
          })}
        </div>
      )}

      {/* Skill Selection Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 w-full max-w-md rounded-2xl shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Customize Swap</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 block">I will teach:</label>
                  <select 
                    value={skillOffered}
                    onChange={(e) => setSkillOffered(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 dark:text-white rounded-xl py-3 px-4 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select a skill...</option>
                    {currentUser?.skillsOffered?.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="flex justify-center">
                  <div className="p-2 bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 rounded-full">
                    <ArrowRight size={20} />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 block">I want to learn:</label>
                  <select 
                    value={skillWanted}
                    onChange={(e) => setSkillWanted(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 dark:text-white rounded-xl py-3 px-4 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select a skill...</option>
                    {selectedUser?.skillsOffered?.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <Button onClick={sendRequest} className="w-full py-4 text-base font-black shadow-xl shadow-primary-500/30">
                  Send Swap Request
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Matches;
