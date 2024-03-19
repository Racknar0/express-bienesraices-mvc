import express from 'express';
import {
    formularioLogin,
    formularioRegistro,
    formularioOlvidePassword,
    registrar,
    confirmar,
    resetearPassword,
    comprobarToken,
    nuevoPassword,
    autenticar
} from '../controllers/usuarioController.js';

const router = express.Router();


// ======= Rutas de autenticacion ======= //
router.get('/login', formularioLogin); // Get es para obtener registros
router.post('/login', autenticar); // Post es para enviar datos


// ======= Rutas de registro ======= //
router.get('/registro', formularioRegistro);
router.post('/registro', registrar); // Post es para enviar datos


// ======= Rutas de confirmar ======= //
router.get('/confirmar/:token', confirmar);


// ======= Rutas de olvide password ======= //
router.get('/olvide-password', formularioOlvidePassword); // Obtener el formulario
router.post('/olvide-password', resetearPassword); // Post es para enviar datos
// Almacena el nuevo password en la BD
router.get('/olvide-password/:token', comprobarToken); // Obtener el formulario
router.post('/olvide-password/:token', nuevoPassword); // Obtener el formulario

export default router;
