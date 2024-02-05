import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import TitleBar from './components/TitleBar';
import Settings from './routes/Settings';
import ReactDOM from 'react-dom/client';
import Menu from './routes/Menu';
import View from './routes/View';
import './assets/base.css';
import React from 'react';

const router = createBrowserRouter([
  {
    element: <TitleBar />,
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

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <div className="relative flex h-screen w-screen flex-col overflow-hidden">
      <RouterProvider router={router} />
    </div>
  </React.StrictMode>,
);
