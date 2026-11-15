
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  // ==========================================
  // INICIAR SESIÓN
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMensaje('');
    setCargando(true);

    try {
      const response = await fetch(
        'http://localhost:3000/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMensaje(data.message || 'Credenciales incorrectas');
        return;
      }

      if (!data.token || !data.usuario) {
        setMensaje('El servidor no devolvió correctamente los datos de sesión.');
        return;
      }

      // ==========================================
      // GUARDAR DATOS DE LA SESIÓN
      // ==========================================

      localStorage.setItem('token', data.token);

      localStorage.setItem(
        'usuarioKindo',
        JSON.stringify(data.usuario)
      );

      console.log('Usuario que inició sesión:', data.usuario);
      console.log('Roles del usuario:', data.usuario.roles);

      // Avisar a App.jsx que cambió la sesión
      window.dispatchEvent(new Event('kindo-sesion-actualizada'));

      setMensaje('¡Bienvenido! Login exitoso.');

      // Redirigir al inicio
      navigate('/');

    } catch (error) {
      console.error('Error de red:', error);
      setMensaje('No se pudo conectar con el servidor');

    } finally {
      setCargando(false);
    }
  };

  // ==========================================
  // DISEÑO DEL FORMULARIO
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-96"
      >

        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Iniciar Sesión
        </h2>

        {/* CORREO ELECTRÓNICO */}

        <div className="mb-4">

          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Correo Electrónico
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#71834B]"
            placeholder="Ingresá tu correo"
            required
          />

        </div>

        {/* CONTRASEÑA */}

        <div className="mb-6">

          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Contraseña
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#71834B]"
            placeholder="Ingresá tu contraseña"
            required
          />

        </div>

        {/* BOTÓN */}

        <button
          type="submit"
          disabled={cargando}
          className="w-full bg-[#556B2F] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#435523] transition-all disabled:opacity-60"
        >
          {cargando ? 'Ingresando...' : 'Entrar'}
        </button>

        {/* MENSAJE */}

        {mensaje && (
          <p className="mt-4 text-center text-sm font-medium text-[#556B2F]">
            {mensaje}
          </p>
        )}

      </form>

    </div>
  );
}

export default Login;
