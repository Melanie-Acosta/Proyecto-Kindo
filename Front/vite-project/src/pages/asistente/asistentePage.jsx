import React, { useState } from 'react';

export default function AsistentePage() {
  const [perfil, setPerfil] = useState({
    nombre: 'Viviana',
    apellido: 'Gamarra',
    email: 'vivianagamarra13@gmail.com',
    telefono: '3704826533',
    especialidad: 'Cuidado integral y acompañamiento de adultos mayores',
    disponible: true,
    tarifaHora: '5000',
    mediosPago: 'Transferencia Bancaria, Mercado Pago, Efectivo',
    ubicacion: 'Formosa, Argentina',
    foto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
  });

  const [solicitudesAgenda, setSolicitudesAgenda] = useState([
    {
      id: 1,
      familiar: 'Carlos Gómez',
      adultoMayor: 'Don José Gómez',
      lugar: 'Av. 25 de Mayo 1230, Formosa',
      horario: 'Lunes a Viernes (08:00 - 12:00)',
      estado: 'Confirmado',
    },
    {
      id: 2,
      familiar: 'María Fernández',
      adultoMayor: 'Doña Carmen Rosa',
      lugar: 'San Martín 450, Formosa',
      horario: 'Martes y Jueves (14:00 - 18:00)',
      estado: 'Pendiente de aceptación',
    },
  ]);

  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const toggleDisponibilidad = () => {
    setPerfil((prev) => ({ ...prev, disponible: !prev.disponible }));
    setMensaje(perfil.disponible ? 'Estado cambiado a: No disponible' : 'Estado cambiado a: Disponible');
    setTimeout(() => setMensaje(''), 3000);
  };

  const handleChange = (e) => {
    setPerfil({ ...perfil, [e.target.name]: e.target.value });
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPerfil((prev) => ({ ...prev, foto: imageUrl }));
    }
  };

  const handleGuardar = (e) => {
    e.preventDefault();
    setEditando(false);
    setMensaje('¡Perfil y tarifas actualizados con éxito!');
    setTimeout(() => setMensaje(''), 3000);
  };

  return (
    <div className="min-h-[85vh] bg-gray-100 py-8 px-4 flex justify-center">
      <div className="max-w-4xl w-full space-y-6">
        
        <div className="bg-[#556B2F] text-white p-6 rounded-xl shadow-md flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Perfil de Asistente</h1>
            <p className="text-xs text-emerald-100 mt-1">Gestiona tu disponibilidad, agenda y datos profesionales en Kindo.</p>
          </div>
          <div className="hidden sm:block text-3xl"></div>
        </div>

        {mensaje && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg text-center font-medium shadow-sm">
            {mensaje}
          </div>
        )}

        {/* Tarjeta de Perfil y Tarifas */}
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row gap-6 items-center md:items-start">
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#556B2F] shadow-inner">
              <img src={perfil.foto} alt="Foto de perfil" className="w-full h-full object-cover" />
            </div>

            {editando && (
              <label className="cursor-pointer text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded-md font-semibold transition">
                Cambiar foto
                <input type="file" accept="image/*" onChange={handleImagenChange} className="hidden" />
              </label>
            )}

            <button
              onClick={toggleDisponibilidad}
              type="button"
              className={`w-full py-2 px-4 rounded-lg text-xs font-bold transition shadow-sm ${
                perfil.disponible
                  ? 'bg-green-100 text-green-800 border border-green-300 hover:bg-green-200'
                  : 'bg-red-100 text-red-800 border border-red-300 hover:bg-red-200'
              }`}
            >
              {perfil.disponible ? '● Disponible para trabajar' : '○ No disponible'}
            </button>
          </div>

          <div className="flex-1 w-full">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-xl font-bold text-gray-800">Mi Perfil y Tarifas</h2>
              <button
                type="button"
                onClick={() => setEditando(!editando)}
                className="text-sm px-4 py-1.5 bg-[#556B2F] text-white rounded-lg hover:bg-[#445624] font-medium transition"
              >
                {editando ? 'Cancelar' : 'Editar Datos'}
              </button>
            </div>

            <form onSubmit={handleGuardar} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={perfil.nombre}
                    onChange={handleChange}
                    disabled={!editando}
                    className="w-full p-2 border rounded-lg bg-gray-50 disabled:bg-gray-100 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Apellido</label>
                  <input
                    type="text"
                    name="apellido"
                    value={perfil.apellido}
                    onChange={handleChange}
                    disabled={!editando}
                    className="w-full p-2 border rounded-lg bg-gray-50 disabled:bg-gray-100 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    name="email"
                    value={perfil.email}
                    onChange={handleChange}
                    disabled={!editando}
                    className="w-full p-2 border rounded-lg bg-gray-50 disabled:bg-gray-100 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Teléfono</label>
                  <input
                    type="text"
                    name="telefono"
                    value={perfil.telefono}
                    onChange={handleChange}
                    disabled={!editando}
                    className="w-full p-2 border rounded-lg bg-gray-50 disabled:bg-gray-100 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Tarifa por Hora ($)</label>
                  <input
                    type="text"
                    name="tarifaHora"
                    value={perfil.tarifaHora}
                    onChange={handleChange}
                    disabled={!editando}
                    className="w-full p-2 border rounded-lg bg-gray-50 disabled:bg-gray-100 text-sm font-semibold text-[#556B2F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Medios de Pago</label>
                  <input
                    type="text"
                    name="mediosPago"
                    value={perfil.mediosPago}
                    onChange={handleChange}
                    disabled={!editando}
                    className="w-full p-2 border rounded-lg bg-gray-50 disabled:bg-gray-100 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Ubicación Actual (Ciudad / Zona)</label>
                <input
                  type="text"
                  name="ubicacion"
                  value={perfil.ubicacion}
                  onChange={handleChange}
                  disabled={!editando}
                  className="w-full p-2 border rounded-lg bg-gray-50 disabled:bg-gray-100 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Especialidad y Experiencia</label>
                <textarea
                  name="especialidad"
                  rows="2"
                  value={perfil.especialidad}
                  onChange={handleChange}
                  disabled={!editando}
                  className="w-full p-2 border rounded-lg bg-gray-50 disabled:bg-gray-100 text-sm"
                />
              </div>

              {editando && (
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#556B2F] text-white rounded-lg text-sm font-semibold hover:bg-[#445624] transition shadow"
                  >
                    Guardar Cambios
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Sección Agenda */}
        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-800 border-b pb-2">Agenda y Solicitudes de Familiares</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {solicitudesAgenda.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 bg-gray-50 space-y-2 shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full">
                    {item.estado}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">{item.horario}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">Familiar: {item.familiar}</p>
                  <p className="text-xs text-gray-600">Paciente / Adulto Mayor: <span className="font-medium">{item.adultoMayor}</span></p>
                </div>
                <div className="text-xs text-gray-700 bg-white p-2 rounded border">
                  📍 <span className="font-semibold">Lugar de servicio:</span> {item.lugar}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mapa */}
        <div className="bg-white rounded-xl shadow-md p-6 space-y-3">
          <h2 className="text-lg font-bold text-gray-800">Mapa de Ubicación y Zona de Cobertura</h2>
          <p className="text-xs text-gray-500">Referencia geográfica actual del asistente para los familiares en la plataforma.</p>
          <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden border relative flex items-center justify-center">
            <div className="absolute inset-0 bg-emerald-50 opacity-50 flex items-center justify-center">
              <span className="text-gray-400 font-semibold tracking-wider">[ Mapa Interactivo - {perfil.ubicacion} ]</span>
            </div>
            <div className="z-10 bg-[#556B2F] text-white px-4 py-2 rounded-full shadow-lg text-xs font-bold flex items-center gap-2 animate-bounce">
              📍 Estás aquí ({perfil.ubicacion})
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}