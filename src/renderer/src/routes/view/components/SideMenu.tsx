import FavoriteDirectories from './FavoriteDirectories';
import { motion } from 'framer-motion';

type TSideMenu = {
  animationDuration: number;
};
const SideMenu = ({ animationDuration }: TSideMenu) => {
  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: [0, 275] }}
      exit={{ width: [275, 0] }}
      transition={{ duration: animationDuration, type: 'tween' }}
      className="max-w-[275px] overflow-hidden border-r p-1"
    >
      <FavoriteDirectories />
    </motion.div>
  );
};

export default SideMenu;
