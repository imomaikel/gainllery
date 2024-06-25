import { HoverEffect } from '@/components/ui/card-hover-effect';
import { FaPhotoVideo } from 'react-icons/fa';
import { MENU_TABS } from '@/lib/constans';

const Menu = () => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center space-y-8">
      {/* Title */}
      <div>
        <span className="text-6xl font-extrabold tracking-wide text-primary">Gainllery</span>
      </div>
      {/* Image */}
      <FaPhotoVideo className="h-36 w-36 object-contain object-center" />
      {/* Buttons */}
      <HoverEffect items={MENU_TABS} />
    </div>
  );
};

export default Menu;
