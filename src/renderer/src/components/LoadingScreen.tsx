import { MoonLoader } from 'react-spinners';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const LoadingScreen = () => {
  const [needExtraTime, setNeedExtraTime] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setNeedExtraTime(true), 5_000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1] }}
      exit={{ opacity: [1, 0] }}
      className="fixed z-[100] flex h-screen w-screen items-center justify-center bg-background"
    >
      <div className="mt-4 flex items-center justify-center space-x-6">
        <MoonLoader color="#6d28d9" speedMultiplier={0.85} />
        <div className="flex flex-col">
          <p className="text-lg font-bold">Please wait...</p>
          <span className="text-xs text-muted-foreground">Files are being loaded...</span>
          {needExtraTime && (
            <p className="translate-y-4 text-sm text-muted-foreground">
              There are a lot of files
              <br /> It can take a while
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
