import "dotenv/config"
import express from "express";
import cors from 'cors'; 
import { startDB } from "./src/config/database.js";
import { Role, User, Person } from "./src/models/index.js"; // <-- Asegúrate de importar Person aquí

import { personRouter } from "./src/routes/person.route.js";
import { userRouter } from "./src/routes/user.route.js";
import { roleRouter } from "./src/routes/role.route.js";
import { userRoleRouter } from "./src/routes/user_role.route.js";
import { userFamiliarRouter } from "./src/routes/userFamiliar.route.js";
import { userAsistenteRouter } from "./src/routes/userAsistente.route.js";
import { taskRouter } from "./src/routes/task.route.js";
import { disponibilidadRouter } from "./src/routes/disponibilidad.route.js";
import { mensajeRouter } from "./src/routes/mensaje.route.js";
import { notificacionRouter } from "./src/routes/notificacion.route.js";
import { valoracionRouter } from "./src/routes/valoracion.route.js";
import { authRouter } from "./src/routes/auth.route.js";


const app = express ();
const PORT = 3000;

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173', // La URL de tu frontend
    credentials: true
}));

app.get('/', (req, res) => {
    res.send('¡Conexión exitosa con el backend de Asistencia Sanitaria!');
});


// ==========================================
// ENDPOINT PARA ALIMENTAR EL MAPA (Adaptado con Include)
// ==========================================
app.get('/api/mapa-usuarios', async (req, res) => {
  try {
    const usuarios = await User.findAll({
      attributes: [
        'id', 
        'rol', 
        'disponible', 
        'especialidad', 
        'adultoMayor', 
        'ubicacionTexto', 
        'lat', 
        'lng'
      ],
      include: [{
        model: Person, // Trae los datos reales de la persona asociada
        attributes: ['nombre', 'apellido'] // Extrae nombre y apellido de la tabla 'people'
      }]
    });
    res.json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios para el mapa:", error);
    res.status(500).json({ error: 'Error al cargar el mapa' });
  }
});


//configuracion de las rutas 

app.use("/api", personRouter);
app.use("/api", userRouter);
app.use("/api", roleRouter);
app.use("/api", userRoleRouter);
app.use("/api", userFamiliarRouter);
app.use("/api", userAsistenteRouter);
app.use("/api", taskRouter);
app.use("/api", disponibilidadRouter);
app.use("/api", mensajeRouter);
app.use("/api", notificacionRouter);
app.use("/api", valoracionRouter);
app.use("/api", authRouter);


app.listen(PORT, async () => {
  await startDB(); // conecta a la base y crea las tablas con sync()

  // Crea los roles una sola vez (si ya existen, no los duplica)
  await Role.findOrCreate({ where: { nombre: "familiar" } });
  await Role.findOrCreate({ where: { nombre: "asistente" } });

  console.log("El servidor listo");
});