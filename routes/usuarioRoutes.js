import express from 'express';
import {
    formularioLogin,
    formularioRegistro,
    formularioOlvidePassword,
    registrar,
    confirmar,
    resetearPassword,
    comprobarToken,
    nuevoPassword
} from '../controllers/usuarioController.js';

const router = express.Router();

router.get('/login', formularioLogin); // Get es para obtener registros

router.get('/registro', formularioRegistro);
router.post('/registro', registrar); // Post es para enviar datos

router.get('/confirmar/:token', confirmar);
 
router.get('/olvide-password', formularioOlvidePassword); // Obtener el formulario
router.post('/olvide-password', resetearPassword); // Post es para enviar datos

// Almacena el nuevo password en la BD
router.get('/olvide-password/:token', comprobarToken); // Obtener el formulario
router.post('/olvide-password/:token', nuevoPassword); // Obtener el formulario

export default router;
