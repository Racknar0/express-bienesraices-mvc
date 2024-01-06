import { Sequelize } from 'sequelize';

import dotenv from 'dotenv'; //! para usar las variables de entorno
dotenv.config({ path: '.env' }); //! ruta para usar las variables de entorno


const db = new Sequelize(process.env.DB_NOMBRE, process.env.DB_USER, process.env.DB_PASS, {
    
    host: process.env.DB_HOST, // host de la base de datos
    dialect: 'mysql', // tipo de base de datos
    port: '3306', // puerto de mysql
    define: {
        timestamps: true, // esto es para que no se creen los campos de created_at y updated_at
    },
    pool: {
        max: 5, // maximo de conexiones
        min: 0, // minimo de conexiones
        acquire: 30000, // tiempo de adquisicion
        idle: 10000, // tiempo de inactividad
    },
    operatorAliases: false, // esto es para que no salga un warning en la consola de que los operadores estan deprecados
});

export default db;