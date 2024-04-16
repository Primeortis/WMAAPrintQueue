import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Error from "./Error.jsx"
import PausedPage from './pages/paused.jsx'
import './index.css'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import AuthPage from './pages/auth.jsx'
import ProfilePage from './pages/profile.jsx'
import PrinterStatus from './pages/printer_status.jsx'
import FilesPage from './pages/files.jsx'
import NewFilePage from './pages/new_file.jsx'
import ExistingFilePage from './pages/existing_file.jsx'
import AdminPage from './pages/admin.jsx'
import UserManagementPage from './pages/admin/userManagement.jsx'
import QueueManagementPage from './pages/admin/queueManagement.jsx'
import FileViewerPage from './pages/admin/viewAllFiles.jsx'
import NewPrintPage from './pages/newprint.jsx'
import PrinterManagementPage from './pages/admin/printerManagement.jsx'
import PrintConfirmed from './pages/printConfirmation.jsx'
import Error403Page from './pages/errorPages/error403.jsx'
import Error404Page from './pages/errorPages/error404.jsx'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ClassroomPage from './pages/classroom.jsx'
import NewUserLandingPage from './pages/newuserlanding.jsx'



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
    path: "/file",
    element: <FilesPage/>,
    errorElement: <Error/>
  },
  {
    path: "/file/new",
    element: <NewFilePage/>,
    errorElement: <Error/>
  },
  {
    path: "/file/:id",
    element: <ExistingFilePage/>,
    errorElement: <Error/>
  },
  {
    path: "/file/:id/edit",
    element: <NewFilePage/>,
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
  },
  {
    path:"/print",
    element:<NewPrintPage/>,
    errorElement:<Error/>
  },
  {
    path: "/newuserlanding",
    element: <NewUserLandingPage/>,
    errorElement: <Error/>
  },
  {
    path: "/classroom",
    element: <ClassroomPage/>, 
    errorElement: <Error/>
  },
  {
    path: "/printsuccess",
    element: <PrintConfirmed/>, 
    errorElement: <Error/>
  },
  {
    path:"/admin",
    element:<AdminPage/>,
    errorElement:<Error/>
  },
  {
    path:"/admin/usermanagement",
    element:<UserManagementPage/>,
    errorElement:<Error/>
  },
  {
    path:"/admin/queuemanagement",
    element:<QueueManagementPage/>,
    errorElement:<Error/>
  },
  {
    path:"/admin/fileviewer",
    element:<FileViewerPage/>,
    errorElement:<Error/>
  },
  {
    path:"/admin/printermanagement",
    element:<PrinterManagementPage/>,
    errorElement:<Error/>
  },
  {
    path:"/403",
    element:<Error403Page/>,
    errorElement:<Error/>
  },
  {
    path:"/404",
    element:<Error404Page/>,
    errorElement:<Error/>
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <RouterProvider router={router} />
    </LocalizationProvider>
  </React.StrictMode>,
)
