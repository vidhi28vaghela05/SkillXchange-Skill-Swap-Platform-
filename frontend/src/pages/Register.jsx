import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Registration failed. Email might be in use.');
    }
  };

  return (
    <div className="min-h-screen pt-14 flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-50 via-slate-50 to-secondary-50 dark:from-primary-900/20 dark:via-[#0a0a0b] dark:to-secondary-900/20">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-[#111113] p-6 md:p-8 rounded-2xl shadow-xl shadow-primary-500/5 dark:shadow-none w-full max-w-sm border border-white dark:border-white/5"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1">Create Account</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Join our community of skill swappers</p>
        </div>

        {error && <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-3 rounded-lg mb-6 text-center text-xs font-semibold border border-red-100 dark:border-red-500/20">{error}</motion.div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            icon={User} 
            label="Full Name" 
            type="text" 
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input 
            icon={Mail} 
            label="Email Address" 
            type="email" 
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input 
            icon={Lock} 
            label="Password" 
            type="password" 
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full py-2.5 mt-2">
            Get Started <ArrowRight size={16} />
          </Button>
        </form>
        
        <p className="text-center mt-6 text-slate-500 text-sm font-medium">
          Already have an account? <Link to="/login" className="text-primary-600 font-bold hover:text-primary-700 underline decoration-2 underline-offset-4">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
