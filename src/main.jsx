import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Error from "./Error.jsx"
import PausedPage from './pages/paused.jsx'
import './index.css'

import AuthPage from './pages/auth.jsx'
import ProfilePage from './pages/profile.jsx'
import PrinterStatus from './pages/printer_status.jsx'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <Error/>
  },
  {
    path: "/profile",
    element: <ProfilePage/>,
    errorElement: <Error/>
  },
  {
    path: "/status",
    element: <PrinterStatus/>,
    errorElement: <Error/>
  },
  {
    path:"/auth",
    element:<AuthPage/>,
    errorElement: <Error/>
  },
  {
    path:"/paused",
    element:<PausedPage/>,
    errorElement:<Error/>
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
