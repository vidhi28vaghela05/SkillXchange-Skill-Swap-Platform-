import { motion } from 'framer-motion';

const Card = ({ children, className = '', ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`glass-card p-5 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
