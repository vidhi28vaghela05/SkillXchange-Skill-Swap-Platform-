import { motion } from 'framer-motion';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/20',
    secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50',
    accent: 'bg-accent-500 text-white hover:bg-green-600 shadow-lg shadow-accent-500/20',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
  };

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={`px-6 py-2.5 rounded-xl font-semibold btn-transition flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
