import Propiedad from './Propiedad.js';
import Precio from './Precio.js';
import Categoria from './Categoria.js';
import Usuario from './Usuario.js';

// Relaciones

// Una propiedad pertenece a un precio
//Precio.hasOne(Propiedad); // Un precio tiene una propiedad
Propiedad.belongsTo(Precio, { foreignKey: 'precioId' }); //! Una propiedad pertenece a un precio
Propiedad.belongsTo(Categoria, { foreignKey: 'categoriaId' }); //! Una propiedad pertenece a una categoría
Propiedad.belongsTo(Usuario, { foreignKey: 'usuarioId' }); //! Una propiedad pertenece a un usuario

export {
    Propiedad,
    Precio,
    Categoria,
    Usuario
}