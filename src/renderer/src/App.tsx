import { RouterProvider, createHashRouter } from 'react-router-dom';
import { SettingsContext } from './components/SettingsContext';
import { ThemeProvider } from './components/ThemeProvider';
import { FileContext } from './components/FileContext';
import EventListener from './components/EventListener';
import Browse from './routes/browse/Browse';
import Menu from './routes/menu/Menu';
import View from './routes/view/View';
import { Toaster } from 'sonner';

const router = createHashRouter([
  {
    element: <EventListener />,
    children: [
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
    ],
  },
]);

const App = () => {
  return (
    <div className="relative flex h-screen w-screen flex-col overflow-hidden">
      <ThemeProvider>
        <SettingsContext>
          <RouterProvider router={router} />
        </SettingsContext>
      </ThemeProvider>
      <Toaster position="top-left" toastOptions={{ style: { maxWidth: '480px' } }} />
    </div>
  );
};

export default App;
