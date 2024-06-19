import React from 'react'
import ReactDOM from 'react-dom/client'

import Header from './components/header.jsx'
import Inicio from './components/inicio.jsx'
import Servicios from './components/servicios.jsx'
import Cuotas from './components/cuotas.jsx'
import Empresa from './components/empresa.jsx'
import Contacto from './components/contacto.jsx'
import Login from './components/login.jsx'
import Registro from './components/registro.jsx'
import Cuenta from './components/cuenta.jsx'
import Blog from './components/blog.jsx'
import BlogPriv from './components/blogPriv.jsx'
import AdminUsuarios from './components/adminUsuarios.jsx'
import './index.css'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: 
    <>
    <Header/>
    <Inicio/>
    </>,
    errorElement: <h1>Ruta no válida</h1>
  },
  {
    path: "/servicios",
    element:
    <>
    <Header/>
    <Servicios/>
    </>
  },
  {
    path: "/cuotas",
    element:
    <>
    <Header/>
    <Cuotas/>
    </>
  },{
    path: "/empresa",
    element:
    <>
    <Header/>
    <Empresa/>
    </>
  },
  {
    path: "/contacto",
    element:
    <>
    <Header/>
    <Contacto/>
    </>
  },
  {
    path: "/login",
    element:
    <>
    <Header/>
    <Login/>
    </>
  },
  {
    path: "/registro",
    element:
    <>
    <Header/>
    <Registro/>
    </>
  },
  {
    path: "/cuenta",
    element:
    <>
    <Header/>
    <Cuenta/>
    </>
  },
  {
    path: "/blog",
    element:
    <>
    <Header/>
    <Blog/>
    </>
  },
  {
    path: "/blogpriv",
    element:
    <>
    <Header/>
    <BlogPriv/>
    </>
  },
  {
    path: "/adminuser",
    element:
    <>
    <Header/>
    <AdminUsuarios/>
    </>
  }

]);


ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)
