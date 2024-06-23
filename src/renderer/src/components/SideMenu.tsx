import SideMenuButton from './SideMenuButton';

type TSideMenu = {
  onClose: () => void;
};
const SideMenu = ({ onClose }: TSideMenu) => {
  return (
    <div className="!mt-0 h-screen">
      <div className="relative h-[calc(100vh-40px)] w-full">
        {/* Menu Icon */}
        <SideMenuButton onClick={onClose} />

        {/* Menu content */}
        <div className="h-full"></div>
      </div>
    </div>
  );
};

export default SideMenu;
