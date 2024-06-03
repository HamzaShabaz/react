import './index.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import RouteProvider from "./routes.jsx";
import { UserProvier } from './contexts/UserContext.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvier>
      <RouteProvider />
      <ToastContainer limit={1} />
    </UserProvier>
  </React.StrictMode>,
)
