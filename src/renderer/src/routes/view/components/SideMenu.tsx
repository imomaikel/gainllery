import { motion } from 'framer-motion';

type TSideMenu = {
  animationDuration: number;
};
const SideMenu = ({ animationDuration }: TSideMenu) => {
  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: [0, 250] }}
      exit={{ width: [250, 0] }}
      transition={{ duration: animationDuration, type: 'tween' }}
      className="bg-secondary"
    ></motion.div>
  );
};

export default SideMenu;
