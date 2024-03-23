import express from 'express';
import { body } from 'express-validator';
import {
    admin,
    crear,
    guardar,
    agregarImagen,
    almacenarImagen
} from '../controllers/propiedadController.js';
import protegerRuta from '../middleware/protegerRuta.js';
import upload from '../middleware/subirImagen.js';

const router = express.Router();

router.get('/propiedades', protegerRuta, admin);
router.get('/propiedades/crear', protegerRuta, crear);
router.post(
    '/propiedades/crear',
    protegerRuta, //! Proteger la ruta
    body('titulo').notEmpty().withMessage('El título es obligatorio'),
    body('descripcion')
        .notEmpty()
        .withMessage('La descripción es obligatoria')
        .isLength({ max: 200 })
        .withMessage('La descripción es muy larga'),
    body('categoria').isNumeric().withMessage('La categoría es obligatoria'),
    body('precio').isNumeric().withMessage('El precio es obligatorio'),
    body('habitaciones')
        .isNumeric()
        .withMessage('Las habitaciones son obligatorias'),
    body('wc').isNumeric().withMessage('Los baños son obligatorios'),
    body('estacionamiento')
        .isNumeric()
        .withMessage('El estacionamiento es obligatorio'),
    body('lat').notEmpty().withMessage('El campo latitud es obligatorio'),

    guardar
);

router.get('/propiedades/agregar-imagen/:id', protegerRuta, agregarImagen);

router.post('/propiedades/agregar-imagen/:id', 
    protegerRuta,
    upload.single('imagen'),
    almacenarImagen
);

export default router;
