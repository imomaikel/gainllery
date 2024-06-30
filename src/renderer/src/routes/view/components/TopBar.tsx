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
      className="bg-secondary"
    ></motion.div>
  );
};

export default TopBar;
