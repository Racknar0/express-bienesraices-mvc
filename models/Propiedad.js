import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Propiedad = db.define('propiedades', {
    id: {
        type: DataTypes.UUID, // tipo de dato UUID que es un identificador unico
        defaultValue: DataTypes.UUIDV4, // valor por defecto que se le asigna al campo
        allowNull: false, // no permite valores nulos
        primaryKey: true, // es una llave primaria
    },
    titulo: {
        type: DataTypes.STRING(150), // tipo de dato string con una longitud de 150 caracteres
        allowNull: false, // no permite valores nulos
    },
    descripcion: {
        type: DataTypes.TEXT, // tipo de dato texto
        allowNull: false, // no permite valores nulos
    },
    habitaciones: {
        type: DataTypes.INTEGER, // tipo de dato entero
        allowNull: false, // no permite valores nulos
    },
    estacionamiento: {
        type: DataTypes.INTEGER, // tipo de dato entero
        allowNull: false, // no permite valores nulos
    },
    wc: {
        type: DataTypes.INTEGER, // tipo de dato entero
        allowNull: false, // no permite valores nulos
    },
    calle: {
        type: DataTypes.STRING(150), // tipo de dato string con una longitud de 150 caracteres
        allowNull: false, // no permite valores nulos
    },
    lat: {
        type: DataTypes.STRING, // tipo de dato string
        allowNull: false, // no permite valores nulos
    },
    lng: {
        type: DataTypes.STRING, // tipo de dato string
        allowNull: false, // no permite valores nulos
    },
    imagen: {
        type: DataTypes.STRING(150), // tipo de dato string con una longitud de 150 caracteres
        allowNull: false, // no permite valores nulos
    },
    publicado: {
        type: DataTypes.BOOLEAN, // tipo de dato boolean
        allowNull: false, // valor por defecto que se le asigna al campo
        defaultValue: false, // no permite valores nulos
    }
});


export default Propiedad;