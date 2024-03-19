import { validationResult } from 'express-validator';
import { Precio, Categoria, Propiedad } from '../models/index.js';

const admin = (req, res) => {
    console.log('Desde admin');

    res.render('propiedades/admin', {
        pagina: 'Mis Propiedades',
        barra: true,
    });
};

// Formulario para nueva propiedad
const crear = async (req, res) => {
    // Consultar modelo de precio y categoría
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll(),
    ]);

    res.render('propiedades/crear', {
        pagina: 'Crear Propiedad',
        barra: true,
        csrfToken: req.csrfToken(),
        categorias: categorias,
        precios: precios,
        datos: {},
    });
};

const guardar = async (req, res) => {
    // Validación
    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        // Consultar modelo de precio y categoría
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll(),
        ]);

        res.render('propiedades/crear', {
            pagina: 'Crear Propiedad',
            barra: true,
            csrfToken: req.csrfToken(),
            categorias: categorias,
            precios: precios,
            errores: resultado.array(),
            datos: req.body,
        });
    }

    // Crear un registro

    const {
        titulo,
        descripcion,
        habitaciones,
        wc,
        estacionamiento,
        lat,
        lng,
        calle,
        precio: precioId,
        categoria: categoriaId,
    } = req.body;
    
    const {id: usuarioId} = req.usuario;

    try {
        const propiedadGuardada = await Propiedad.create({
            titulo,
            descripcion,
            habitaciones,
            wc,
            estacionamiento,
            lat,
            lng,
            calle,
            precioId,
            categoriaId,
            usuarioId,
            imagen: 'imagen.jpg',
        });

        const { id } = propiedadGuardada;

        res.redirect(`/propiedades/agregar-imagen/${id}`);

    } catch (error) {
        console.log(error);
    }
};

export { admin, crear, guardar };
