import "dotenv/config"
import express from "express";
import cors from 'cors'; // Importar cors
import { startDB } from "./src/config/database.js";
import { Role } from "./src/models/index.js"; // carga los modelos y las relaciones

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




