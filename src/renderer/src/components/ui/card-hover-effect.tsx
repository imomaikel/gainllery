import { AnimatePresence, motion } from 'framer-motion';
import { useFileContext } from '@/hooks/useFileContext';
import { useSettings } from '@/hooks/useSettings';
import { useNavigate } from 'react-router-dom';
import { MENU_TABS } from '@/lib/constans';
import { useState } from 'react';

type THoverEffect = {
  items: typeof MENU_TABS;
};
export const HoverEffect = ({ items }: THoverEffect) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { files } = useFileContext();
  const navigate = useNavigate();
  const settings = useSettings();

  const hasPreviousFile = files.length >= 1;

  return (
    <div className="grid grid-cols-3 px-2">
      {items.map((item, idx) => {
        if (item.label === 'Open recent' && !hasPreviousFile) return null;
        return (
          <div
            key={item.label}
            className="group relative block h-full w-full p-2"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <AnimatePresence>
              {hoveredIndex === idx && (
                <motion.span
                  className="absolute inset-0 block h-full w-full rounded-3xl bg-neutral-200  dark:bg-slate-800/[0.8]"
                  layoutId="hoverBackground"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { duration: settings.reduceMotion(0.15) },
                  }}
                  exit={{
                    opacity: 0,
                    transition: { duration: settings.reduceMotion(0.15), delay: 0.2 },
                  }}
                  transition={{ duration: settings.reduceMotion() }}
                />
              )}
            </AnimatePresence>
            <div
              onClick={() => {
                if (item.onClick) return item.onClick();
                if (item.path) return navigate(item.path);
              }}
              className="group/item relative z-20 h-full w-full cursor-pointer overflow-hidden rounded-2xl border border-transparent bg-black group-hover:border-slate-700 dark:border-white/[0.2]"
            >
              <div className="relative z-50">
                <div className=" flex flex-col items-center p-4 text-center">
                  <item.Icon className="h-10 w-10 transition-colors group-hover/item:text-primary md:h-12 md:w-12" />
                  <span className="mt-4 whitespace-nowrap text-xs font-bold capitalize tracking-wide text-zinc-100 md:text-balance">
                    {item.label}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// https://ui.aceternity.com/components/card-hover-effect
