import { ChevronUpIcon } from '@radix-ui/react-icons';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type TControlsBox = {
  children: React.ReactNode;
  visible: boolean;
  onShow: () => void;
  className?: string;
};
const ControlsBox = ({ children, visible, onShow, className }: TControlsBox) => {
  return (
    <>
      <div className={cn('fixed bottom-0 left-1/2 -translate-x-1/2', className)}>
        <motion.div
          animate={{
            ...(!visible && {
              y: '100%',
            }),
          }}
        >
          {children}
        </motion.div>
      </div>
      {!visible && (
        <motion.div
          animate={{
            opacity: [0, 1],
            y: ['-300%', '0%'],
          }}
          className="fixed bottom-0 left-1/2 -translate-x-1/2"
          role="button"
          onClick={onShow}
        >
          <ChevronUpIcon className="h-6 w-6" />
        </motion.div>
      )}
    </>
  );
};

export default ControlsBox;
