import { Precio, Categoria, Propiedad } from "../models/index.js";

const inicio = async (req, res) => {

    const [ categorias, precios, casas, departamentos ] = await Promise.all([
        Categoria.findAll({ raw: true, }),
        Precio.findAll({ raw: true, }),
        Propiedad.findAll({
            limit: 3,
            where: {
                categoriaId: 1
            },
            include: [
                { model: Precio, as: 'precio' },
                { model: Categoria, as: 'categoria' }
            ],
            order: [
                ['createdAt', 'DESC']
            ]
        }),
        Propiedad.findAll({
            limit: 3,
            where: {
                categoriaId: 2
            },
            include: [
                { model: Precio, as: 'precio' },
                { model: Categoria, as: 'categoria' }
            ],
            order: [
                ['createdAt', 'DESC']
            ]
        })
    ]);


    res.render('inicio', {
        pagina: 'Inicio',
        categorias,
        precios,
        casas,
        departamentos,
        csrfToken: req.csrfToken()
    });
};

const categoria = async (req, res) => {
    const { id } = req.params;

    // comprobar que la categoria existe
    const categoria = await Categoria.findByPk(id);

    if (!categoria) {
        res.redirect('/404');
        return;
    }

    // Obtener las propiedades de la categoria
    const propiedades =  await Propiedad.findAll({
        where: {
            categoriaId: id
        },
        include: [
            { model: Precio, as: 'precio' },
            { model: Categoria, as: 'categoria' }
        ],
        order: [
            ['createdAt', 'DESC']
        ]
    });

    console.log(categoria);

    res.render('categoria', {
        pagina: `${categoria.nombre}s en venta`,
        propiedades,
        csrfToken: req.csrfToken()
    });

};

const noEncontrado = (req, res) => {

    res.render('404', {
        pagina: 'Pagina no encontrada',
        csrfToken: req.csrfToken()
    });

};

const buscador = (req, res) => {};

export { inicio, categoria, noEncontrado, buscador };
