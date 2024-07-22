import Breadcrumbs from './Breadcrumbs';
import { motion } from 'framer-motion';

type TTopBar = {
  animationDuration: number;
};
const TopBar = ({ animationDuration }: TTopBar) => {
  return (
    <motion.div
      initial={{ height: 0 }}
      animate={{ height: [0, 25] }}
      exit={{ height: [25, 0] }}
      transition={{ duration: animationDuration, type: 'tween' }}
      className="border-b bg-background"
    >
      <div className="flex h-[25px] items-center justify-center">
        <Breadcrumbs />
      </div>
    </motion.div>
  );
};

export default TopBar;
