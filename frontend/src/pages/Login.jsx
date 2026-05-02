import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen pt-14 flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-50 via-slate-50 to-secondary-50 dark:from-primary-900/20 dark:via-[#0a0a0b] dark:to-secondary-900/20">
      <div className="flex bg-white dark:bg-[#111113] rounded-3xl shadow-xl shadow-primary-500/5 dark:shadow-none w-full max-w-4xl border border-white dark:border-white/5 overflow-hidden">
        {/* Illustration Side */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary-600 to-secondary-700 p-8 flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-secondary-400/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <h3 className="text-2xl font-black leading-tight mb-2">Unlock New Potential Through Exchange.</h3>
            <p className="text-primary-100 text-sm font-medium opacity-80">Join 10,000+ professionals swapping skills daily.</p>
          </div>
          
          <img src="/illustration.png" alt="Illustration" className="relative z-10 w-4/5 mx-auto transform hover:scale-105 transition-transform duration-700" />
          
          <div className="relative z-10 pt-4 border-t border-white/10">
            <p className="text-xs font-bold opacity-60">© 2024 SkillXchange Inc.</p>
          </div>
        </div>

        {/* Form Side */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-1">Welcome back</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Please enter your details to sign in</p>
          </div>

          {error && <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-3 rounded-lg mb-6 text-center text-xs font-semibold border border-red-100 dark:border-red-500/20">{error}</motion.div>}
          
          <form onSubmit={handleSubmit} className="space-y-5">
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
              Sign In <ArrowRight size={16} />
            </Button>
          </form>
          
          <p className="text-center mt-8 text-slate-500 text-sm font-medium">
            New here? <Link to="/register" className="text-primary-600 font-bold hover:text-primary-700 underline decoration-2 underline-offset-4">Create account</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
