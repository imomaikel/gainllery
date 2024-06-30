import { Button } from '@/components/ui/button';
import { TiChevronLeft } from 'react-icons/ti';

type TPrevious = {
  onClick: () => void;
  disabled: boolean;
};
const Previous = ({ onClick, disabled }: TPrevious) => {
  return (
    <Button size="icon" onClick={onClick} disabled={disabled}>
      <TiChevronLeft className="h-6 w-6" />
    </Button>
  );
};

export default Previous;
