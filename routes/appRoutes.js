import express from 'express';
import {inicio,categoria,buscador,noEncontrado} from '../controllers/appController.js'

const router = express.Router();

// Pagina de inicio
router.get('/', inicio);

// Categorias
router.get('/categorias/:id', categoria);

// Pagina 404
router.get('/404', noEncontrado);

// Pagina de busqueda
router.get('/buscador', buscador);

export default router;