import SideMenuButton from './SideMenuButton';
import { Separator } from './ui/separator';
import { FaHeart } from 'react-icons/fa6';
import { Button } from './ui/button';

type TSideMenu = {
  onFavoriteSwitch: () => void;
  onClose: () => void;
  isFavorite: boolean;
};
const SideMenu = ({ onClose, onFavoriteSwitch, isFavorite }: TSideMenu) => {
  return (
    <div className="!mt-0 h-screen">
      <div className="relative flex h-[calc(100vh-40px)] w-full flex-col">
        {/* Menu Icon */}
        <SideMenuButton onClick={onClose} />

        {/* Menu content */}
        <div className="overflow-y-auto">
          <div className="space-y-3 p-4">
            <Separator />
            {/* Add to favorites */}
            <div className="flex items-center space-x-1">
              <span className="text-xs font-semibold">{isFavorite ? 'Remove from favorites' : 'Add to favorites'}</span>
              <Button size="smallIcon" onClick={onFavoriteSwitch} className="shrink-0">
                <FaHeart />
              </Button>
            </div>
            <Separator />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
