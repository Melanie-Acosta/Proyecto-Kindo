import { Router } from "express";
import { createUserFamiliar,
        deleteUserFamiliar,
        getAllUserFamiliares,
        getUserFamiliarById, 
        updateUserFamiliar 
} from "../controllers/userFamiliar.controller.js";

import {validate} from "../middlewares/validate.js"
import {createUserFamiliarValidation, updateUserFamiliarValidation} from "../middlewares/validations/userFamiliar.validation.js"

import {
  getMiPerfilFamiliar,
  updateMiPerfilFamiliar
} from "../controllers/miPerfilFamiliar.controller.js";

import {
  authenticate,

  authorizeRoles
} from "../middlewares/auth.middlewares.js";

export const userFamiliarRouter = Router();

// Ruta para crear el perfil de un familiar
userFamiliarRouter.post("/familiares", createUserFamiliar);

// Ruta para traer todos los familiares
userFamiliarRouter.get("/familiares", getAllUserFamiliares);

// Ruta para traer un familiar por id
userFamiliarRouter.get("/familiares/:id", getUserFamiliarById);

// Ruta para actualizar el perfil de un familiar
userFamiliarRouter.put("/familiares/:id", updateUserFamiliar);

// Ruta para eliminar el perfil de un familiar
userFamiliarRouter.delete("/familiares/:id", deleteUserFamiliar);

// Ruta para consultar el perfil del familiar que inició sesión
userFamiliarRouter.get(
  "/mi-perfil-familiar",
  authenticate,
  authorizeRoles("familiar"),
  getMiPerfilFamiliar
);

// Ruta para actualizar el perfil del familiar que inició sesión
userFamiliarRouter.put(
  "/mi-perfil-familiar",
  authenticate,
  authorizeRoles("familiar"),
  updateMiPerfilFamiliar
);