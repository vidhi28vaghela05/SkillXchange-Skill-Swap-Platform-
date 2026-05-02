import { useState, useEffect } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { Send, CheckCircle, Search, User, ExternalLink } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sentRequests, setSentRequests] = useState([]);

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

  const sendRequest = async (toUserId) => {
    try {
      await api.post('/swap/request', { toUserId });
      setSentRequests([...sentRequests, toUserId]);
    } catch (err) {
      alert('Failed to send request');
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-500 font-bold animate-pulse">Finding your perfect matches...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
        <div>
          <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-3">Discovery</h1>
          <p className="text-slate-500 text-lg font-medium">Connect with people who have exactly what you need.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            placeholder="Search skills..." 
            className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 shadow-soft focus:ring-2 focus:ring-primary-500 focus:outline-none"
          />
        </div>
      </div>

      {matches.length === 0 ? (
        <Card className="p-20 text-center flex flex-col items-center">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <Search className="text-slate-300 w-12 h-12" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">No matches found yet</h3>
          <p className="text-slate-500 max-w-sm mx-auto">Try adding more skills to your profile to increase your chances of finding a match!</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {matches.map((match, index) => (
            <Card 
              key={match._id}
              transition={{ delay: index * 0.1 }}
              className="group !p-0"
            >
              <div className="p-8 pb-0">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center text-primary-600 font-black text-2xl shadow-inner">
                    {match.name.charAt(0)}
                  </div>
                  <div className="bg-primary-50 text-primary-600 p-2 rounded-xl group-hover:rotate-12 transition-transform">
                    <ExternalLink size={20} />
                  </div>
                </div>
                
                <h3 className="text-2xl font-black text-slate-800 mb-1">{match.name}</h3>
                <p className="text-slate-400 text-sm font-semibold mb-8">{match.email}</p>
                
                <div className="space-y-6 mb-8">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-3">Offers</span>
                    <div className="flex flex-wrap gap-2">
                      {match.skillsOffered.map(s => (
                        <span key={s} className="bg-slate-50 text-slate-600 text-xs px-3 py-1.5 rounded-lg font-bold border border-slate-100">{s}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-3">Wants</span>
                    <div className="flex flex-wrap gap-2">
                      {match.skillsWanted.map(s => (
                        <span key={s} className="bg-primary-50 text-primary-600 text-xs px-3 py-1.5 rounded-lg font-bold border border-primary-100">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 pt-0 mt-auto">
                {sentRequests.includes(match._id) ? (
                  <div className="w-full py-4 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center gap-2 font-bold cursor-not-allowed border border-slate-100">
                    <CheckCircle size={20} /> Request Sent
                  </div>
                ) : (
                  <Button 
                    onClick={() => sendRequest(match._id)}
                    className="w-full py-4 rounded-2xl text-base"
                  >
                    Connect <Send size={18} />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Matches;
