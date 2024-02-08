import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DropHandler from './components/DropHandler';
import Settings from './routes/Settings';
import { DndProvider } from 'react-dnd';
import Menu from './routes/Menu';
import View from './routes/View';

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
    ],
  },
]);

const App = (): JSX.Element => {
  return (
    <div className="relative flex h-screen w-screen flex-col overflow-hidden">
      <DndProvider backend={HTML5Backend}>
        <RouterProvider router={router} />
      </DndProvider>
    </div>
  );
};

export default App;
