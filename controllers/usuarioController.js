import {
    check, //! Para validar los campos del formulario
    validationResult, //! Para mostrar los errores en el formulario
} from 'express-validator';

import bcrypt from 'bcrypt';

import Usuario from '../models/Usuario.js';
import { generarId, generarJWT } from '../helpers/tokens.js';
import { emailRegistro, emailOlvidePassword } from '../helpers/email.js';

//* ======= Rutas de autenticacion ======= //
// Funcion para mostrar el formulario de login
const formularioLogin = (req, res) => {
    // Aca va la ruta de la vista con render
    res.render('auth/login', {
        pagina: 'Inicio de Sesión',
        csrfToken: req.csrfToken(), // Enviar el token a la vista
    });
};

const autenticar = async (req, res) => {
    // Validar los campos del formulario
    await check('email')
        .isEmail()
        .withMessage('El email es obligatorio')
        .run(req);
    await check('password')
        .notEmpty()
        .withMessage('El password es obligatorio')
        .run(req);

    // Mostrar los errores
    let resultado = validationResult(req);

    // Si el resultado no esta vacio, es porque hay errores
    if (!resultado.isEmpty()) {
        // Aca va la ruta de la vista con render y los errores
        return res.render('auth/login', {
            pagina: 'Inicio de Sesión',
            csrfToken: req.csrfToken(), // Enviar el token a la vista
            errores: resultado.array(),
        });
    }

    // Comprobar si el usuario esta registrado
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
        return res.render('auth/login', {
            pagina: 'Inicio de Sesión',
            csrfToken: req.csrfToken(), // Enviar el token a la vista
            errores: [{ msg: 'El usuario no existe' }],
        });
    }

    // Comprobar si el usuario esta confirmado
    if (!usuario.confirmado) {
        return res.render('auth/login', {
            pagina: 'Inicio de Sesión',
            csrfToken: req.csrfToken(), // Enviar el token a la vista
            errores: [{ msg: 'Tu cuenta no esta confirmada, revisa tu email' }],
        });
    }

    // Comprobar el password
    if (!usuario.verificarPassword(password)) {
        // Si el password es incorrecto
        return res.render('auth/login', {
            pagina: 'Inicio de Sesión',
            csrfToken: req.csrfToken(), // Enviar el token a la vista
            errores: [{ msg: 'El password es incorrecto' }],
        });
    }

    // Autenticar el usuario
    const token = generarJWT({ id: usuario.id, nombre: usuario.nombre });

    // Almacenar el token en la cookie
    //* Httponly es para que no se pueda acceder al token desde el navegador
    //* Secure es para que solo se pueda acceder al token en un entorno seguro (https)
    //* SameSite es para que no se pueda acceder al token desde otro sitio

    return res
        .cookie('_token', token, {
            httpOnly: true /* , secure: true, sameSite: 'none'  */,
            //expires: 9000, // 9000 milisegundos
        })
        .redirect('/propiedades');
};

//* ======= Rutas de registro ======= //
// Funcion para mostrar el formulario de registro
const formularioRegistro = (req, res) => {
    //console.log(req.csrfToken()); // Mostrar el token en la consola

    // Aca va la ruta de la vista con render
    res.render('auth/registro', {
        pagina: 'Crear Cuenta',
        csrfToken: req.csrfToken(), // Enviar el token a la vista
    });
};

// Funcion para registrar un usuario
const registrar = async (req, res) => {
    // Validar los campos del formulario
    await check('nombre')
        .notEmpty()
        .withMessage('El nombre es obligatorio')
        .run(req);
    await check('email')
        .isEmail()
        .withMessage('Eso no parece un email')
        .run(req);
    await check('password')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres')
        .run(req);
    await check('repetir_password')
        .equals(req.body.password)
        .withMessage('Las contraseñas no coinciden')
        .run(req);

    let resultado = validationResult(req);

    //! Si el resultado no esta vacio, es porque hay errores
    if (!resultado.isEmpty()) {
        //! Aca va la ruta de la vista con render y los errores
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            errores: resultado.array(),
            csrfToken: req.csrfToken(), // Enviar el token a la vista
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email,
            },
        });
    }

    // Verificar si el usuario ya esta registrado
    const existeUsuario = await Usuario.findOne({
        where: { email: req.body.email },
    });

    if (existeUsuario) {
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(), // Enviar el token a la vista
            errores: [
                {
                    msg: 'El usuario ya esta registrado',
                },
            ],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email,
            },
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
    });

    // Aca va la ruta de la vista con render
    res.render('templates/mensaje', {
        pagina: 'Cuenta Creada Correctamente',
        mensaje:
            'Hemos enviado un correo de confirmación a tu email, presiona el enlace para activar tu cuenta',
    });
};

//* ======= Rutas de confirmar ======= //
// Funcion para confirmar la cuenta
const confirmar = async (req, res, next) => {
    // Aca va la ruta de la vista con render
    const { token } = req.params;

    // Verificar si el token es valido
    const usuario = await Usuario.findOne({ where: { token } });
    if (!usuario) {
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Error al confirmar cuenta',
            mensaje: 'El token para confirmar la cuenta no es valido',
            error: true,
        });
    }

    // Confirmar cuenta
    usuario.token = null;
    usuario.confirmado = true;
    await usuario.save(); // Guardar en la base de datos

    res.render('auth/confirmar-cuenta', {
        pagina: 'Cuenta Confirmada',
        mensaje: 'La cuenta se confirmo correctamente',
        error: false,
    });
};

//* ======= Rutas de olvide password ======= //
// Funcion para mostrar el formulario de olvide password
const formularioOlvidePassword = (req, res) => {
    // Aca va la ruta de la vista con render
    res.render('auth/olvide-password', {
        pagina: 'Recupera tu acceso a Bienes Raices',
        csrfToken: req.csrfToken(), // Enviar el token a la vista
    });
};

// Funcion resetear password
const resetearPassword = async (req, res) => {
    // Validar los campos del formulario
    await check('email')
        .isEmail()
        .withMessage('Eso no parece un email')
        .run(req);

    let resultado = validationResult(req);

    // Si el resultado no esta vacio, es porque hay errores
    if (!resultado.isEmpty()) {
        // Aca va la ruta de la vista con render y los errores
        return res.render('auth/olvide-password', {
            pagina: 'Recupera tu acceso a Bienes Raices',
            csrfToken: req.csrfToken(), // Enviar el token a la vista
            errores: resultado.array(),
        });
    }

    // Buscar el usuario
    const { email } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
        // Aca va la ruta de la vista con render
        return res.render('auth/olvide-password', {
            pagina: 'Recupera tu acceso a Bienes Raices',
            csrfToken: req.csrfToken(), // Enviar el token a la vista
            errores: [{ msg: 'El usuario no existe' }],
        });
    }

    // Generar el token y enviar email
    usuario.token = generarId();
    await usuario.save();

    // Enviar email de confirmacion
    emailOlvidePassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token,
    });

    console.log('Se envio el email');

    // Renderizar un mensaje
    res.render('templates/mensaje', {
        pagina: 'Email Enviado',
        mensaje: 'Hemos enviado un correo para reestablecer tu contraseña',
    });
};

const comprobarToken = async (req, res) => {
    const { token } = req.params;

    // Verificar si el token es valido
    const usuario = await Usuario.findOne({ where: { token } });

    if (!usuario) {
        res.render('auth/confirmar-cuenta', {
            pagina: 'Restablecer tu Contraseña',
            mensaje:
                'Hubo un error al validar el token, vuelve a solicitar el cambio de contraseña',
            error: true,
        });
    }

    // Mostrar el formulario para modificar el password
    res.render('auth/reset-password', {
        pagina: 'Restablecer Contraseña',
        csrfToken: req.csrfToken(),
    });
};

const nuevoPassword = async (req, res) => {
    // Validar el password
    await check('password')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres')
        .run(req);

    let resultado = validationResult(req);

    // Si el resultado no esta vacio, es porque hay errores
    if (!resultado.isEmpty()) {
        // Aca va la ruta de la vista con render y los errores
        return res.render('auth/reset-password', {
            pagina: 'Restablecer Contraseña',
            csrfToken: req.csrfToken(), // Enviar el token a la vista
            errores: resultado.array(),
        });
    }

    // Identificar qien hizo la peticion
    const { token } = req.params;
    const { password } = req.body;

    const usuario = await Usuario.findOne({ where: { token } });

    // Hashear el nuevo password
    const salt = await bcrypt.genSalt(10); //! Generar el salt para el hash
    usuario.password = await bcrypt.hash(password, salt); //! Generar el hash
    usuario.token = null;

    await usuario.save();

    res.render('auth/confirmar-cuenta', {
        pagina: 'Password Modificado',
        mensaje: 'El password se modifico correctamente',
    });
};

export {
    formularioLogin,
    autenticar,
    formularioRegistro,
    registrar,
    formularioOlvidePassword,
    confirmar,
    resetearPassword,
    comprobarToken,
    nuevoPassword,
};
