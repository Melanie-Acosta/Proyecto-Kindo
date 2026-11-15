
import React, { useState } from 'react';

export default function AsistentePage() {
 const datosGuardados = JSON.parse(
  localStorage.getItem('usuarioKindo') || 'null'
);

const usuarioGuardado = datosGuardados?.usuario || datosGuardados;

const [perfil, setPerfil] = useState({
  nombre: usuarioGuardado?.nombre || 'Asistente',
  apellido: usuarioGuardado?.apellido || '',
  foto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300',
  disponible: true,
  especialidad: 'Cuidado integral y acompañamiento de adultos mayores',
  ubicacion: 'Formosa, Argentina',
});

  const [solicitudesAgenda] = useState([
    {
      id: 1,
      familiar: 'Carlos Gómez',
      adultoMayor: 'Don José Gómez',
      lugar: 'Av. 25 de Mayo 1230, Formosa',
      horario: 'Lunes a Viernes · 08:00 a 12:00',
      estado: 'Confirmado',
    },
    {
      id: 2,
      familiar: 'María Fernández',
      adultoMayor: 'Doña Carmen Rosa',
      lugar: 'San Martín 450, Formosa',
      horario: 'Martes y Jueves · 14:00 a 18:00',
      estado: 'Pendiente de aceptación',
    },
  ]);

  const [mensaje, setMensaje] = useState('');

  const confirmadas = solicitudesAgenda.filter(
    (item) => item.estado === 'Confirmado'
  ).length;

  const pendientes = solicitudesAgenda.filter(
    (item) => item.estado === 'Pendiente de aceptación'
  ).length;

  const toggleDisponibilidad = () => {
    setPerfil((prev) => ({
      ...prev,
      disponible: !prev.disponible,
    }));

    setMensaje(
      perfil.disponible
        ? 'Ahora figurás como no disponible.'
        : '¡Ahora figurás como disponible!'
    );

    setTimeout(() => setMensaje(''), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F7F8F5] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-7">

        {/* Bienvenida */}
        <section className="flex flex-col justify-between gap-5 rounded-2xl bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:p-8">
          <div>
            <p className="mb-2 text-sm font-medium text-[#71834B]">
              TU ESPACIO DE TRABAJO
            </p>

            <h1 className="text-2xl font-semibold text-gray-800 sm:text-3xl">
              ¡Hola, {perfil.nombre}! 
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-500">
              Este es tu panel de Kindo. Desde acá podés consultar tus
              solicitudes y organizar tus próximos servicios.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-[#F5F7F0] p-4">
            <img
              src={perfil.foto}
              alt="Foto de perfil"
              className="h-14 w-14 rounded-full object-cover"
            />

            <div>
              <p className="font-semibold text-gray-800">
                {perfil.nombre} {perfil.apellido}
              </p>
              <p className="text-xs text-gray-500">
                Asistente Kindo
              </p>
              <p className="mt-1 text-xs text-[#71834B]">
                {perfil.ubicacion}
              </p>
            </div>
          </div>
        </section>

        {/* Mensaje de confirmación */}
        {mensaje && (
          <div className="rounded-xl border border-[#DCE5CE] bg-[#F1F5EA] px-4 py-3 text-sm text-[#556B2F]">
            {mensaje}
          </div>
        )}

        {/* Resumen */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Resumen de actividad
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Un vistazo rápido a tus servicios.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1F5EA] text-[#556B2F]">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="M8 7h12M8 12h12M8 17h12M4 7h.01M4 12h.01M4 17h.01" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-sm text-gray-500">Solicitudes pendientes</p>
              <p className="mt-1 text-3xl font-semibold text-gray-800">
                {pendientes}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1F5EA] text-[#556B2F]">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="m5 12 4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="9" />
                </svg>
              </div>
              <p className="text-sm text-gray-500">Servicios confirmados</p>
              <p className="mt-1 text-3xl font-semibold text-gray-800">
                {confirmadas}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1F5EA] text-[#556B2F]">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-sm text-gray-500">Estado de disponibilidad</p>
              <p className={`mt-2 text-sm font-semibold ${perfil.disponible ? 'text-[#556B2F]' : 'text-gray-500'}`}>
                {perfil.disponible ? 'Disponible' : 'No disponible'}
              </p>
            </div>
          </div>
        </section>

        {/* Disponibilidad */}
        <section className="flex flex-col justify-between gap-4 rounded-2xl border border-[#E5EAD9] bg-[#F1F5EA] p-5 sm:flex-row sm:items-center sm:p-6">
          <div>
            <h2 className="font-semibold text-gray-800">
              Tu disponibilidad
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              {perfil.disponible
                ? 'Los familiares pueden encontrarte como asistente disponible.'
                : 'Actualmente no figurás como disponible para nuevos servicios.'}
            </p>
          </div>

          <button
            type="button"
            onClick={toggleDisponibilidad}
            className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
              perfil.disponible
                ? 'bg-white text-[#556B2F] ring-1 ring-[#D5DFC7] hover:bg-[#F8FAF5]'
                : 'bg-[#556B2F] text-white hover:bg-[#445624]'
            }`}
          >
            {perfil.disponible
              ? 'Pausar disponibilidad'
              : 'Activar disponibilidad'}
          </button>
        </section>

        {/* Agenda */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Mi agenda
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Consultá tus solicitudes y servicios.
              </p>
            </div>

            <span className="w-fit rounded-full bg-[#F1F5EA] px-3 py-1 text-xs font-medium text-[#556B2F]">
              {solicitudesAgenda.length} solicitudes
            </span>
          </div>

          <div className="space-y-3">
            {solicitudesAgenda.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-gray-100 p-4 transition hover:border-[#DCE5CE]"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                        item.estado === 'Confirmado'
                          ? 'bg-[#EDF4E6] text-[#556B2F]'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {item.estado}
                      </span>
                    </div>

                    <h3 className="font-semibold text-gray-800">
                      {item.adultoMayor}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Familiar: {item.familiar}
                    </p>
                  </div>

                  <div className="text-sm text-gray-500 sm:text-right">
                    <p className="font-medium text-gray-700">
                      {item.horario}
                    </p>
                    <p className="mt-2">
                      {item.lugar}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Especialidad */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#71834B]">
            Tu especialidad
          </p>
          <h2 className="mt-2 text-lg font-semibold text-gray-800">
            {perfil.especialidad}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Mantené tu perfil profesional actualizado para que los familiares
            puedan conocer mejor tus servicios.
          </p>
        </section>

      </div>
    </div>
  );
}
