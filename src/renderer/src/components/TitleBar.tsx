import { ExitFullScreenIcon, EnterFullScreenIcon, Cross2Icon, BorderSolidIcon, GearIcon } from '@radix-ui/react-icons';
import { Link, Outlet } from 'react-router-dom';
import { useState } from 'react';

const TitleBar = () => {
  const [isMaximized, setIsMaximized] = useState(false);

  const onMinimize = () => {
    window.electron.ipcRenderer.send('windowMinimize');
  };
  const onMaximize = () => {
    window.electron.ipcRenderer.send('windowMaximize');
    setIsMaximized(!isMaximized);
  };
  const onClose = () => {
    window.electron.ipcRenderer.send('windowClose');
  };

  return (
    <>
      <div
        className="titleButtons relative flex h-9 min-h-[36px] items-center rounded-tl rounded-tr bg-muted px-2"
        id="titleBar"
      >
        <div className="absolute left-1/2 flex h-full -translate-x-1/2 items-center justify-center font-bold">
          Gainllery
        </div>
        <div className="flex w-full justify-between pr-2">
          <div role="button">
            <Link to="/">Home</Link>
          </div>
          <div>
            <div className="titleIcon">
              <Link to="/settings">
                <GearIcon className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
        <div className="ml-auto flex space-x-0.5">
          <div role="button" onClick={onMinimize} className="titleIcon">
            <BorderSolidIcon className="h-6 w-6" />
          </div>
          {isMaximized ? (
            <div role="button" onClick={onMaximize} className="titleIcon">
              <ExitFullScreenIcon className="h-6 w-6" />
            </div>
          ) : (
            <div role="button" onClick={onMaximize} className="titleIcon">
              <EnterFullScreenIcon className="h-6 w-6" />
            </div>
          )}
          <div role="button" onClick={onClose} className="titleIcon">
            <Cross2Icon className="h-6 w-6" />
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default TitleBar;
