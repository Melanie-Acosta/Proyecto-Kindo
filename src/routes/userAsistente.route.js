
import { Router } from "express";

import {
  createUserAsistente,
  getAllUserAsistentes,
  getUserAsistenteById,
  updateUserAsistente,
  deleteUserAsistente
} from "../controllers/userAsistente.controller.js";

import {
  getMiPerfilAsistente,
  updateMiPerfilAsistente
} from "../controllers/miPerfilAsistente.controller.js";

import {
  authenticate,
  authorizeRoles
} from "../middlewares/auth.middlewares.js";

import { validate } from "../middlewares/validate.js";

import {
  createUserAsistenteValidation,
  updateUserAsistenteValidation
} from "../middlewares/validations/userAsistente.validation.js";

export const userAsistenteRouter = Router();

// ==========================================
// RUTAS GENERALES DE ASISTENTES
// ==========================================

// Crear perfil
userAsistenteRouter.post("/asistentes", createUserAsistente);

// Traer todos los asistentes
userAsistenteRouter.get("/asistentes", getAllUserAsistentes);

// Traer asistente por ID
userAsistenteRouter.get("/asistentes/:id", getUserAsistenteById);

// Actualizar asistente por ID
userAsistenteRouter.put("/asistentes/:id", updateUserAsistente);

// Eliminar asistente
userAsistenteRouter.delete("/asistentes/:id", deleteUserAsistente);

// ==========================================
// RUTAS DEL ASISTENTE LOGUEADO
// ==========================================

// Consultar mi perfil
userAsistenteRouter.get(
  "/mi-perfil-asistente",
  authenticate,
  authorizeRoles("asistente"),
  getMiPerfilAsistente
);

// Actualizar mi perfil
userAsistenteRouter.put(
  "/mi-perfil-asistente",
  authenticate,
  authorizeRoles("asistente"),
  updateMiPerfilAsistente
);
