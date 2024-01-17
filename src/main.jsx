import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Error from "./Error.jsx"
import PausedPage from './pages/paused.jsx'
import './index.css'

import AuthPage from './pages/auth.jsx'

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
