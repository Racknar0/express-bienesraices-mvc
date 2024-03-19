import jwt from 'jsonwebtoken';

//! Genera un token aleatorio
const generarId = () =>
    Date.now().toString(36) + Math.random().toString(36).substring(2);

//! Autenticar el usuario con JWT  primer parametro es el payload, segundo es la llave secreta, tercero son las opciones
const generarJWT = datos => jwt.sign({id: datos.id, nombre: datos.nombre}, process.env.JWT_SECRET, { expiresIn: '1d' });



export { 
    generarId, 
    generarJWT 
};
