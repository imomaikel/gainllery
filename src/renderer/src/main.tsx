import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import Menu from './routes/Menu';
import View from './routes/View';
import './assets/base.css';
import React from 'react';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Menu />,
  },
  {
    path: '/view',
    element: <View />,
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <div className="relative h-screen w-screen overflow-hidden">
      <RouterProvider router={router} />
    </div>
  </React.StrictMode>,
);
