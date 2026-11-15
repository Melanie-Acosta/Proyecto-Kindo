
import { useState, useEffect } from "react";

function MiPerfilFamiliar() {
  const [perfil, setPerfil] = useState({
    nombre: "",
    apellido: "",
    email: "",
    nombreAdulto: "",
    edadAdulto: "",
    necesidades: ""
  });

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const token = localStorage.getItem("token");

  // Obtener los datos del perfil
  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const respuesta = await fetch(
          "http://localhost:3000/api/mi-perfil-familiar",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await respuesta.json();

        if (!respuesta.ok) {
          throw new Error(data.message || "No se pudo cargar el perfil.");
        }

        setPerfil({
          nombre: data.User?.Person?.nombre || "",
          apellido: data.User?.Person?.apellido || "",
          email: data.User?.email || "",
          nombreAdulto: data.nombreAdulto || "",
          edadAdulto: data.edadAdulto ?? "",
          necesidades: data.necesidades || ""
        });

      } catch (error) {
        setMensaje(error.message);
      } finally {
        setCargando(false);
      }
    };

    cargarPerfil();
  }, [token]);

  // Actualizar los datos editables
  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setPerfil({
      ...perfil,
      [name]: value
    });
  };

  // Guardar los cambios
  const guardarPerfil = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje("");

    try {
      const respuesta = await fetch(
        "http://localhost:3000/api/mi-perfil-familiar",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            nombreAdulto: perfil.nombreAdulto,
            edadAdulto: perfil.edadAdulto === "" ? null : Number(perfil.edadAdulto),
            necesidades: perfil.necesidades
          })
        }
      );

      const data = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(data.message || "No se pudo actualizar el perfil.");
      }

      setMensaje("¡Perfil actualizado correctamente!");

    } catch (error) {
      setMensaje(error.message);
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return <p className="text-center p-10">Cargando perfil...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-6">

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h1 className="text-2xl font-bold text-gray-800">
            Mi perfil
          </h1>
          <p className="text-gray-500 mt-2">
            Consulta y administra la información de tu cuenta familiar.
          </p>
        </div>

        <form onSubmit={guardarPerfil} className="space-y-6">

          {/* Datos del titular de la cuenta */}
          <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
            <h2 className="text-lg font-bold text-gray-800">
              Datos del titular de la cuenta
            </h2>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Nombre
              </label>
              <input
                type="text"
                value={perfil.nombre}
                readOnly
                className="w-full border rounded-lg p-3 bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Apellido
              </label>
              <input
                type="text"
                value={perfil.apellido}
                readOnly
                className="w-full border rounded-lg p-3 bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                value={perfil.email}
                readOnly
                className="w-full border rounded-lg p-3 bg-gray-100"
              />
            </div>
          </div>

          {/* Datos del adulto mayor */}
          <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
            <h2 className="text-lg font-bold text-gray-800">
              Datos del adulto mayor a cargo
            </h2>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Nombre completo
              </label>
              <input
                type="text"
                name="nombreAdulto"
                value={perfil.nombreAdulto}
                onChange={manejarCambio}
                required
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Edad
              </label>
              <input
                type="number"
                name="edadAdulto"
                value={perfil.edadAdulto}
                onChange={manejarCambio}
                min="1"
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Necesidades y cuidados especiales
              </label>
              <textarea
                name="necesidades"
                value={perfil.necesidades}
                onChange={manejarCambio}
                rows="4"
                className="w-full border rounded-lg p-3"
                placeholder="Describe las necesidades del adulto mayor..."
              />
            </div>
          </div>

          {mensaje && (
            <p className="text-center text-sm font-semibold text-[#556B2F]">
              {mensaje}
            </p>
          )}

          <button
            type="submit"
            disabled={guardando}
            className="w-full bg-[#556B2F] hover:bg-[#445524] disabled:opacity-50 text-white py-3 rounded-xl font-semibold"
          >
            {guardando ? "Guardando..." : "Guardar cambios"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default MiPerfilFamiliar;
