import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { User } from "./user.model.js";

export const Disponibilidad = sequelize.define("Disponibilidad", {
  dia: {
    type: DataTypes.ENUM("lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"),
    allowNull: false
  },
  horaInicio: { 
    type: DataTypes.TIME, 
    allowNull: false 
  },
  horaFin: {
    type: DataTypes.TIME, 
    allowNull: false 
  },
  barrio: { 
    type: DataTypes.STRING, 
    allowNull: false 
  }
});

// Relación: Un usuario (asistente) puede tener múltiples bloques de disponibilidad en su agenda
User.hasMany(Disponibilidad, { foreignKey: 'usuarioId', onDelete: 'CASCADE' });
Disponibilidad.belongsTo(User, { foreignKey: 'usuarioId' });