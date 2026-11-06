import { Sequelize } from "sequelize";
import mysql from 'mysql2/promise';

// conexion a la base de datos con Sequelize
export const sequelize = new Sequelize("Proyecto_kindo", "root", "", {
host: "localhost",
dialect: "mysql",
});

// testear la conexion
export const startDB = async () => {
try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Conexion a la db esta lista");
} catch (error) {
    console.error("No se pudo conectar a la db:", error);
}
};

// conexion por pool para consultas directas
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',        
    password: '',        
    database: 'Proyecto_kindo'
});

export default pool; // <-- ¡Esto es lo que faltaba para que person.validation.js no falle!