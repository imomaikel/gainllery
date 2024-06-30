import { Button } from '@/components/ui/button';
import { TiChevronRight } from 'react-icons/ti';

type TNext = {
  onClick: () => void;
  disabled: boolean;
};
const Next = ({ onClick, disabled }: TNext) => {
  return (
    <Button size="icon" onClick={onClick} disabled={disabled}>
      <TiChevronRight className="h-6 w-6" />
    </Button>
  );
};

export default Next;
