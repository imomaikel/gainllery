import { Button } from '@/components/ui/button';
import { FaPause, FaPlay } from 'react-icons/fa6';

type TPlayPause = {
  onClick: () => void;
  paused: boolean;
};
const PlayPause = ({ onClick, paused }: TPlayPause) => {
  return (
    <Button size="icon" onClick={onClick}>
      {paused ? <FaPlay className="h-6 w-6" /> : <FaPause className="h-6 w-6" />}
    </Button>
  );
};

export default PlayPause;
