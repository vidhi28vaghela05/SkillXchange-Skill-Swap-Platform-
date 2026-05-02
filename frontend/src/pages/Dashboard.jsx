import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { Plus, X, Save, Sparkles } from 'lucide-react';
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
    <div className="max-w-5xl mx-auto px-4 py-16">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6"
      >
        <div>
          <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
            Welcome back, <span className="text-primary-600">{user?.name}</span>
          </h1>
          <p className="text-slate-500 text-lg font-medium">Ready to exchange some expertise today?</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="w-full md:w-auto h-14 px-8 text-lg">
          <Save size={20} /> {saving ? 'Updating...' : 'Save Profile'}
        </Button>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Skills Offered */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary-100 text-primary-600 rounded-xl">
              <Sparkles size={24} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Skills I Offer</h3>
          </div>
          <Card className="p-8">
            <div className="flex gap-3 mb-8">
              <Input 
                placeholder="e.g. Graphic Design"
                value={newOffered}
                onChange={(e) => setNewOffered(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkill('offered')}
                className="!bg-white"
              />
              <button 
                onClick={() => addSkill('offered')} 
                className="p-4 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20 active:scale-95"
              >
                <Plus size={24} />
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {skillsOffered.length === 0 ? (
                <p className="text-slate-400 italic">No skills added yet...</p>
              ) : (
                skillsOffered.map(skill => (
                  <motion.span 
                    layout
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    key={skill} 
                    className="bg-primary-50 text-primary-700 px-5 py-2.5 rounded-2xl flex items-center gap-2 font-bold text-sm border border-primary-100 group hover:bg-primary-100 transition-colors"
                  >
                    {skill}
                    <X 
                      size={16} 
                      className="cursor-pointer text-primary-300 group-hover:text-primary-600 transition-colors" 
                      onClick={() => removeSkill('offered', skill)} 
                    />
                  </motion.span>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Skills Wanted */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-secondary-100 text-secondary-600 rounded-xl">
              <Zap size={24} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Skills I Want</h3>
          </div>
          <Card className="p-8">
            <div className="flex gap-3 mb-8">
              <Input 
                placeholder="e.g. French Speaking"
                value={newWanted}
                onChange={(e) => setNewWanted(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkill('wanted')}
                className="!bg-white"
              />
              <button 
                onClick={() => addSkill('wanted')} 
                className="p-4 bg-secondary-600 text-white rounded-2xl hover:bg-secondary-700 transition-all shadow-lg shadow-secondary-500/20 active:scale-95"
              >
                <Plus size={24} />
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {skillsWanted.length === 0 ? (
                <p className="text-slate-400 italic">No skills added yet...</p>
              ) : (
                skillsWanted.map(skill => (
                  <motion.span 
                    layout
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    key={skill} 
                    className="bg-secondary-50 text-secondary-700 px-5 py-2.5 rounded-2xl flex items-center gap-2 font-bold text-sm border border-secondary-100 group hover:bg-secondary-100 transition-colors"
                  >
                    {skill}
                    <X 
                      size={16} 
                      className="cursor-pointer text-secondary-300 group-hover:text-secondary-600 transition-colors" 
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
