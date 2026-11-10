import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('familiar');
  const [nombreAdulto, setNombreAdulto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [esExito, setEsExito] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          apellido,
          telefono,
          email,
          password,
          rol,
          adultoMayor: rol === 'familiar' ? adultoMayor : undefined
        }),
      });
      // En tu auth.jsx al registrar o iniciar sesión con éxito:
localStorage.setItem('usuarioKindo', JSON.stringify(data.usuario));

      const data = await response.json();
      
      if (response.ok) {
        setEsExito(true);
        setMensaje('¡Registro exitoso! Redirigiendo...');

        // Redirección condicionada según el rol seleccionado
setTimeout(() => {
  if (rol === 'familiar') {
    navigate('/');
  } else if (rol === 'asistente') {
    navigate('/dashboard-asistente');
  }
}, 1000);

      } else {
        setEsExito(false);
        setMensaje(data.message || 'Ocurrió un error');
      }
    } catch (error) {
      setEsExito(false);
      setMensaje('No se pudo conectar con el servidor');
    }
  };

  return (
    <div className="min-h-[85vh] bg-gray-100 flex items-center justify-center py-8">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96 flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-2 text-center">Registro Kindo</h2>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Nombre</label>
          <input 
            type="text" 
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)} 
            className="p-2 border rounded" 
            required 
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Apellido</label>
          <input 
            type="text" 
            value={apellido} 
            onChange={(e) => setApellido(e.target.value)} 
            className="p-2 border rounded" 
            required 
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Teléfono</label>
          <input 
            type="text" 
            value={telefono} 
            onChange={(e) => setTelefono(e.target.value)} 
            className="p-2 border rounded" 
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Correo Electrónico</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="p-2 border rounded" 
            required 
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Contraseña</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="p-2 border rounded" 
            required 
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Rol</label>
          <select 
            value={rol} 
            onChange={(e) => setRol(e.target.value)} 
            className="p-2 border rounded"
          >
            <option value="familiar">Familiar</option>
            <option value="asistente">Asistente</option>
          </select>
        </div>

        {rol === 'familiar' && (
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Nombre del Adulto Mayor</label>
            <input 
              type="text" 
              value={nombreAdulto} 
              onChange={(e) => setNombreAdulto(e.target.value)} 
              className="p-2 border rounded" 
              required 
            />
          </div>
        )}

        <button type="submit" className="w-full bg-[#556B2F] text-white p-2 rounded font-semibold mt-2 hover:bg-[#445624]">
          Registrar
        </button>

        {mensaje && (
          <p className={`text-center text-sm ${esExito ? 'text-green-600 font-semibold' : 'text-red-600'}`}>
            {mensaje}
          </p>
        )}
      </form>
    </div>
  );
}