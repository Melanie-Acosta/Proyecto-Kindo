import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function PerfilFamiliar() {
  const [asistentes, setAsistentes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();


  // Cargar solo los asistentes disponibles desde el backend
  useEffect(() => {
    fetch('http://localhost:3000/api/mapa-usuarios') // O puedes crear un endpoint específico o filtrar en el front
      .then((res) => res.json())
      .then((data) => {
        // Filtramos solo los usuarios que sean de rol 'asistente' y estén disponibles
        const soloAsistentes = data.filter(user => user.rol === 'asistente' && user.disponible);
        setAsistentes(soloAsistentes);
        setCargando(false);
      })
      .catch((err) => {
        console.error('Error al cargar asistentes:', err);
        setCargando(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Cabecera */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Panel Familiar - Asistentes Disponibles</h1>
            <p className="text-sm text-gray-500">Encuentra y contacta cuidadores calificados en la zona de Formosa.</p>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
          >
            Cerrar Sesión / Inicio
          </button>
        </div>

        {/* Listado de Asistentes */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 space-y-4">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Cuidadores Listos para Ayudar</h2>

          {cargando ? (
            <p className="text-gray-500 text-center py-8">Cargando asistentes...</p>
          ) : asistentes.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay asistentes disponibles en este momento.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {asistentes.map((asistente) => (
                <div key={asistente.id} className="border border-gray-200 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-gray-900 text-base">
                        {asistente.Person?.nombre || 'Asistente'} {asistente.Person?.apellido || ''}
                      </h3>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        Disponible
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">📍 {asistente.ubicacionTexto || 'Formosa, Argentina'}</p>
                    <p className="text-sm text-gray-600 mt-2"><strong>Especialidad:</strong> {asistente.especialidad || 'Cuidado general gerontológico'}</p>
                  </div>

                  <button 
                    onClick={() => alert(`Contactando a ${asistente.Person?.nombre || 'Asistente'}`)}
                    className="w-full bg-[#556B2F] hover:bg-[#445524] text-white py-2 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Contactar Cuidador
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default PerfilFamiliar;
