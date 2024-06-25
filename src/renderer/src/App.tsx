import { RouterProvider, createHashRouter } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { FileContext } from './components/FileContext';
import Menu from './routes/menu/Menu';
import View from './routes/view/View';

const router = createHashRouter([
  {
    path: '/',
    element: <Menu />,
  },
  {
    path: '/view',
    element: <View />,
  },
]);

const App = () => {
  return (
    <div className="relative flex h-screen w-screen flex-col overflow-hidden">
      <FileContext>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </FileContext>
    </div>
  );
};

export default App;
