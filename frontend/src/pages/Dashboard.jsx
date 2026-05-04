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
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('avatar1');
  const [newOffered, setNewOffered] = useState('');
  const [newWanted, setNewWanted] = useState('');
  const [saving, setSaving] = useState(false);
  const [connectionsCount, setConnectionsCount] = useState(0);

  useEffect(() => {
    if (user) {
      setSkillsOffered(user.skillsOffered || []);
      setSkillsWanted(user.skillsWanted || []);
      setBio(user.bio || 'Passionate skill swapper!');
      setAvatar(user.avatar || 'avatar1');
      
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
      const res = await api.put('/users/profile', { 
        skillsOffered, 
        skillsWanted,
        bio,
        avatar
      });
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

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {/* Avatar & Bio */}
        <Card className="md:col-span-1 flex flex-col items-center text-center p-6">
          <div className="relative mb-4 group">
             <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 p-1 shadow-xl shadow-primary-500/20">
                <img 
                  src={avatar.startsWith('data:') ? avatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatar}`} 
                  alt="Avatar" 
                  className="w-full h-full rounded-full bg-white dark:bg-[#111113] object-cover"
                />
             </div>
             <label className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setAvatar(reader.result);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <div className="flex flex-col items-center">
                  <Plus size={20} className="text-white mb-1" />
                  <span className="text-[8px] text-white font-black uppercase">Upload</span>
                </div>
             </label>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1">{user?.name}</h2>
          <p className="text-[10px] font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-4">Level {level} {getRankName(level)}</p>
          
          <div className="w-full space-y-3">
             <div className="text-left">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1 block">Your Bio</label>
                <textarea 
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell people about your expertise..."
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-xs font-medium dark:text-slate-300 focus:ring-2 focus:ring-primary-500 focus:outline-none min-h-[80px] resize-none"
                />
             </div>
             <div className="text-left">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2 block">Choose Avatar</label>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                   {['Felix', 'Aneka', 'Vivian', 'Max', 'Luna'].map(seed => (
                      <button 
                        key={seed}
                        onClick={() => setAvatar(seed)}
                        className={`flex-shrink-0 w-10 h-10 rounded-lg border-2 transition-all ${
                          avatar === seed ? 'border-primary-500 scale-110' : 'border-transparent opacity-50 hover:opacity-100'
                        }`}
                      >
                         <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`} alt={seed} className="w-full h-full rounded-lg" />
                      </button>
                   ))}
                </div>
             </div>
          </div>
        </Card>

        {/* Gamification Stats */}
        <div className="md:col-span-2 space-y-6">
           <div className="bg-gradient-to-r from-fuchsia-600 to-indigo-600 rounded-3xl p-1 relative overflow-hidden shadow-xl shadow-indigo-500/20 h-full">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
              <div className="bg-[#111113]/90 backdrop-blur-xl rounded-[1.4rem] p-6 h-full flex flex-col justify-between relative z-10">
                 <div className="flex justify-between items-start mb-4">
                    <div>
                       <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Experience</p>
                       <h3 className="text-3xl font-black text-white">{score} <span className="text-sm font-normal text-slate-500">XP</span></h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg shadow-yellow-400/20">
                       <Trophy size={24} className="text-white" />
                    </div>
                 </div>
                 
                 <div className="space-y-4">
                    <div>
                       <div className="flex justify-between text-[10px] font-black text-slate-400 mb-2 uppercase tracking-wider">
                          <span>Progress to Level {level + 1}</span>
                          <span className="text-indigo-400">{progressToNext}%</span>
                       </div>
                       <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progressToNext}%` }}
                            transition={{ duration: 1.5 }}
                            className="h-full bg-gradient-to-r from-fuchsia-500 to-indigo-500"
                          />
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                       <div className="bg-white/5 p-3 rounded-2xl border border-white/5 text-center">
                          <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Level</p>
                          <p className="text-lg font-black text-white">{level}</p>
                       </div>
                       <div className="bg-white/5 p-3 rounded-2xl border border-white/5 text-center">
                          <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Skills</p>
                          <p className="text-lg font-black text-white">{skillsOffered.length + skillsWanted.length}</p>
                       </div>
                       <div className="bg-white/5 p-3 rounded-2xl border border-white/5 text-center">
                          <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Swaps</p>
                          <p className="text-lg font-black text-white">{connectionsCount}</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

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
