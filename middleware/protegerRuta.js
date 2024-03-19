
import jwt from 'jsonwebtoken';
import { Usuario } from '../models/index.js';


const protegerRuta = async (req, res, next) => {
    
    // Verificar si hay un token
    const { _token } = req.cookies;
    if(!_token) {
        return res.redirect('auth/login');
    }

    // Comprobar si el token es válido
    try {
        const decoded = jwt.verify(_token, process.env.JWT_SECRET); // Decodificar el token
        const usuario = await Usuario.scope('eliminarPassword').findByPk(decoded.id); // Buscar el usuario por el id del token y excluir el password del resultado

        // Almacenar el usuario al request
        if (usuario) {
            req.usuario = usuario;
        } else {
            return res.redirect('auth/login');
        }
        
        return next();

    } catch (error) {
        res.clearCookie('_token').redirect('auth/login');
        return res.redirect('auth/login');
    }

    
};

export default protegerRuta;
