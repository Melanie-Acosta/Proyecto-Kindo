import { useState } from 'react';

function Login() {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [mensaje, setMensaje] = useState('');

const handleSubmit = async (e) => {
    e.preventDefault(); 

    try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
        setMensaje('¡Bienvenido! Login exitoso.');
    } else {
        setMensaje(data.message || 'Credenciales incorrectas');
    }
    } catch (error) {
    console.error('Error de red:', error);
    setMensaje('No se pudo conectar con el servidor');
    }
};

return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Iniciar Sesión</h2>
        
        <div className="mb-4">
        <label className="block text-gray-700 text-sm font-semibold mb-2">Correo Electrónico</label>
        <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
        />
        </div>

        <div className="mb-6">
        <label className="block text-gray-700 text-sm font-semibold mb-2">Contraseña</label>
        <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
        />
        </div>

        <button
        type="submit"
        className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-all"
        >
        Entrar
        </button>

        {mensaje && (
        <p className="mt-4 text-center text-sm font-medium text-blue-600">{mensaje}</p>
        )}
    </form>
    </div>
);
}

export default Login;