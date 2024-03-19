import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Categoria = db.define('categorias', {
    nombre: {
        type: DataTypes.STRING(100), // tipo de dato string con una longitud de 100 caracteres
        allowNull: false, // no permite valores nulos
    },
});


export default Categoria;