import { Router } from "express";
import {
  getAllNotificaciones,
  updateNotificacion
} from "../controllers/notificacion.controller.js";

import { authenticate } from "../middlewares/auth.middlewares.js";

export const notificacionRouter = Router();

// Consultar las notificaciones del usuario que inició sesión
notificacionRouter.get(
  "/notificaciones",
  authenticate,
  getAllNotificaciones
);

// Marcar una notificación propia como leída
notificacionRouter.put(
  "/notificaciones/:id",
  authenticate,
  updateNotificacion
);