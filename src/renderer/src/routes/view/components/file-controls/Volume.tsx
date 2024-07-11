import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { FaVolumeHigh, FaVolumeLow } from 'react-icons/fa6';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { FaVolumeMute } from 'react-icons/fa';

type TVolume = {
  volume: number;
  muted: boolean;
  toggleMute: () => void;
  onVolumeChange: (value: number[]) => void;
};
const Volume = ({ onVolumeChange, volume, muted, toggleMute }: TVolume) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon" className="shrink-0" onContextMenu={toggleMute}>
          {muted ? (
            <FaVolumeMute className="h-6 w-6" />
          ) : volume > 0.5 ? (
            <FaVolumeHigh className="h-6 w-6" />
          ) : (
            <FaVolumeLow className="h-6 w-6" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="relative h-[50vh] w-min rounded-b-none" sideOffset={6}>
        <Slider max={1} min={0} step={0.01} orientation="vertical" onValueChange={onVolumeChange} value={[volume]} />
      </PopoverContent>
    </Popover>
  );
};

export default Volume;
