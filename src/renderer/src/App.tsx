import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DropHandler from './components/DropHandler';
import Settings from './routes/Settings';
import { DndProvider } from 'react-dnd';
import Browse from './routes/Browse';
import Menu from './routes/Menu';
import View from './routes/View';
import { Toaster } from 'sonner';

const router = createBrowserRouter([
  {
    element: <DropHandler />,
    children: [
      {
        path: '/',
        element: <Menu />,
      },
      {
        path: '/view',
        element: <View />,
      },
      {
        path: '/settings',
        element: <Settings />,
      },
      {
        path: '/browse',
        element: <Browse />,
      },
    ],
  },
]);

const App = (): JSX.Element => {
  return (
    <div className="relative flex h-screen w-screen flex-col overflow-hidden">
      <DndProvider backend={HTML5Backend}>
        <RouterProvider router={router} />
      </DndProvider>
      <Toaster theme="dark" position="top-left" toastOptions={{ style: { width: '25vw', maxWidth: '480px' } }} />
    </div>
  );
};

export default App;
