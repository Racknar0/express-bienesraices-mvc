import { DataTypes } from 'sequelize'
import bcrypt from 'bcrypt'
import db from '../config/db.js'


// Definir el modelo de la tabla
const Usuario = db.define('usuarios', {
    nombre: {
        type: DataTypes.STRING, // tipo de dato string
        allowNull: false, // no puede ser nulo
    },
    email: {
        type: DataTypes.STRING, 
        allowNull: false, 
    },
    password: {
        type: DataTypes.STRING, 
        allowNull: false, 
    },
    token: DataTypes.STRING, // Cuando solo es un atributo se puede definir asi
    confirmado: DataTypes.BOOLEAN,
}, {
    hooks: { //! Hooks son funciones que se ejecutan en cierto momento del ciclo de vida del modelo
        beforeCreate: async function(usuario) { //! beforeCreate se ejecuta antes de crear un registro
            const salt = await bcrypt.genSalt(10); //! Generar el salt para el hash 
            usuario.password = await bcrypt.hash(usuario.password, salt); //! Generar el hash
        }
    },
    scopes: { //! Scopes son consultas predefinidas
        eliminarPassword: {
            attributes: { exclude: ['password', 'token', 'confirmado', 'createdAt', 'updatedAt' ] } //! Excluir el atributo password
        }
    }
})


// Metodos personalizados
Usuario.prototype.verificarPassword = function(password) {
    const resultado = bcrypt.compareSync(password, this.password)
    // console.log(resultado)
    return resultado
}




// tipos de datos: https://sequelize.org/docs/v6/core-concepts/model-basics/



// Exportar el modelo
export default Usuario