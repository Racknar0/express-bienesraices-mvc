import express from 'express';
import { formularioLogin, formularioRegistro, formularioOlvidePassword, registrar } from '../controllers/usuarioController.js';

const router = express.Router();


router.get('/login' , formularioLogin); // Get es para obtener registros

router.get('/registro', formularioRegistro); 
router.post('/registro', registrar);  // Post es para enviar datos

router.get('/olvide-password', formularioOlvidePassword); 


export default router;