import { AnimatePresence, motion } from 'framer-motion';
import { FiChevronsDown } from 'react-icons/fi';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type TSwitchItem = {
  label: string;
  description?: string;
  checked: boolean;
  onSwitch: (newState: boolean) => void;
};
const SwitchItem = ({ label, onSwitch, description, checked }: TSwitchItem) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col">
      <div className="flex items-center space-x-1">
        {description && (
          <div
            role="button"
            aria-label="show description"
            className="flex items-center rounded border p-0.5"
            onClick={() => setExpanded(!expanded)}
          >
            <FiChevronsDown className={cn('transition-transform', expanded && 'rotate-180')} />
          </div>
        )}
        <Label htmlFor={`switch-${label}`}>{label}</Label>
        <Switch id={`switch-${label}`} defaultChecked={checked} onCheckedChange={onSwitch} />
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="overflow-hidden text-sm text-muted-foreground"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            key={`description-${label}`}
          >
            {description}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SwitchItem;
