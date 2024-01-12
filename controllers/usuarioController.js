import { 
    check,  //! Para validar los campos del formulario 
    validationResult  //! Para mostrar los errores en el formulario
} from 'express-validator';

import Usuario from '../models/Usuario.js';
import { generarId }  from '../helpers/tokens.js';
import { emailRegistro } from '../helpers/email.js';


// Funcion para mostrar el formulario de login
const formularioLogin = (req, res) => {
    // Aca va la ruta de la vista con render
    res.render('auth/login', {
        pagina: 'Inicio de Sesión',
    });
};

// Funcion para mostrar el formulario de registro
const formularioRegistro = (req, res) => {
    //console.log(req.csrfToken()); // Mostrar el token en la consola

    // Aca va la ruta de la vista con render
    res.render('auth/registro', {
        pagina: 'Crear Cuenta',
        csrfToken: req.csrfToken(), //! Enviar el token a la vista
    });
};

// Funcion para registrar un usuario
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
                csrfToken: req.csrfToken(), //! Enviar el token a la vista
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
                csrfToken: req.csrfToken(), // Enviar el token a la vista
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

        // Enviar email de confirmacion
        emailRegistro({
            nombre: usuario.nombre,
            email: usuario.email,
            token: usuario.token,
        })
        
        // Aca va la ruta de la vista con render
        res.render('templates/mensaje', {
            pagina: 'Cuenta Creada Correctamente',
            mensaje: 'Hemos enviado un correo de confirmación a tu email, presiona el enlace para activar tu cuenta',
        })

        
};

// Funcion para confirmar la cuenta
const confirmar = async (req, res, next) => {
    // Aca va la ruta de la vista con render
    const { token } = req.params;

    //! Verificar si el token es valido
    const usuario = await Usuario.findOne({where: {token}}); 
    if (!usuario) {
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Error al confirmar cuenta',
            mensaje: 'El token para confirmar la cuenta no es valido',
            error: true,
        })
    }

    // Confirmar cuenta
    usuario.token = null;
    usuario.confirmado = true;
    await usuario.save(); //! Guardar en la base de datos

    res.render('auth/confirmar-cuenta', {
        pagina: 'Cuenta Confirmada',
        mensaje: 'La cuenta se confirmo correctamente',
        error: false,
    })
    
};

// Funcion para mostrar el formulario de olvide password
const formularioOlvidePassword = (req, res) => {
    // Aca va la ruta de la vista con render
    res.render('auth/olvide-password', {
        pagina: 'Recupera tu acceso a Bienes Raices',
    });
};



export {
    formularioLogin,
    formularioRegistro,
    registrar,
    formularioOlvidePassword,
    confirmar,
};
