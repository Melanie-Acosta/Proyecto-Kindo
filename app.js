
import "dotenv/config";
import express from "express";
import cors from "cors";

import { startDB } from "./src/config/database.js";

import {
  Role,
  User,
  Person,
  UserFamiliar,
  UserAsistente
} from "./src/models/index.js";

// Rutas
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

const app = express();
const PORT = 3000;

// ==========================================
// CONFIGURACIONES
// ==========================================

app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.get("/", (req, res) => {
  res.send("¡Conexión exitosa con el backend de Asistencia Sanitaria!");
});

// ==========================================
// ENDPOINT PARA ALIMENTAR EL MAPA
// ==========================================

app.get("/api/mapa-usuarios", async (req, res) => {
  try {
    const usuarios = await User.findAll({
      attributes: ["id"],
      include: [
        {
          model: Person,
          attributes: ["nombre", "apellido"]
        },
        {
          model: UserFamiliar,
          attributes: ["nombreAdulto", "edadAdulto", "necesidades"]
        },
        {
          model: UserAsistente,
          attributes: ["especialidad", "zona", "disponibleAhora"]
        }
      ]
    });

    const usuariosMapa = usuarios.flatMap((usuario) => {

      // Si tiene perfil de asistente
      if (usuario.UserAsistente) {
        return [{
          id: usuario.id,
          rol: "asistente",
          nombre: usuario.Person?.nombre || "Sin nombre",
          apellido: usuario.Person?.apellido || "",
          especialidad: usuario.UserAsistente.especialidad,
          zona: usuario.UserAsistente.zona,
          disponibleAhora: usuario.UserAsistente.disponibleAhora
        }];
      }

      // Si tiene perfil de familiar
      if (usuario.UserFamiliar) {
        return [{
          id: usuario.id,
          rol: "familiar",
          nombreAdulto: usuario.UserFamiliar.nombreAdulto,
          edadAdulto: usuario.UserFamiliar.edadAdulto,
          necesidades: usuario.UserFamiliar.necesidades
        }];
      }

      return [];
    });

    res.json(usuariosMapa);

  } catch (error) {
    console.error("Error al obtener usuarios para el mapa:", error);

    res.status(500).json({
      error: "Error al cargar el mapa"
    });
  }
});

// ==========================================
// REGISTRO DE RUTAS
// ==========================================

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

// ==========================================
// INICIAR SERVIDOR
// ==========================================

const iniciarServidor = async () => {
  try {
    await startDB();

    // Crear roles si todavía no existen
    await Role.findOrCreate({
      where: { nombre: "familiar" }
    });

    await Role.findOrCreate({
      where: { nombre: "asistente" }
    });

    app.listen(PORT, () => {
      console.log(`El servidor está listo en el puerto ${PORT}`);
    });

  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
  }
};

console.log(
  "¿JWT_SECRET está cargado?",
  Boolean(process.env.JWT_SECRET)
);

iniciarServidor();
