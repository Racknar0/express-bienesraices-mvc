import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Precio = db.define('precios', {
    nombre: {
        type: DataTypes.STRING(100), // tipo de dato string con una longitud de 100 caracteres
        allowNull: false, // no permite valores nulos
    },
});


export default Precio;