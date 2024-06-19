import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Import BrowserRouter
import Header from './components/header.jsx';
import Inicio from './components/inicio.jsx';
import Servicios from './components/servicios.jsx';
import Cuotas from './components/cuotas.jsx';
import Empresa from './components/empresa.jsx';
import Contacto from './components/contacto.jsx';
import Login from './components/login.jsx';
import './index.css';

function App() {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/servicios" element={<Servicios />} />
                <Route path="/cuotas" element={<Cuotas />} />
                <Route path="/empresa" element={<Empresa />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);