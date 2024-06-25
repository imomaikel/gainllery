import { RouterProvider, createHashRouter } from 'react-router-dom';
import Menu from './routes/Menu';

const router = createHashRouter([
  {
    path: '/',
    element: <Menu />,
  },
]);

const App = (): JSX.Element => {
  return (
    <div className="relative flex h-screen w-screen flex-col overflow-hidden">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
