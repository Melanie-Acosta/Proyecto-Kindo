import { body } from "express-validator";
import pool from "../../config/database.js";

export const createPersonValidation = [
body("nombre").notEmpty().withMessage("Debe ingresar el nombre."),
body("apellido").notEmpty().withMessage("Debe ingresar el apellido."),
body("telefono")
    .optional({ checkFalsy: true }) // Permite que se envíe vacío sin dar error 400
    .custom(async (value) => {
    if (!value) return true;
      const [rows] = await pool.query("SELECT * FROM personas WHERE telefono = ?", [value]);
    if (rows.length > 0) {
        throw new Error("Este número de teléfono ya está registrado.");
    }
    return true;
    }),
];

export const updatePersonValidation = [
body("nombre").optional().notEmpty().withMessage("El nombre no puede quedar vacío."),
body("apellido").optional().notEmpty().withMessage("El apellido no puede quedar vacío."),
];