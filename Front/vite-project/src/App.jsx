import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Inicio from './inicio';
import Auth from './auth';
import AsistentePage from './pages/asistente/asistentePage';
import PerfilAsistente from './pages/asistente/perfilAsistente.jsx';
import PerfilFamiliar from './pages/familiar/familiarPage.jsx';

function App() {
const [mensaje, setMensaje] = useState('Conectando con el backend...');

useEffect(() => {
    fetch('http://localhost:3000/')
    .then((res) => res.text())
    .then((data) => setMensaje(data))
    .catch((err) => setMensaje('Error al conectar con el backend'));
}, []);

return (
    <Router>
    <nav className="bg-[#556B2F] text-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-wide">Kindo</h1>
        <div className="space-x-6 text-sm font-medium">
        <Link to="/" className="hover:underline">Inicio</Link>
        <Link to="/auth" className="hover:underline">Iniciar Sesión</Link>
        </div>
    </nav>
      {/* Rutas */}
    <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/perfil-asistente" element={<PerfilAsistente />} />
        <Route path="/dashboard-asistente" element={<AsistentePage />} />
        <Route path="/perfil-familiar" element={<PerfilFamiliar />} />
    </Routes>
    </Router>
);
}

export default App;