
import { useState } from 'react';
import Mapa from './mapa.jsx';

function Inicio() {
  const tarjetas = [
    {
      titulo: 'Tranquilidad en tiempo real:',
      descripcion:
        'Se acabaron la incertidumbre y la ansiedad de no saber cómo está tu familiar mientras trabajas o estás lejos.',
      imagen:
        'https://static.vecteezy.com/system/resources/previews/017/647/767/non_2x/telling-bad-news-on-phone-2d-isolated-illustration-crying-man-with-smartphone-feeling-anxiety-flat-character-on-cartoon-background-colorful-editable-scene-for-mobile-website-presentation-vector.jpg',
      numero: '01',
    },
    {
      titulo: 'Seguro y Confiable',
      descripcion:
        'Canales de contacto directos y seguros pensados para la tranquilidad de toda la familia.',
      imagen:
        'https://i.pinimg.com/736x/a8/04/1d/a8041dd3482f3d7d0cda7f183917ef6f.jpg',
      numero: '02',
    },
    {
      titulo: 'Rápido Acceso',
      descripcion:
        'Encuentra y contacta ayuda cerca de tu ubicación de forma ágil cuando más lo necesitas.',
      imagen:
        'https://img.magnific.com/vector-gratis/pin-ubicacion-mapa_78370-9610.jpg?semt=ais_hybrid&w=740&q=80',
      numero: '03',
    },
    {
      titulo: 'Atención Personalizada',
      descripcion:
        'Planes de cuidado adaptados a las necesidades específicas de cada persona.',
      imagen:
        'https://img.magnific.com/vector-gratis/fondo-enfermera-ayudando-paciente_23-2148151551.jpg',
      numero: '04',
    },
  ];

  const [indiceActual, setIndiceActual] = useState(0);

  const anterior = () => {
    setIndiceActual((prev) =>
      prev === 0 ? tarjetas.length - 1 : prev - 1
    );
  };

  const siguiente = () => {
    setIndiceActual((prev) =>
      prev === tarjetas.length - 1 ? 0 : prev + 1
    );
  };

  const tarjeta = tarjetas[indiceActual];

  return (
    <div className="min-h-[85vh] bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-between">

      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 space-y-12">

        {/* Recuadro principal */}
        <div className="max-w-5xl w-full bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 md:flex md:items-center md:space-x-10">

          <div className="md:w-1/2 text-left mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4 leading-tight">
              Cuidado y confianza para tus seres queridos
            </h2>

            <p className="text-base text-gray-600 leading-relaxed">
             Somos una plataforma dedicada a mejorar la calidad de vida de quienes necesitan asistencia sanitaria, facilitando su conexión con asistentes capacitados, empáticos y de confianza. Nos encargamos de brindar la tranquilidad que las familias necesitan, asegurando una atención humana y personalizada.
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

        {/* Mapa */}
        <Mapa />

        {/* Carrusel minimalista */}
        <section className="w-full max-w-4xl px-4">

          <div className="text-center mb-8">
            <p className="text-sm font-semibold tracking-widest text-[#71834B] uppercase mb-2">
              ¿Por qué elegir Kindo?
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Cuidamos lo que más importa
            </h2>
          </div>

          <div className="relative bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">

            <div className="grid md:grid-cols-2">

              {/* Imagen */}
              <div className="relative h-56 md:h-80">
                <img
                  key={tarjeta.imagen}
                  src={tarjeta.imagen}
                  alt={tarjeta.titulo}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                <span className="absolute bottom-5 left-5 text-white text-sm font-semibold tracking-widest">
                  KINDO · {tarjeta.numero}
                </span>
              </div>

              {/* Texto */}
              <div className="flex flex-col justify-center p-8 md:p-10 text-left">

                <div className="w-12 h-1 bg-[#71834B] rounded-full mb-6" />

                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                  {tarjeta.titulo}
                </h3>

                <p className="text-gray-500 leading-relaxed text-base mb-8">
                  {tarjeta.descripcion}
                </p>

                <div className="flex items-center gap-3">
                  <span className="text-[#71834B] font-semibold text-sm">
                    {tarjeta.numero}
                  </span>

                  <div className="h-px flex-1 bg-gray-200" />

                  <span className="text-gray-400 text-sm">
                    0{tarjetas.length}
                  </span>
                </div>
              </div>

            </div>

            {/* Flechas */}
            <button
              onClick={anterior}
              aria-label="Anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/95 text-[#556B2F] hover:bg-[#556B2F] hover:text-white w-10 h-10 rounded-full shadow-md transition-all duration-300 flex items-center justify-center"
            >
              &#10094;
            </button>

            <button
              onClick={siguiente}
              aria-label="Siguiente"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/95 text-[#556B2F] hover:bg-[#556B2F] hover:text-white w-10 h-10 rounded-full shadow-md transition-all duration-300 flex items-center justify-center"
            >
              &#10095;
            </button>

          </div>

          {/* Indicadores */}
          <div className="flex justify-center items-center gap-2 mt-6">
            {tarjetas.map((_, index) => (
              <button
                key={index}
                onClick={() => setIndiceActual(index)}
                aria-label={`Ir a tarjeta ${index + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === indiceActual
                    ? 'w-8 bg-[#71834B]'
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

        </section>

      </main>

      <footer className="bg-white border-t py-6 text-center text-gray-500 text-sm">
        &copy; 2026 Kindo. Todos los derechos reservados.
      </footer>

    </div>
  );
}

export default Inicio;
