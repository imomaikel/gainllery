import { Outlet, useNavigate } from 'react-router-dom';
import { DropTargetMonitor, useDrop } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';
import { motion } from 'framer-motion';

const DropHandler = () => {
  const navigate = useNavigate();
  const [{ isActive }, drop] = useDrop(
    () => ({
      accept: [NativeTypes.FILE],
      drop(item: { files: File[] }) {
        const filesToFetch = item.files.map(({ name, path, size, type }) => ({
          name,
          path,
          size,
          type: type === '' ? 'directory' : type,
        }));

        window.store.set('filesToFetch', filesToFetch);
        const fetched = window.electron.ipcRenderer.sendSync('filesToFetch');
        if (fetched) {
          if (window.location.href.endsWith('/view')) {
            window.location.reload();
          } else {
            navigate('/view');
          }
        }
      },
      collect: (monitor: DropTargetMonitor) => {
        return {
          isActive: monitor.isOver() && monitor.canDrop(),
        };
      },
    }),
    [],
  );

  return (
    <div ref={drop} className="h-screen w-screen">
      <div className="relative h-full w-full">
        {isActive && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute left-1/2 top-1/2 z-10 h-[85%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-primary/50"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-0 h-full w-full backdrop-blur-[2px]"
            />
          </>
        )}
        <Outlet />
      </div>
    </div>
  );
};

export default DropHandler;
