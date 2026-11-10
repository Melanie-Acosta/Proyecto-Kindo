import { useState } from 'react';

function Register() {
const [nombre, setNombre] = useState('');
const [apellido, setApellido] = useState('');
const [telefono, setTelefono] = useState('');
const [mensaje, setMensaje] = useState('');

const handleSubmit = async (e) => {
    e.preventDefault();

    try {
    const response = await fetch('http://localhost:3000/api/persons', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, apellido, telefono }),
    });

    const data = await response.json();

    if (response.ok) {
        setMensaje('¡Registro exitoso!');
        setNombre('');
        setApellido('');
        setTelefono('');
    } else {
        setMensaje(data.error || data.message || 'Error al registrar');
    }
    } catch (error) {
    console.error('Error de red:', error);
    setMensaje('No se pudo conectar con el servidor');
    }
};

return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8">
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Registrar Persona</h2>

        <div className="mb-4">
        <label className="block text-gray-700 text-sm font-semibold mb-2">Nombre</label>
        <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
        />
        </div>

        <div className="mb-4">
        <label className="block text-gray-700 text-sm font-semibold mb-2">Apellido</label>
        <input
            type="text"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
        />
        </div>

        <div className="mb-6">
        <label className="block text-gray-700 text-sm font-semibold mb-2">Teléfono</label>
        <input
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        </div>

    <button
  type="submit"
  className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-xl hover:bg-blue-700 transition-colors"
>
  Registrar
</button>

{mensaje && (
  <p className="mt-4 text-center text-sm font-medium text-blue-600">{mensaje}</p>
)}
</form>
    </div>
);
}

export default Register;