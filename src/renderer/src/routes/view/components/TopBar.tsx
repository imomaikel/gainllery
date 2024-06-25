import { motion } from 'framer-motion';

const TopBar = () => {
  return (
    <motion.div
      initial={{ height: 0 }}
      animate={{ height: [0, 25] }}
      exit={{ height: [25, 0] }}
      transition={{ duration: 0.2, type: 'tween' }}
      className="bg-secondary"
    ></motion.div>
  );
};

export default TopBar;
