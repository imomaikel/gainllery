import { RouterProvider, createHashRouter } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { FileContext } from './components/FileContext';
import Browse from './routes/browse/Browse';
import { Toaster, toast } from 'sonner';
import Menu from './routes/menu/Menu';
import View from './routes/view/View';
import { useEffect } from 'react';

const router = createHashRouter([
  {
    path: '/',
    element: (
      <FileContext>
        <Menu />
      </FileContext>
    ),
  },
  {
    path: '/view',
    element: (
      <FileContext>
        <View />
      </FileContext>
    ),
  },
  {
    path: '/browse',
    element: <Browse />,
  },
]);

const App = () => {
  useEffect(() => {
    window.ipc.on('infoToast', (_, message) => toast.info(message));

    return () => window.ipc.removeListener('infoToast');
  }, []);

  return (
    <div className="relative flex h-screen w-screen flex-col overflow-hidden">
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
      <Toaster position="top-left" toastOptions={{ style: { maxWidth: '480px' } }} />
    </div>
  );
};

export default App;
