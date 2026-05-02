import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { Plus, X, Save, Sparkles, Zap, Trophy, Award } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';

const Dashboard = () => {
  const { user, setUser } = useAuth();
  const [skillsOffered, setSkillsOffered] = useState([]);
  const [skillsWanted, setSkillsWanted] = useState([]);
  const [newOffered, setNewOffered] = useState('');
  const [newWanted, setNewWanted] = useState('');
  const [saving, setSaving] = useState(false);
  const [connectionsCount, setConnectionsCount] = useState(0);

  useEffect(() => {
    if (user) {
      setSkillsOffered(user.skillsOffered || []);
      setSkillsWanted(user.skillsWanted || []);
      
      // Fetch connections to calculate score
      const fetchStats = async () => {
        try {
          const res = await api.get('/swap/my');
          const acceptedSent = res.data.sent.filter(req => req.status === 'accepted');
          const acceptedReceived = res.data.received.filter(req => req.status === 'accepted');
          setConnectionsCount(acceptedSent.length + acceptedReceived.length);
        } catch (err) {
          console.error(err);
        }
      };
      fetchStats();
    }
  }, [user]);

  // Gamification logic
  const score = (skillsOffered.length * 50) + (skillsWanted.length * 20) + (connectionsCount * 150);
  const level = Math.floor(score / 500) + 1;
  const progressToNext = (score % 500) / 5; // 500 max per level, so /5 gives percentage 0-100

  const getRankName = (lvl) => {
    if (lvl === 1) return 'Novice Swapper';
    if (lvl === 2) return 'Skill Seeker';
    if (lvl === 3) return 'Knowledge Trader';
    if (lvl >= 4) return 'Master Exchanger';
    return 'Beginner';
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put('/users/profile', { skillsOffered, skillsWanted });
      setUser(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const addSkill = (type) => {
    if (type === 'offered' && newOffered) {
      if (!skillsOffered.includes(newOffered)) {
        setSkillsOffered([...skillsOffered, newOffered]);
      }
      setNewOffered('');
    } else if (type === 'wanted' && newWanted) {
      if (!skillsWanted.includes(newWanted)) {
        setSkillsWanted([...skillsWanted, newWanted]);
      }
      setNewWanted('');
    }
  };

  const removeSkill = (type, skill) => {
    if (type === 'offered') {
      setSkillsOffered(skillsOffered.filter(s => s !== skill));
    } else {
      setSkillsWanted(skillsWanted.filter(s => s !== skill));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-24 pb-10">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
      >
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">
            Welcome back, <span className="text-primary-600 dark:text-primary-400">{user?.name}</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Ready to exchange some expertise today?</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="w-full md:w-auto text-sm">
          <Save size={16} /> {saving ? 'Updating...' : 'Save Profile'}
        </Button>
      </motion.div>

      {/* Gamification Bar */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-10 bg-gradient-to-r from-fuchsia-600 to-indigo-600 rounded-3xl p-1 relative overflow-hidden shadow-2xl shadow-indigo-500/20"
      >
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="bg-[#111113]/90 backdrop-blur-xl rounded-[1.4rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-center gap-5 w-full md:w-auto">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30 border-4 border-[#111113]">
              <Trophy className="text-white drop-shadow-md" size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-white/10 text-white text-[10px] font-black px-2 py-0.5 rounded-full border border-white/10 uppercase tracking-wider">Level {level}</span>
                <h3 className="text-white font-extrabold text-lg flex items-center gap-1">
                  {getRankName(level)} <Award size={16} className="text-yellow-400" />
                </h3>
              </div>
              <p className="text-slate-400 text-sm font-medium">Total XP: <span className="text-white font-bold">{score}</span></p>
            </div>
          </div>

          <div className="w-full md:flex-1 max-w-md">
            <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
              <span>Progress to Level {level + 1}</span>
              <span className="text-indigo-400">{progressToNext}%</span>
            </div>
            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressToNext}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 rounded-full relative"
              >
                <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite] -translate-x-full" style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }}></div>
              </motion.div>
            </div>
            
            <div className="mt-4">
              <button 
                onClick={() => document.getElementById('xp-rules').classList.toggle('hidden')}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 font-bold ml-auto transition-colors"
              >
                How to earn XP?
              </button>
              <div id="xp-rules" className="hidden mt-3 bg-white/5 border border-white/10 rounded-xl p-3 text-[10px] sm:text-xs">
                <h4 className="text-white font-bold mb-2">Quests & Rewards:</h4>
                <ul className="space-y-1.5">
                  <li className="flex justify-between items-center">
                    <span className="text-slate-300">🎯 Add a Skill you offer</span>
                    <span className="text-green-400 font-bold">+50 XP</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-slate-300">📚 Add a Skill you want</span>
                    <span className="text-green-400 font-bold">+20 XP</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-slate-300">🤝 Make a new connection</span>
                    <span className="text-green-400 font-bold">+150 XP</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Skills Offered */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 rounded-lg">
              <Sparkles size={18} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Skills I Offer</h3>
          </div>
          <Card className="p-5">
            <div className="flex gap-2 mb-6">
              <Input 
                placeholder="e.g. Graphic Design"
                value={newOffered}
                onChange={(e) => setNewOffered(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkill('offered')}
                className="!bg-white dark:!bg-white/5 dark:text-white dark:border-white/10"
              />
              <button 
                onClick={() => addSkill('offered')} 
                className="p-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-md shadow-primary-500/20 active:scale-95"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skillsOffered.length === 0 ? (
                <p className="text-slate-400 dark:text-slate-500 text-sm italic">No skills added yet...</p>
              ) : (
                skillsOffered.map(skill => (
                  <motion.span 
                    layout
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    key={skill} 
                    className="bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold text-xs border border-primary-100 dark:border-primary-500/20 group hover:bg-primary-100 transition-colors"
                  >
                    {skill}
                    <X 
                      size={14} 
                      className="cursor-pointer text-primary-300 dark:text-primary-500/50 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" 
                      onClick={() => removeSkill('offered', skill)} 
                    />
                  </motion.span>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Skills Wanted */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-secondary-100 dark:bg-secondary-500/20 text-secondary-600 dark:text-secondary-400 rounded-lg">
              <Zap size={18} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Skills I Want</h3>
          </div>
          <Card className="p-5">
            <div className="flex gap-2 mb-6">
              <Input 
                placeholder="e.g. French Speaking"
                value={newWanted}
                onChange={(e) => setNewWanted(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkill('wanted')}
                className="!bg-white dark:!bg-white/5 dark:text-white dark:border-white/10"
              />
              <button 
                onClick={() => addSkill('wanted')} 
                className="p-2.5 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-all shadow-md shadow-secondary-500/20 active:scale-95"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skillsWanted.length === 0 ? (
                <p className="text-slate-400 dark:text-slate-500 text-sm italic">No skills added yet...</p>
              ) : (
                skillsWanted.map(skill => (
                  <motion.span 
                    layout
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    key={skill} 
                    className="bg-secondary-50 dark:bg-secondary-500/10 text-secondary-700 dark:text-secondary-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold text-xs border border-secondary-100 dark:border-secondary-500/20 group hover:bg-secondary-100 transition-colors"
                  >
                    {skill}
                    <X 
                      size={14} 
                      className="cursor-pointer text-secondary-300 dark:text-secondary-500/50 group-hover:text-secondary-600 dark:group-hover:text-secondary-400 transition-colors" 
                      onClick={() => removeSkill('wanted', skill)} 
                    />
                  </motion.span>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
