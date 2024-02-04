import galleryIcon from '../../../../resources/gallery.png?asset';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Menu = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center space-y-2">
      <h1 className="text-6xl font-extrabold tracking-wide">Gainllery</h1>
      <div className="pointer-events-none h-64 w-64 select-none">
        <img
          src={galleryIcon}
          className="h-full w-full object-contain object-center opacity-50 invert"
          alt="image placeholder"
        />
      </div>
      <p className="mt-4 text-xs text-muted-foreground">Drag and drop an image or use the buttons below</p>
      <Separator className="w-3/5" />
      <div className="flex w-1/2 flex-col space-y-2">
        <Button asChild>
          <Link to="/view">Select File</Link>
        </Button>
        <Button>Select Directory</Button>
      </div>
    </div>
  );
};

export default Menu;
