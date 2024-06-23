import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { Button } from './ui/button';

type TSideMenuButton = {
  onClick: () => void;
};
const SideMenuButton = ({ onClick }: TSideMenuButton) => {
  return (
    <Button
      size="icon"
      onClick={onClick}
      variant="outline"
      className="ml-3 mt-6 opacity-50 transition-opacity hover:opacity-100"
    >
      <HamburgerMenuIcon className="h-6 w-6" />
    </Button>
  );
};

export default SideMenuButton;
