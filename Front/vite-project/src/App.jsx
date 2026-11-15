
import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate
} from 'react-router-dom';

import Inicio from './Inicio.jsx';
import Auth from './auth.jsx';
import Login from './Login.jsx';

import AsistentePage from './pages/asistente/asistentePage.jsx';
import PerfilAsistente from './pages/asistente/perfilAsistente.jsx';
import PerfilFamiliar from './pages/familiar/familiarPage.jsx';
import Asistentes from './pages/familiar/Asistentes.jsx';
import MiPerfilFamiliar from './pages/familiar/MiPerfilFamiliar.jsx';

function Contenido() {
  const location = useLocation();
  const navigate = useNavigate();

  // ==========================================
  // DATOS DEL USUARIO
  // ==========================================

  const leerUsuarioGuardado = () => {
    try {
      return JSON.parse(localStorage.getItem('usuarioKindo') || 'null');
    } catch (error) {
      console.error('Error al leer la sesión:', error);
      return null;
    }
  };

  const [usuarioGuardado, setUsuarioGuardado] = useState(
    leerUsuarioGuardado
  );

  // Actualizar los datos de sesión cuando cambien
  useEffect(() => {
    const actualizarUsuario = () => {
      setUsuarioGuardado(leerUsuarioGuardado());
    };

    window.addEventListener('storage', actualizarUsuario);
    window.addEventListener('kindo-sesion-actualizada', actualizarUsuario);

    return () => {
      window.removeEventListener('storage', actualizarUsuario);
      window.removeEventListener('kindo-sesion-actualizada', actualizarUsuario);
    };
  }, []);

  // Comprobar nuevamente la sesión al cambiar de página
  useEffect(() => {
    setUsuarioGuardado(leerUsuarioGuardado());
  }, [location.pathname]);

  const usuario = usuarioGuardado?.usuario || usuarioGuardado;

  const roles = Array.isArray(usuario?.roles)
    ? usuario.roles
    : Array.isArray(usuarioGuardado?.roles)
      ? usuarioGuardado.roles
      : [];

  const esFamiliar = roles.includes('familiar');
  const esAsistente = roles.includes('asistente');

  const token =
    localStorage.getItem('token') ||
    usuarioGuardado?.token ||
    usuarioGuardado?.usuario?.token;

  // ==========================================
  // NOTIFICACIONES
  // ==========================================

  const [notificaciones, setNotificaciones] = useState([]);
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);

  const noLeidas = notificaciones.filter(
    (notificacion) => !notificacion.leida
  ).length;

  // ==========================================
  // CERRAR SESIÓN
  // ==========================================

  const cerrarSesion = () => {
    localStorage.removeItem('usuarioKindo');
    localStorage.removeItem('token');

    setUsuarioGuardado(null);
    setNotificaciones([]);
    setMostrarNotificaciones(false);

    window.dispatchEvent(new Event('kindo-sesion-actualizada'));

    navigate('/');
  };

  // ==========================================
  // CARGAR NOTIFICACIONES
  // ==========================================

  useEffect(() => {
    if (!token || !usuarioGuardado) {
      setNotificaciones([]);
      return;
    }

    let componenteActivo = true;

    const cargarNotificaciones = async () => {
      try {
        const response = await fetch(
          'http://localhost:3000/api/notificaciones',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.ok) {
          const data = await response.json();

          if (componenteActivo) {
            setNotificaciones(Array.isArray(data) ? data : []);
          }
        }
      } catch (error) {
        console.error('Error al cargar notificaciones:', error);
      }
    };

    cargarNotificaciones();

    const intervalo = setInterval(cargarNotificaciones, 30000);

    return () => {
      componenteActivo = false;
      clearInterval(intervalo);
    };
  }, [token, usuarioGuardado]);

  // ==========================================
  // MARCAR NOTIFICACIÓN COMO LEÍDA
  // ==========================================

  const marcarComoLeida = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/notificaciones/${id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        setNotificaciones((actuales) =>
          actuales.map((notificacion) =>
            notificacion.id === id
              ? { ...notificacion, leida: true }
              : notificacion
          )
        );
      }
    } catch (error) {
      console.error('Error al marcar notificación:', error);
    }
  };

  // ==========================================
  // BARRA DE NAVEGACIÓN
  // ==========================================

  return (
    <>
      <nav className="bg-[#556B2F] text-white shadow-md px-6 py-4 flex justify-between items-center">

        <Link
          to="/"
          className="text-xl font-bold tracking-wide"
        >
          Kindo
        </Link>

        <div className="flex items-center gap-5 text-sm font-medium">

          <Link
            to="/"
            className="transition hover:text-gray-200"
          >
            Inicio
          </Link>

          {/* Opciones para usuarios no registrados */}

          {!usuarioGuardado && (
            <>
              <Link
                to="/auth"
                className={`transition hover:text-gray-200 ${
                  location.pathname === '/auth'
                    ? 'underline underline-offset-4'
                    : ''
                }`}
              >
                Registrarse
              </Link>

              <Link
                to="/login"
                className={`rounded-full bg-white px-5 py-2 text-[#556B2F] transition hover:bg-gray-100 ${
                  location.pathname === '/login' ? 'font-bold' : ''
                }`}
              >
                Iniciar sesión
              </Link>
            </>
          )}

          {/* Opciones para familiares */}

          {esFamiliar && (
            <>
              <Link
                to="/mi-perfil-familiar"
                className="transition hover:text-gray-200"
              >
                Mi perfil
              </Link>

              <Link
                to="/asistentes"
                className="transition hover:text-gray-200"
              >
                Asistentes
              </Link>
            </>
          )}

          {/* Opciones para asistentes */}

          {esAsistente && (
            <>
              <Link
                to="/perfil-asistente"
                className="transition hover:text-gray-200"
              >
                Mi perfil
              </Link>

              <Link
                to="/dashboard-asistente"
                className="transition hover:text-gray-200"
              >
                Mi panel
              </Link>
            </>
          )}

          {/* Notificaciones */}

          {usuarioGuardado && token && (
            <div className="relative">

              <button
                type="button"
                onClick={() =>
                  setMostrarNotificaciones(!mostrarNotificaciones)
                }
                className="relative flex items-center justify-center rounded-full p-2 transition-colors hover:bg-white/10"
                title="Notificaciones"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="23"
                  height="23"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                  <path d="M10 21h4" />
                </svg>

                {noLeidas > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full border-2 border-[#556B2F] bg-red-500 px-1 text-[10px] font-bold text-white">
                    {noLeidas}
                  </span>
                )}
              </button>

              {/* Panel desplegable */}

              {mostrarNotificaciones && (
                <div className="absolute right-0 top-12 z-50 w-80 rounded-xl border border-gray-200 bg-white text-gray-800 shadow-xl">

                  <div className="border-b p-4 font-semibold">
                    Notificaciones
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {notificaciones.length === 0 ? (
                      <p className="p-4 text-center text-sm text-gray-500">
                        No tienes notificaciones todavía.
                      </p>
                    ) : (
                      notificaciones.map((notificacion) => (
                        <button
                          key={notificacion.id}
                          type="button"
                          onClick={() => marcarComoLeida(notificacion.id)}
                          className={`w-full border-b p-4 text-left transition hover:bg-gray-50 ${
                            !notificacion.leida ? 'bg-green-50' : ''
                          }`}
                        >
                          <p className="text-sm font-medium">
                            {notificacion.texto}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {notificacion.leida ? 'Leída' : 'Sin leer'}
                          </p>
                        </button>
                      ))
                    )}
                  </div>

                </div>
              )}
            </div>
          )}

          {/* Botón cerrar sesión */}

          {usuarioGuardado && (
            <button
              type="button"
              onClick={cerrarSesion}
              className="rounded-full border border-white/40 px-4 py-2 text-sm font-medium text-white transition hover:bg-white hover:text-[#556B2F]"
            >
              Cerrar sesión
            </button>
          )}

        </div>
      </nav>

      {/* RUTAS DE LA APLICACIÓN */}

      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Login />} />

        <Route path="/perfil-asistente" element={<PerfilAsistente />} />
        <Route path="/dashboard-asistente" element={<AsistentePage />} />

        <Route path="/perfil-familiar" element={<PerfilFamiliar />} />
        <Route path="/asistentes" element={<Asistentes />} />
        <Route path="/mi-perfil-familiar" element={<MiPerfilFamiliar />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <Contenido />
    </Router>
  );
}

export default App;
