import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';

// Importación obligatoria de los estilos de Leaflet para que no se rompa el mapa
import 'leaflet/dist/leaflet.css';

// Corrección de los iconos por defecto de Leaflet en React y Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function Inicio() {
  const tarjetas = [
    {
      titulo: 'Profesionales Verificados',
      descripcion: 'Asistentes sanitarios con referencias comprobadas y experiencia en cuidado gerontológico.',
    },
    {
      titulo: 'Seguro y Confiable',
      descripcion: 'Canales de contacto directos y seguros pensados para la tranquilidad de toda la familia.',
    },
    {
      titulo: 'Rápido Acceso',
      descripcion: 'Encuentra y contacta ayuda cerca de tu ubicación de forma ágil cuando más lo necesitas.',
    },
    {
      titulo: 'Atención Personalizada',
      descripcion: 'Planes de cuidado adaptados a las necesidades específicas de cada persona mayor.',
    },
  ];

  const [indiceActual, setIndiceActual] = useState(0);

  // Estados para almacenar los usuarios del mapa y la sesión del usuario actual
  const [usuariosMapa, setUsuariosMapa] = useState([]);
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const [adultoMayor, setAdultoMayor] = useState('');

  // Cargar los usuarios reales desde tu backend al abrir la página y leer el usuario logueado
  useEffect(() => {
    fetch('http://localhost:3000/api/mapa-usuarios')
      .then((res) => res.json())
      .then((data) => {
        setUsuariosMapa(data);
      })
      .catch((err) => {
        console.error('Error al cargar los usuarios en el mapa:', err);
      });

    // Leer el usuario guardado en localStorage al iniciar sesión o registrarse
    const usuarioGuardado = JSON.parse(localStorage.getItem('usuarioKindo'));
    if (usuarioGuardado) {
      setUsuarioLogueado(usuarioGuardado);
      setAdultoMayor(usuarioGuardado.adultoMayor || '');
    }
  }, []);

  // Función para actualizar los datos del adulto mayor en el backend y en el localStorage
  const actualizarAdultoMayor = () => {
    if (!usuarioLogueado) return;

    fetch(`http://localhost:3000/api/usuarios/${usuarioLogueado.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adultoMayor })
    })
      .then(res => res.json())
      .then(data => {
        alert('¡Datos del adulto mayor actualizados con éxito!');
        // Actualizamos el localStorage con el nuevo valor
        const usuarioActualizado = { ...usuarioLogueado, adultoMayor };
        localStorage.setItem('usuarioKindo', JSON.stringify(usuarioActualizado));
        setUsuarioLogueado(usuarioActualizado);
      })
      .catch(err => console.error('Error al actualizar:', err));
  };

  const anterior = () => {
    setIndiceActual((prev) => (prev === 0 ? tarjetas.length - 1 : prev - 1));
  };

  const siguiente = () => {
    setIndiceActual((prev) => (prev === tarjetas.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-[85vh] bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-between">
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 space-y-12">
        
        {/* Recuadro principal con imagen al lado */}
        <div className="max-w-5xl w-full bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 md:flex md:items-center md:space-x-10">
          <div className="md:w-1/2 text-left mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4 leading-tight">
              Cuidado y confianza para tus seres queridos
            </h2>
            <p className="text-base text-gray-600 leading-relaxed">
              Somos una plataforma dedicada a mejorar la calidad de vida de los adultos mayores, facilitando su conexión con asistentes sanitarios calificados, empáticos y de confianza. Nos encargamos de brindar la tranquilidad que las familias necesitan, asegurando una atención humana y personalizada.
            </p>
          </div>

          <div className="md:w-1/2">
            <img 
              src="imagen.png" 
              alt="Cuidado de adultos mayores" 
              className="w-full h-64 md:h-72 object-contain rounded-2xl shadow-md border border-gray-100" 
            />
          </div>
        </div>

        {/* Panel exclusivo para el rol Familiar (Personalizar adulto mayor a cargo) */}
        {usuarioLogueado?.rol === 'familiar' && (
          <div className="max-w-5xl w-full bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100 space-y-4">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Panel de Control Familiar</h3>
              <p className="text-xs text-gray-500">Personaliza la información del familiar a tu cargo que visualizan los asistentes en el mapa.</p>
            </div>
            <div className="flex flex-col md:flex-row gap-3 items-center">
              <input 
                type="text" 
                value={adultoMayor} 
                onChange={(e) => setAdultoMayor(e.target.value)}
                placeholder="Nombre del adulto mayor o notas de cuidado"
                className="flex-grow w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#556B2F]"
              />
              <button 
                onClick={actualizarAdultoMayor}
                className="w-full md:w-auto bg-[#556B2F] hover:bg-[#445524] text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        )}

        {/* Sección del Mapa Interactivo conectado a la Base de Datos */}
        <div className="max-w-5xl w-full bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100 space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Mapa de Asistentes y Solicitudes en Vivo</h3>
              <p className="text-xs text-gray-500">Visualiza la disponibilidad de cuidadores y familias activas cerca de tu zona.</p>
            </div>
            <div className="flex gap-2 text-xs font-semibold">
              <span className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full border border-green-300">
                ● Asistentes
              </span>
              <span className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full border border-blue-300">
                📍 Familias
              </span>
            </div>
          </div>

          <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-md border relative z-0">
            <MapContainer 
              center={[-26.1849, -58.1731]} 
              zoom={11} 
              minZoom={9} 
              maxZoom={15}
              maxBounds={[
                [-27.5, -62.5], 
                [-22.0, -56.5]  
              ]}
              maxBoundsViscosity={1.0}
              scrollWheelZoom={false} 
              style={{ width: '100%', height: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Se recorren los usuarios reales que vienen de la BD validando que sea un arreglo */}
              {Array.isArray(usuariosMapa) && usuariosMapa.map((user) => (
                <Marker key={user.id} position={[user.lat || -26.1849, user.lng || -58.1731]}>
                  <Popup>
                    <div className="p-1 space-y-1 text-xs">
                      <span className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                        user.rol === 'asistente' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.rol}
                      </span>
                      
                      <p className="font-bold text-gray-900 text-sm">
                        {user.Person?.nombre || 'Sin Nombre'} {user.Person?.apellido || ''}
                      </p>

                      <p className="text-gray-500">
                        📍 {user.ubicacionTexto || 'Formosa, Argentina'}
                      </p>
                      
                      {user.rol === 'asistente' ? (
                        <>
                          <p className="text-gray-600">Especialidad: {user.especialidad || 'No especificada'}</p>
                          <p className={`font-semibold ${user.disponible ? 'text-green-600' : 'text-red-500'}`}>
                            {user.disponible ? '✓ Disponible ahora' : '✕ No disponible'}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-gray-600">Paciente: {user.adultoMayor || 'No especificado'}</p>
                        </>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Ruleta / Carrusel de Tarjetas Abajo */}
        <div className="relative max-w-xl w-full px-4">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-left transition-all duration-300 min-h-[180px] flex flex-col justify-center">
            <div className="w-10 h-10 bg-[#556B2F]/10 rounded-lg flex items-center justify-center text-[#556B2F] font-bold mb-4 text-lg">
              ✓
            </div>
            <h3 className="font-bold text-gray-800 text-xl mb-2">
              {tarjetas[indiceActual].titulo}
            </h3>
            <p className="text-gray-600 text-base">
              {tarjetas[indiceActual].descripcion}
            </p>
          </div>

          <button
            onClick={anterior}
            className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white text-[#556B2F] hover:bg-[#556B2F] hover:text-white p-3 rounded-full shadow-md transition-colors border border-gray-100 font-bold"
            aria-label="Anterior"
          >
            &#10094;
          </button>

          <button
            onClick={siguiente}
            className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white text-[#556B2F] hover:bg-[#556B2F] hover:text-white p-3 rounded-full shadow-md transition-colors border border-gray-100 font-bold"
            aria-label="Siguiente"
          >
            &#10095;
          </button>

          <div className="flex justify-center space-x-2 mt-6">
            {tarjetas.map((_, index) => (
              <button
                key={index}
                onClick={() => setIndiceActual(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === indiceActual
                    ? 'bg-[#556B2F] w-6'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

      </main>

      <footer className="bg-white border-t py-6 text-center text-gray-500 text-sm">
        &copy; 2026 Kindo. Todos los derechos reservados.
      </footer>
    </div>
  );
}

export default Inicio;