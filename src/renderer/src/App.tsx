import { RouterProvider, createHashRouter } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import Menu from './routes/menu/Menu';

const router = createHashRouter([
  {
    path: '/',
    element: <Menu />,
  },
]);

const App = (): JSX.Element => {
  return (
    <div className="relative flex h-screen w-screen flex-col overflow-hidden">
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </div>
  );
};

export default App;
