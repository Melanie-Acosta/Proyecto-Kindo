
import { useEffect, useState } from 'react';

function Asistentes() {
  const [asistentes, setAsistentes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [zona, setZona] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const obtenerAsistentes = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/asistentes');

        if (!response.ok) {
          throw new Error('No se pudieron cargar los asistentes.');
        }

        const data = await response.json();
        setAsistentes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error al obtener asistentes:', err);
        setError('No fue posible cargar los asistentes. Intentá nuevamente.');
      } finally {
        setCargando(false);
      }
    };

    obtenerAsistentes();
  }, []);

  const asistentesFiltrados = asistentes.filter((asistente) => {
    const nombre = `${asistente.User?.Person?.nombre || ''} ${
      asistente.User?.Person?.apellido || ''
    }`.toLowerCase();

    const coincideNombre = nombre.includes(busqueda.toLowerCase());

    const coincideZona = !zona ||
      (asistente.zona || '').toLowerCase().includes(zona.toLowerCase());

    const coincideEspecialidad = !especialidad ||
      (asistente.especialidad || '')
        .toLowerCase()
        .includes(especialidad.toLowerCase());

    return coincideNombre && coincideZona && coincideEspecialidad;
  });

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-6xl mx-auto">

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Nuestros asistentes
          </h2>
          <p className="text-gray-600 mt-2">
            Encontrá el acompañamiento adecuado para tu ser querido.
          </p>
        </div>

        {/* Buscador y filtros */}
        <div className="bg-white rounded-2xl shadow-sm border p-5 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre..."
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#556B2F]"
            />

            <input
              type="text"
              value={zona}
              onChange={(e) => setZona(e.target.value)}
              placeholder="Filtrar por zona..."
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#556B2F]"
            />

            <input
              type="text"
              value={especialidad}
              onChange={(e) => setEspecialidad(e.target.value)}
              placeholder="Filtrar por especialidad..."
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#556B2F]"
            />

          </div>
        </div>

        {cargando && (
          <p className="text-center text-gray-600 py-10">
            Cargando asistentes...
          </p>
        )}

        {!cargando && error && (
          <p className="text-center text-red-600 py-10">
            {error}
          </p>
        )}

        {!cargando && !error && asistentesFiltrados.length === 0 && (
          <p className="text-center text-gray-600 py-10">
            No se encontraron asistentes con esos criterios.
          </p>
        )}

        {/* Tarjetas de asistentes */}
        {!cargando && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {asistentesFiltrados.map((asistente) => {
              const nombre = asistente.User?.Person?.nombre || 'Sin nombre';
              const apellido = asistente.User?.Person?.apellido || '';

              return (
                <article
                  key={asistente.id}
                  className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-52 bg-gray-100 flex items-center justify-center">
                    {asistente.foto ? (
                      <img
                        src={asistente.foto}
                        alt={`Foto de ${nombre}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-5xl font-bold">
                        {nombre.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="p-5 space-y-3">

                    <h3 className="text-xl font-bold text-gray-800">
                      {nombre} {apellido}
                    </h3>

                    <p className="text-sm text-gray-600">
                      {asistente.descripcion || 'Sin descripción disponible.'}
                    </p>

                    <div className="text-sm text-gray-600 space-y-2">
                      <p>
                        <strong>Experiencia:</strong>{' '}
                        {asistente.experiencia || 'No especificada'}
                      </p>

                      <p>
                        <strong>Especialidad:</strong>{' '}
                        {asistente.especialidad || 'No especificada'}
                      </p>

                      <p>
                        <strong>Zona:</strong>{' '}
                        {asistente.zona || 'No especificada'}
                      </p>

                      <p>
                        <strong>Tarifa:</strong>{' '}
                        {asistente.tarifa
                          ? `$${asistente.tarifa}`
                          : 'A consultar'}
                      </p>
                    </div>

                    <div>
                      {asistente.disponibleAhora === true ? (
                        <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                          Disponible ahora
                        </span>
                      ) : asistente.disponibleAhora === false ? (
                        <span className="inline-block bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">
                          No disponible
                        </span>
                      ) : (
                        <span className="inline-block bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                          Disponibilidad sin especificar
                        </span>
                      )}
                    </div>

                  </div>
                </article>
              );
            })}

          </div>
        )}

      </div>
    </main>
  );
}

export default Asistentes;
