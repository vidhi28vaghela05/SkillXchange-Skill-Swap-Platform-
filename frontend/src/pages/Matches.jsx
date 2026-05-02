import { useState, useEffect } from 'react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, Search, User, ExternalLink, Heart } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sentRequests, setSentRequests] = useState([]);
  const [bookmarks, setBookmarks] = useState(() => JSON.parse(localStorage.getItem('bookmarks') || '[]'));

  const [searchTerm, setSearchTerm] = useState('');

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

  const sendRequest = async (toUserId) => {
    try {
      await api.post('/swap/request', { toUserId });
      setSentRequests([...sentRequests, toUserId]);
    } catch (err) {
      alert('Failed to send request');
    }
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
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/40 dark:to-secondary-900/40 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400 font-black text-xl shadow-inner">
                    {match.name.charAt(0)}
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
                    onClick={() => sendRequest(match._id)}
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
    </div>
  );
};

export default Matches;
