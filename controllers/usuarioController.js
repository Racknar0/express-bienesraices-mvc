import { 
    check,  //! Para validar los campos del formulario 
    validationResult  //! Para mostrar los errores en el formulario
} from 'express-validator';

import Usuario from '../models/Usuario.js';
import { generarId }  from '../helpers/tokens.js';



const formularioLogin = (req, res) => {
    // Aca va la ruta de la vista con render
    res.render('auth/login', {
        pagina: 'Inicio de Sesión',
    });
};

const formularioRegistro = (req, res) => {
    // Aca va la ruta de la vista con render
    res.render('auth/registro', {
        pagina: 'Crear Cuenta',
    });
};

const registrar = async (req, res) => {


        // Validar los campos del formulario
        await check('nombre').notEmpty().withMessage("El nombre es obligatorio").run(req);
        await check('email').isEmail().withMessage("Eso no parece un email").run(req);
        await check('password').isLength({min: 6}).withMessage("La contraseña debe tener al menos 6 caracteres").run(req);
        await check('repetir_password').equals(req.body.password).withMessage("Las contraseñas no coinciden").run(req);


        let resultado = validationResult(req);

        //! Si el resultado no esta vacio, es porque hay errores
        if(!resultado.isEmpty()){
            //! Aca va la ruta de la vista con render y los errores
            return res.render('auth/registro', {
                pagina: 'Crear Cuenta',
                errores: resultado.array(),
                usuario: {
                    nombre: req.body.nombre,
                    email: req.body.email
                }
            });
        }


        // Verificar si el usuario ya esta registrado
        const existeUsuario = await Usuario.findOne({where: {email: req.body.email}});

        if (existeUsuario) {
            return res.render('auth/registro', {
                pagina: 'Crear Cuenta',
                errores: [{
                    msg: 'El usuario ya esta registrado'
                }],
                usuario: {
                    nombre: req.body.nombre,
                    email: req.body.email
                }
            });
        }

        


        const usuario = await Usuario.create({
            nombre: req.body.nombre,
            email: req.body.email,
            password: req.body.password,
            token: generarId(),
        });

        // Lógica adicional después de crear el usuario, si es necesario
        res.status(201).json({
            mensaje: 'Usuario creado exitosamente',
            usuario,
        });

        
};

const formularioOlvidePassword = (req, res) => {
    // Aca va la ruta de la vista con render
    res.render('auth/olvide-password', {
        pagina: 'Recupera tu acceso a Bienes Raices',
    });
};

export {
    formularioLogin,
    formularioRegistro,
    formularioOlvidePassword,
    registrar,
};
