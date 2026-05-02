import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, Shield, Users, ArrowRight, Star, CheckCircle, Sparkles, User } from 'lucide-react';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { user } = useAuth();
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0, scale: 0.95 },
    visible: { y: 0, opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 20 } }
  };

  return (
    <div className="relative overflow-hidden bg-[#030014] selection:bg-fuchsia-500/30 selection:text-fuchsia-200 min-h-screen">
      {/* Cosmic Rift Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Deep Space Noise */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-10"></div>
        
        {/* Starfield */}
        <div className="absolute inset-0 opacity-40 animate-pulse" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '50px 50px', animationDuration: '4s' }}></div>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.6) 1.5px, transparent 1.5px)', backgroundSize: '120px 120px', transform: 'rotate(25deg)' }}></div>
        
        {/* The Rifts (Nebula Clouds) */}
        <div className="absolute top-[10%] left-[-20%] w-[80%] h-[50%] bg-fuchsia-700/20 rounded-[100%] blur-[120px] -rotate-12 animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-[-10%] right-[-20%] w-[80%] h-[50%] bg-indigo-700/20 rounded-[100%] blur-[120px] rotate-12 animate-pulse" style={{ animationDuration: '12s' }}></div>
        <div className="absolute top-[40%] left-[20%] w-[60%] h-[60%] bg-violet-900/30 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '15s' }}></div>
        
        {/* The Cosmic Tear (Sharp glowing diagonal lines) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.4, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[2px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent -rotate-45 blur-[1px]"
        ></motion.div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 3, delay: 0.5 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[15px] bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent -rotate-45 blur-[30px]"
        ></motion.div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-24 px-4 min-h-[90vh] flex flex-col justify-center">
        <motion.div style={{ y: yHero, opacity: opacityHero }} className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full text-primary-400 text-xs font-bold mb-8 shadow-2xl shadow-primary-500/10 hover:bg-white/10 transition-colors cursor-default"
          >
            <Sparkles size={14} className="animate-pulse text-yellow-400" />
            <span className="tracking-wide">Powered by Advanced Matching AI</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl font-black text-white leading-tight mb-8 tracking-tighter"
          >
            Exchange <span className="relative inline-block">
              <span className="absolute -inset-2 bg-gradient-to-r from-fuchsia-600 to-cyan-600 blur-2xl opacity-40 animate-pulse"></span>
              <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-white to-cyan-400">Skills</span>
            </span>, <br /> Not Money.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed"
          >
            Unlock your true potential by connecting with global experts. Share your mastery, learn what you desire—completely free.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            {user ? (
              <Link to="/dashboard">
                <Button className="px-8 py-4 text-base rounded-2xl group shadow-[0_0_40px_rgba(217,70,239,0.4)] hover:shadow-[0_0_60px_rgba(217,70,239,0.6)] !bg-gradient-to-r !from-fuchsia-600 !to-indigo-600 border-none transition-all overflow-hidden relative">
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
                  <span className="relative flex items-center gap-2">Go to Dashboard <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} /></span>
                </Button>
              </Link>
            ) : (
              <Link to="/register">
                <Button className="px-8 py-4 text-base rounded-2xl group shadow-[0_0_40px_rgba(217,70,239,0.4)] hover:shadow-[0_0_60px_rgba(217,70,239,0.6)] !bg-gradient-to-r !from-fuchsia-600 !to-indigo-600 border-none transition-all overflow-hidden relative">
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
                  <span className="relative flex items-center gap-2">Get Started Free <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} /></span>
                </Button>
              </Link>
            )}
            <Link to={user ? "/matches" : "/login"}>
              <button className="px-8 py-4 text-base font-bold text-white border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all shadow-xl">
                View Live Matches
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats/Social Proof - Infinite Scroll simulation */}
      <section className="relative z-10 py-10 border-y border-white/5 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-around gap-8 md:gap-16 opacity-60">
          <motion.div whileHover={{ scale: 1.1, opacity: 1 }} className="flex items-center gap-3 text-white font-bold text-lg cursor-pointer transition-all"><Zap className="text-yellow-400" size={24} /> Fast Matching</motion.div>
          <motion.div whileHover={{ scale: 1.1, opacity: 1 }} className="flex items-center gap-3 text-white font-bold text-lg cursor-pointer transition-all"><Shield className="text-emerald-400" size={24} /> Secure Swaps</motion.div>
          <motion.div whileHover={{ scale: 1.1, opacity: 1 }} className="flex items-center gap-3 text-white font-bold text-lg cursor-pointer transition-all"><Users className="text-blue-400" size={24} /> 50k+ Community</motion.div>
        </div>
      </section>

      {/* Features Section (Forge UI Style Cards) */}
      <section className="relative z-10 py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Built for the Modern Learner.</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Everything you need to master new skills through collaboration, wrapped in a beautiful, intuitive interface.</p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              { title: 'Intelligent Matching', desc: 'Our algorithm finds the perfect mutual exchange based on your specific needs and timeline.', icon: Zap, color: 'text-primary-400', bg: 'bg-primary-500/10', border: 'group-hover:border-primary-500/50' },
              { title: 'Community Verified', desc: 'Connect with confidence through our verified user system, detailed profiles, and ratings.', icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10', border: 'group-hover:border-green-500/50' },
              { title: 'Limitless Growth', desc: 'Swap any skill imaginable—from Advanced React Coding to Authentic Italian Cooking.', icon: Star, color: 'text-secondary-400', bg: 'bg-secondary-500/10', border: 'group-hover:border-secondary-500/50' }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                variants={itemVariants}
                className={`relative p-8 bg-[#111113] border border-white/5 rounded-3xl transition-all duration-500 group hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/50 ${feature.border} overflow-hidden`}
              >
                {/* Hover Glow Effect */}
                <div className={`absolute top-0 right-0 w-32 h-32 ${feature.bg} blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <div className={`w-14 h-14 rounded-2xl bg-[#1a1a1d] border border-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-inner ${feature.color}`}>
                  <feature.icon size={28} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it Works (Vengence UI / Lora UI Blocks) */}
      <section className="relative z-10 py-32 px-4 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="md:w-1/2"
            >
              <h2 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight tracking-tight">Master anything <br /> in 3 simple steps.</h2>
              <div className="space-y-10">
                {[
                  { step: '01', title: 'List your Skills', desc: 'Tell the world what you know and what you want to learn with precision.' },
                  { step: '02', title: 'Find a Match', desc: 'Discover experts who need your skills and have exactly what you need.' },
                  { step: '03', title: 'Start Swapping', desc: 'Connect seamlessly, schedule a session, and grow together instantly.' }
                ].map((item, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.2 }}
                    viewport={{ once: true }}
                    key={i} 
                    className="flex gap-6 group"
                  >
                    <div className="relative">
                      <span className="text-transparent bg-clip-text bg-gradient-to-b from-primary-400 to-primary-800 font-black text-3xl group-hover:scale-110 transition-transform inline-block">{item.step}</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2 group-hover:text-primary-300 transition-colors">{item.title}</h4>
                      <p className="text-slate-400 text-base leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: 'spring', duration: 1.5 }}
              viewport={{ once: true }}
              className="md:w-1/2 relative mt-8 md:mt-0 w-full"
            >
               <div className="absolute inset-0 bg-primary-600/20 blur-[100px] rounded-full animate-pulse"></div>
               {/* Abstract UI representation instead of a missing image */}
               <div className="relative z-10 bg-[#111113] border border-white/10 rounded-[2rem] p-8 shadow-2xl backdrop-blur-xl rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400"><User size={24} /></div>
                    <div className="flex-1">
                      <div className="h-4 bg-white/10 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-white/5 rounded w-32"></div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400"><CheckCircle size={16} /></div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-16 bg-white/5 rounded-2xl border border-white/5"></div>
                    <div className="h-16 bg-white/5 rounded-2xl border border-white/5"></div>
                  </div>
                  <div className="mt-8 flex gap-4">
                    <div className="h-10 bg-primary-600 rounded-xl w-full"></div>
                  </div>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Footer (Animate UI Style) */}
      <section className="relative z-10 py-32 px-4 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-[#0a0a0b] border border-white/10 p-16 rounded-[3rem] shadow-2xl overflow-hidden relative group"
        >
          {/* Animated gradient background sweep */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 via-secondary-600/20 to-primary-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[length:200%_auto] animate-gradient-x"></div>
          
          <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-primary-600/30 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-50%] left-[-10%] w-96 h-96 bg-secondary-600/30 rounded-full blur-[100px]"></div>
          
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 relative z-10 tracking-tight">Ready to join the <br /> skill revolution?</h2>
          <p className="text-slate-400 text-lg mb-10 relative z-10 max-w-lg mx-auto">Join thousands of professionals already accelerating their careers through mutual skill exchange.</p>
          
          {user ? (
            <Link to="/dashboard" className="relative z-10 inline-block">
              <Button className="px-10 py-4 text-lg bg-white !text-primary-900 hover:bg-slate-100 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] transition-all transform hover:-translate-y-1 rounded-2xl font-black">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/register" className="relative z-10 inline-block">
              <Button className="px-10 py-4 text-lg bg-white !text-primary-900 hover:bg-slate-100 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] transition-all transform hover:-translate-y-1 rounded-2xl font-black">
                Join Now — It's Free
              </Button>
            </Link>
          )}
        </motion.div>
      </section>

      <footer className="relative z-10 py-10 text-center text-slate-500 border-t border-white/5 bg-[#050505]">
        <p className="font-bold text-sm tracking-wide">© 2026 SkillXchange. Built for the future of learning.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
