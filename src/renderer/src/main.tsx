import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import Menu from './routes/Menu';
import './assets/base.css';
import React from 'react';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Menu />,
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <div className="relative h-screen w-screen">
      <RouterProvider router={router} />
    </div>
  </React.StrictMode>,
);
