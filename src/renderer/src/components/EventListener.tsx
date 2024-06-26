import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'sonner';

const EventListener = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.ipc.on('infoToast', (_, message) => toast.info(message));
    window.ipc.on('redirect', (_, path) => navigate(path));

    return () => window.ipc.removeListener('infoToast');
  }, []);

  return <Outlet />;
};

export default EventListener;
