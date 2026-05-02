import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { Plus, X, Save, Sparkles, Zap } from 'lucide-react';
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

  useEffect(() => {
    if (user) {
      setSkillsOffered(user.skillsOffered || []);
      setSkillsWanted(user.skillsWanted || []);
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put('/users/profile', { skillsOffered, skillsWanted });
      setUser(res.data);
      // Soft notification would be better, but let's stick to alert for simplicity in this prototype
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
