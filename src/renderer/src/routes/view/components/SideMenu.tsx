import { motion } from 'framer-motion';

const SideMenu = () => {
  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: [0, 300] }}
      exit={{ width: [300, 0] }}
      transition={{ duration: 0.2, type: 'tween' }}
    ></motion.div>
  );
};

export default SideMenu;
