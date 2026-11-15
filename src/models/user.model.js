import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { Person } from './person.model.js';

export const User = sequelize.define("User", {
  email: { 
    type: DataTypes.STRING, 
    allowNull: false,
    unique: true, 
    validate: { isEmail: true } 
  },
  password: {
    type: DataTypes.STRING, 
    allowNull: false 
  },
  // Nuevos campos para los roles y el mapa de Kindo:
  rol: {
    type: DataTypes.ENUM('asistente', 'familiar'),
    allowNull: false,
    defaultValue: 'familiar'
  },
  disponible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  tarifaHora: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  mediosPago: {
    type: DataTypes.STRING,
    allowNull: true
  },
  especialidad: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  adultoMayor: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ubicacionTexto: {
    type: DataTypes.STRING,
    defaultValue: 'Formosa, Argentina'
  },
  lat: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: -26.1849 // Coordenada por defecto de Formosa, Capital
  },
  lng: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: -58.1731
  }
});

User.belongsTo(Person, { foreignKey: 'personId', onDelete: 'CASCADE' });
Person.hasMany(User, { foreignKey: 'personId' });