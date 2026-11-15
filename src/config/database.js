import { Sequelize } from "sequelize";
import mysql from 'mysql2/promise';

// conexion a la base de datos con Sequelize
export const sequelize = new Sequelize("Proyecto_kindo", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

// testear la conexion y actualizar la estructura con { alter: true }
export const startDB = async () => {
  try {
    await sequelize.authenticate();
    
    // { alter: true } actualiza las tablas con las nuevas columnas sin borrar tus datos
  await sequelize.sync();
    
    console.log("Conexion a la db esta lista y modelos sincronizados");
   } catch (error) {
  console.error("No se pudo conectar a la db:", error);
  throw error;
}
  };
// conexion por pool para consultas directas
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',        
    password: '',        
    database: 'Proyecto_kindo'
});

export default pool;

