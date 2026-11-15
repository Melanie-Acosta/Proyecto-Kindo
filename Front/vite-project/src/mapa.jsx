
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function Mapa() {
  const [usuariosMapa, setUsuariosMapa] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/mapa-usuarios')
      .then((res) => res.json())
      .then((data) => {
        setUsuariosMapa(data);
      })
      .catch((err) => {
        console.error('Error al cargar los usuarios en el mapa:', err);
      });
  }, []);

  return (
    <div className="max-w-5xl w-full bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100 space-y-4">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            Mapa de Asistentes y Solicitudes en Vivo
          </h3>

          <p className="text-xs text-gray-500">
            Visualiza la disponibilidad de cuidadores y familias activas cerca de tu zona.
          </p>
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

          {Array.isArray(usuariosMapa) && usuariosMapa.map((user) => (
            <Marker
              key={user.id}
              position={[
                user.lat || -26.1849,
                user.lng || -58.1731
              ]}
            >
              <Popup>
                <div className="p-1 space-y-1 text-xs">

                  <span className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                    user.rol === 'asistente'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.rol}
                  </span>

                  <p className="font-bold text-gray-900 text-sm">
                    {user.rol === 'familiar'
                      ? user.nombreAdulto || 'Sin nombre'
                      : `${user.nombre || 'Sin nombre'} ${user.apellido || ''}`}
                  </p>

                  <p className="text-gray-500">
                    📍 {user.zona || 'Formosa, Argentina'}
                  </p>

                  {user.rol === 'asistente' && (
                    <>
                      <p className="text-gray-600">
                        Especialidad: {user.especialidad || 'No especificada'}
                      </p>

                      <p className={`font-semibold ${
                        user.disponibleAhora ? 'text-green-600' : 'text-red-500'
                      }`}>
                        {user.disponibleAhora
                          ? '✓ Disponible ahora'
                          : '✕ No disponible'}
                      </p>
                    </>
                  )}

                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default Mapa;
