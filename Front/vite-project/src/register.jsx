import { useState } from 'react';

function Register() {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rol, setRol] = useState('Familiar'); // Valor por defecto
    const [nombreAdultoMayor, setNombreAdultoMayor] = useState('');
    const [mensaje, setMensaje] = useState('');

 const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('REGISTRO: se ejecutó handleSubmit');

    setMensaje('Enviando datos...');

    // El resto de tu código continúa aquí
};

        try {
            // Nota: Asegúrate de que esta ruta coincida con tu backend (ej. /api/register o /api/auth/register)
            const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre,
                    apellido,
                    telefono,
                    email,
                    password,
                    rol,
                    nombreAdultoMayor
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMensaje('¡Registro exitoso!');
                // Limpiar campos si lo deseas
                setNombre('');
                setApellido('');
                setTelefono('');
                setEmail('');
                setPassword('');
                setNombreAdultoMayor('');
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
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Registro Kindo</h2>

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

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Teléfono</label>
                    <input
                        type="tel"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

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

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Rol</label>
                    <select
                        value={rol}
                        onChange={(e) => setRol(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="Familiar">Familiar</option>
                        <option value="Asistente">Asistente</option>
                    </select>
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Nombre del Adulto Mayor</label>
                    <input
                        type="text"
                        value={nombreAdultoMayor}
                        onChange={(e) => setNombreAdultoMayor(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
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