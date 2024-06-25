import { motion } from 'framer-motion';

const SideMenu = () => {
  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: [0, 250] }}
      exit={{ width: [250, 0] }}
      transition={{ duration: 0.2, type: 'tween' }}
      className="bg-secondary"
    ></motion.div>
  );
};

export default SideMenu;
