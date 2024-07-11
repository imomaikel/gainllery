import { useFileContext } from '@/hooks/useFileContext';
import { motion } from 'framer-motion';

type TTopBar = {
  animationDuration: number;
};
const TopBar = ({ animationDuration }: TTopBar) => {
  const { files, index } = useFileContext();

  return (
    <motion.div
      initial={{ height: 0 }}
      animate={{ height: [0, 25] }}
      exit={{ height: [25, 0] }}
      transition={{ duration: animationDuration, type: 'tween' }}
      className="border-b bg-background"
    >
      <div className="flex items-center px-2">
        <div>
          <span className="text-xs text-muted-foreground">
            File {index + 1} of {files.length}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default TopBar;
