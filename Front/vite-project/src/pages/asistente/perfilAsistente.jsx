
import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3000/api';

const FOTO_DEFAULT =
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500';

const perfilInicial = {
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  foto: FOTO_DEFAULT,
  especialidad: '',
  experiencia: '',
  descripcion: '',
  tarifaHora: '',
  ubicacion: '',
  disponible: false,
};

function obtenerDatosGuardados() {
  try {
    return JSON.parse(localStorage.getItem('usuarioKindo') || 'null');
  } catch {
    return null;
  }
}

function convertirPerfil(perfil) {
  const persona = perfil.User?.Person || {};

  return {
    nombre: persona.nombre || '',
    apellido: persona.apellido || '',
    email: perfil.User?.email || '',
    telefono: persona.telefono || '',
    foto: perfil.foto || FOTO_DEFAULT,
    especialidad: perfil.especialidad || '',
    experiencia: perfil.experiencia || '',
    descripcion: perfil.descripcion || '',
    tarifaHora: perfil.tarifa ?? '',
    ubicacion: perfil.zona || '',
    disponible: Boolean(perfil.disponibleAhora),
  };
}

export default function PerfilAsistente() {
  const [perfil, setPerfil] = useState(perfilInicial);
  const [perfilOriginal, setPerfilOriginal] = useState(perfilInicial);

  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const datosGuardados = obtenerDatosGuardados();
  const token =
    datosGuardados?.token ||
    datosGuardados?.usuario?.token ||
    localStorage.getItem('token');

  // ==========================================
  // CARGAR PERFIL DESDE EL BACKEND
  // ==========================================
  useEffect(() => {
    const cargarPerfil = async () => {
      if (!token) {
        setError('No se encontró tu sesión. Por favor, iniciá sesión nuevamente.');
        setCargando(false);
        return;
      }

      try {
        const respuesta = await fetch(
          `${API_URL}/mi-perfil-asistente`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {
          throw new Error(datos.message || 'No se pudo cargar el perfil.');
        }

        const perfilCargado = convertirPerfil(datos);

        setPerfil(perfilCargado);
        setPerfilOriginal(perfilCargado);
      } catch (error) {
        console.error('Error al cargar el perfil:', error);
        setError(error.message || 'Ocurrió un error al cargar tu perfil.');
      } finally {
        setCargando(false);
      }
    };

    cargarPerfil();
  }, [token]);

  // ==========================================
  // MODIFICAR CAMPOS
  // ==========================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setPerfil((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // GUARDAR PERFIL EN LA BASE DE DATOS
  // ==========================================
  const handleGuardar = async (e) => {
    e.preventDefault();

    setMensaje('');
    setError('');

    if (!token) {
      setError('Tu sesión no es válida. Iniciá sesión nuevamente.');
      return;
    }

    setGuardando(true);

    try {
      const datosParaEnviar = {
        nombre: perfil.nombre,
        apellido: perfil.apellido,
        email: perfil.email,
        telefono: perfil.telefono,
        especialidad: perfil.especialidad,
        experiencia: perfil.experiencia,
        descripcion: perfil.descripcion,
        tarifa: perfil.tarifaHora === '' ? null : Number(perfil.tarifaHora),
        zona: perfil.ubicacion,
        disponibleAhora: perfil.disponible,
      };

      // Solo enviamos la foto si es una URL guardable.
      if (perfil.foto && !perfil.foto.startsWith('blob:')) {
        datosParaEnviar.foto = perfil.foto;
      }

      const respuesta = await fetch(
        `${API_URL}/mi-perfil-asistente`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(datosParaEnviar),
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.message || 'No se pudieron guardar los cambios.');
      }

      const perfilActualizado = convertirPerfil(datos.perfil);

      setPerfil(perfilActualizado);
      setPerfilOriginal(perfilActualizado);
      setEditando(false);
      setMensaje('¡Tus datos se actualizaron correctamente!');

    } catch (error) {
      console.error('Error al guardar el perfil:', error);
      setError(error.message || 'No se pudieron guardar los cambios.');
    } finally {
      setGuardando(false);
    }
  };

  // ==========================================
  // CANCELAR EDICIÓN
  // ==========================================
  const cancelarEdicion = () => {
    setPerfil(perfilOriginal);
    setEditando(false);
    setMensaje('');
    setError('');
  };

  const campoClase =
    'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#71834B] focus:ring-2 focus:ring-[#71834B]/10 disabled:bg-gray-50 disabled:text-gray-500';

  // ==========================================
  // ESTADO DE CARGA
  // ==========================================
  if (cargando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F8F5]">
        <p className="text-sm text-[#556B2F]">
          Cargando tu perfil...
        </p>
      </div>
    );
  }

  // ==========================================
  // VISTA DEL PERFIL
  // ==========================================
  return (
    <div className="min-h-screen bg-[#F7F8F5] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">

        {/* Encabezado */}
        <div className="mb-2">
          <p className="text-sm font-medium uppercase tracking-wider text-[#71834B]">
            Mi espacio profesional
          </p>

          <h1 className="mt-2 text-2xl font-semibold text-gray-800 sm:text-3xl">
            Mi perfil
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Presentate ante las familias y compartí tu experiencia profesional.
          </p>
        </div>

        {/* Mensajes */}
        {mensaje && (
          <div className="rounded-xl border border-[#DCE5CE] bg-[#F1F5EA] px-5 py-3 text-sm text-[#556B2F]">
            {mensaje}
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Tarjeta principal */}
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">

          {/* Franja verde */}
          <div className="relative h-32 bg-[#556B2F] sm:h-40">
            <div className="flex h-full items-start justify-end p-5">
              <span className="rounded-full border border-white/30 bg-white/15 px-4 py-2 text-xs font-medium text-white">
                Kindo · Perfil profesional
              </span>
            </div>
          </div>

          {/* Foto y nombre */}
          <div className="px-5 pb-7 sm:px-8">
            <div className="relative -mt-[74px] flex flex-col gap-4 sm:-mt-[82px] sm:flex-row sm:items-center">

              <div className="relative z-10 h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-md sm:h-36 sm:w-36">
                <img
                  src={perfil.foto}
                  alt="Foto de perfil"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="relative z-0 flex min-h-[76px] flex-1 flex-col justify-center rounded-3xl border border-[#DCE5CE] bg-white px-6 py-4 shadow-sm sm:-ml-3 sm:mt-2 sm:rounded-full sm:pl-8">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-semibold text-gray-800 sm:text-2xl">
                    {perfil.nombre} {perfil.apellido}
                  </h2>

                  <span className="rounded-full bg-[#F1F5EA] px-3 py-1 text-xs font-medium text-[#556B2F]">
                    Asistente
                  </span>
                </div>

                <p className="mt-1 text-sm text-gray-500">
                  {perfil.especialidad}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  {perfil.ubicacion}
                </p>
              </div>

              <div className="relative z-10 sm:ml-2">
                {!editando && (
                  <button
                    type="button"
                    onClick={() => {
                      setMensaje('');
                      setError('');
                      setEditando(true);
                    }}
                    className="rounded-full bg-[#556B2F] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#435526]"
                  >
                    Editar perfil
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleGuardar} className="space-y-6">

          {/* Datos personales */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-lg font-semibold text-gray-800">
              Información personal
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Tus datos de contacto y presentación.
            </p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Nombre
                </label>
                <input
                  name="nombre"
                  value={perfil.nombre}
                  onChange={handleChange}
                  disabled={!editando}
                  required
                  className={campoClase}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Apellido
                </label>
                <input
                  name="apellido"
                  value={perfil.apellido}
                  onChange={handleChange}
                  disabled={!editando}
                  required
                  className={campoClase}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  value={perfil.email}
                  onChange={handleChange}
                  disabled={!editando}
                  required
                  className={campoClase}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Teléfono
                </label>
                <input
                  name="telefono"
                  value={perfil.telefono}
                  onChange={handleChange}
                  disabled={!editando}
                  className={campoClase}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Ubicación
                </label>
                <input
                  name="ubicacion"
                  value={perfil.ubicacion}
                  onChange={handleChange}
                  disabled={!editando}
                  className={campoClase}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Foto de perfil
                </label>
                <input
                  value="La carga de imágenes estará disponible próximamente"
                  disabled
                  className={campoClase}
                />
              </div>
            </div>
          </div>

          {/* Información profesional */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-lg font-semibold text-gray-800">
              Perfil profesional
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Contales a las familias qué servicios ofrecés.
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Especialidad
                </label>
                <input
                  name="especialidad"
                  value={perfil.especialidad}
                  onChange={handleChange}
                  disabled={!editando}
                  className={campoClase}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Experiencia
                </label>
                <input
                  name="experiencia"
                  value={perfil.experiencia}
                  onChange={handleChange}
                  disabled={!editando}
                  placeholder="Ej. 5 años de experiencia"
                  className={campoClase}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={perfil.descripcion}
                  onChange={handleChange}
                  disabled={!editando}
                  rows={4}
                  className={campoClase}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-600">
                    Tarifa por hora ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    name="tarifaHora"
                    value={perfil.tarifaHora}
                    onChange={handleChange}
                    disabled={!editando}
                    className={campoClase}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Disponibilidad */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-lg font-semibold text-gray-800">
              Disponibilidad
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Indicá si actualmente estás disponible para nuevas solicitudes.
            </p>

            <label className="mt-5 flex items-center gap-3">
              <input
                type="checkbox"
                checked={perfil.disponible}
                onChange={(e) =>
                  setPerfil((prev) => ({
                    ...prev,
                    disponible: e.target.checked,
                  }))
                }
                disabled={!editando}
                className="h-5 w-5 accent-[#556B2F]"
              />

              <span className="text-sm font-medium text-gray-700">
                Estoy disponible para trabajar
              </span>
            </label>
          </div>

          {/* Botones */}
          {editando && (
            <div className="flex flex-wrap justify-end gap-3 pb-6">
              <button
                type="button"
                onClick={cancelarEdicion}
                disabled={guardando}
                className="rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={guardando}
                className="rounded-full bg-[#556B2F] px-7 py-3 text-sm font-medium text-white transition hover:bg-[#435526] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {guardando ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
