import { useSettings } from '@/hooks/useSettings';
import SwitchItem from './components/SwitchItem';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

const Settings = () => {
  const settings = useSettings();
  const navigate = useNavigate();

  return (
    <div className="relative">
      <div className="max-h-screen space-y-3 overflow-y-auto px-2 py-4 pb-16">
        <SwitchItem
          label="Auto hide bottom controls"
          checked={settings.get('autoHideBottomControls')}
          description="Hide the bottom bar with a button such as the next file when the mouse is outside the app or not moving for a few seconds."
          onSwitch={(newState) => settings.set('autoHideBottomControls', newState)}
        />
      </div>
      <div className="fixed bottom-0 flex w-screen gap-4 border-t bg-background/75 p-2 backdrop-blur-sm">
        <div className="flex flex-1 ">
          <Button className="w-full space-x-2" onClick={() => navigate('/')}>
            <FaHome className="h-6 w-6" />
            <span>Go Home</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
