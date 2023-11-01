import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import Home from './components/Home.jsx'
import Profile from './components/Profile'
import { Route,RouterProvider,Routes, createBrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar'

const router = createBrowserRouter([
  { 
    path : "/" , 
    element : <App/>

  },

  {
    path : "/profile" , 
    element : <Profile/>
  },

  { 
    path : "/home" , 
    element : <Home/>

  },

]

)

const node = document.getElementById('root') as HTMLElement
const root = ReactDOM.createRoot(node)
root.render(
  <React.StrictMode>
  <Navbar/>
  <RouterProvider router={router}/>
  </React.StrictMode>
)
