import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { VideoIcon } from '@radix-ui/react-icons';
const Settings = () => {
  return (
    <div className="h-full w-full p-6">
      <div className="mx-auto max-w-screen-xl">
        <div className="flex flex-col">
          <h1 className="text-3xl font-extrabold tracking-wide">Settings</h1>
          <div>
            <h2 className="flex items-center text-xl font-semibold">
              <VideoIcon className="mr-2 h-6 w-6" />
              Videos
            </h2>
            <div className="flex items-center space-x-2">
              <Label htmlFor="videoAutoPlay">Auto Play Videos</Label>
              <Switch id="videoAutoPlay" />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="videoAutoSoundPlay">Auto Play With Sound</Label>
              <Switch id="videoAutoSoundPlay" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
