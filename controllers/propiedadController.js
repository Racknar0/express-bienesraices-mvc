import { unlink } from 'node:fs/promises';
import { validationResult } from 'express-validator';
import { Precio, Categoria, Propiedad } from '../models/index.js';

const admin = async (req, res) => {

    // Leer query string
    
    const { pagina: paginaActual } = req.query;
    
    // Expresión regular para validar que sea un número
    const regExp = /^[1-9]$/;
    
    // Validar que sea un número
    if (!regExp.test(paginaActual)) {
        return res.redirect('/propiedades?pagina=1');
    }
    
   try {
        const { id } = req.usuario;

        // Limites y offset para la paginación
        const limit = 5;

        // 1 * 5 - 5 = 0 --- 2 * 5 - 5 = 5 --- 3 * 5 - 5 = 10
        const offset = ((paginaActual * limit) - limit) // Esto es para que la página 1 sea 0 
        



        // Consultar propiedades del usuario
        const [propiedades, total] = await Promise.all([
            await Propiedad.findAll({
                limit: limit, // Limitar la cantidad de registros
                offset: offset, // Este es el offset para la paginación lo que hace es que si estamos en la página 2, el offset sería 5
                where: {
                    usuarioId: id,
                },
                include: [
                    // Include para traer la relación
                    { model: Categoria, as: 'categoria' },
                    { model: Precio, as: 'precio' },
                ],
            }),
            await Propiedad.count({
                where: {
                    usuarioId: id,
                },
            }),
        ])

        

        res.render('propiedades/admin', {
            pagina: 'Mis Propiedades',
            propiedades,
            csrfToken: req.csrfToken(),
            paginas: Math.ceil(total / limit),
            paginaActual: parseInt(paginaActual),
            total,
            offset,
            limit,
        });
   } catch (error) {
         console.log(error);
   }



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

        return res.render('propiedades/crear', {
            pagina: 'Crear Propiedad',
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

    const { id: usuarioId } = req.usuario;

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

const agregarImagen = async (req, res) => {
    //Validar que la propiedad existe
    const { id } = req.params;

    const propiedad = await Propiedad.findByPk(id);

    if (!propiedad) {
        res.redirect('/propiedades');
        return;
    }

    // console.log(propiedad);

    // Validar que la propiedad no este publicada
    if (propiedad.publicado) {
        res.redirect('/propiedades');
    }

    // Validar que la propiedad sea del usuario
    if (propiedad.usuarioId !== req.usuario.id) {
        res.redirect('/propiedades');
    }

    res.render('propiedades/agregar-imagen', {
        pagina: `Agregar Imagen a ${propiedad.titulo}`,
        csrfToken: req.csrfToken(),
        propiedad,
    });
};

const almacenarImagen = async (req, res, next) => {
    //Validar que la propiedad existe
    const { id } = req.params;

    const propiedad = await Propiedad.findByPk(id);

    if (!propiedad) {
        res.redirect('/propiedades');
    }

    // Validar que la propiedad no este publicada
    if (propiedad.publicado) {
        res.redirect('/propiedades');
    }

    // Validar que la propiedad sea del usuario
    if (propiedad.usuarioId !== req.usuario.id) {
        res.redirect('/propiedades');
    }

    // Si todo es correcto, almacenar la imagen

    try {
        // Almacenar la imagen y cambiar a publicado
        propiedad.imagen = req.file.filename;
        propiedad.publicado = 0;

        // console.log('subiendo imagen');

        await propiedad.save();

        next();
    } catch (error) {
        console.log(error);
    }
};

const editar = async (req, res) => {
    const { id } = req.params;

    // Validar que la propiedad existe
    const propiedad = await Propiedad.findByPk(id);

    if (!propiedad) {
        res.redirect('/propiedades');
        return;
    }

    // Validar que la propiedad sea del usuario
    if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
        res.redirect('/propiedades');
        return;
    }

    // Consultar modelo de precio y categoría
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll(),
    ]);

    res.render('propiedades/editar', {
        pagina: `Editar Propiedad ${propiedad.titulo}`,
        csrfToken: req.csrfToken(),
        categorias: categorias,
        precios: precios,
        datos: propiedad,
    });
};

const guardarCambios = async (req, res) => {
    // Verificar la validación
    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        // Consultar modelo de precio y categoría
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll(),
        ]);

        return res.render('propiedades/editar', {
            pagina: `Editar Propiedad`,
            csrfToken: req.csrfToken(),
            categorias: categorias,
            precios: precios,
            errores: resultado.array(),
            datos: req.body,
        });
    }

    const { id } = req.params;

    // Validar que la propiedad existe
    const propiedad = await Propiedad.findByPk(id);

    if (!propiedad) {
        res.redirect('/propiedades');
        return;
    }

    // Validar que la propiedad sea del usuario
    if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
        res.redirect('/propiedades');
        return;
    }

    // Reescribir los valores y guardarlos en la base de datos
    try {
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

        propiedad.set({
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
        });

        await propiedad.save();

        // console.log('Propiedad actualizada');

        res.redirect('/propiedades');
    } catch (error) {
        console.log(error);
    }
};

const eliminar = async (req, res) => {
    const { id } = req.params;

    // Validar que la propiedad existe
    const propiedad = await Propiedad.findByPk(id);

    if (!propiedad) {
        res.redirect('/propiedades');
        return;
    }

    // Validar que la propiedad sea del usuario
    if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
        res.redirect('/propiedades');
        return;
    }

    // Eliminar la imagen asociada
    await unlink(`public/uploads/${propiedad.imagen}`);

    // Eliminar la propiedad
    await propiedad.destroy();
    res.redirect('/propiedades');
};

// Muestra una propiedad en específico
const mostrarPropiedad = async (req, res) => {
    const { id } = req.params;

    // Comprobar que la propiedad existe
    const propiedad = await Propiedad.findByPk(id, {
        include: [
            // Include para traer la relación
            { model: Categoria, as: 'categoria' },
            { model: Precio, as: 'precio' },
        ],
    });

    if (!propiedad) {
        res.redirect('/404');
        return;
    }

    res.render('propiedades/mostrar', {
        pagina: propiedad.titulo,
        propiedad,
        csrfToken: req.csrfToken()
    });
};

export {
    admin,
    crear,
    guardar,
    agregarImagen,
    almacenarImagen,
    editar,
    guardarCambios,
    eliminar,
    mostrarPropiedad,
};
