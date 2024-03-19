import categorias from "./categorias.js";
import precios from "./Precios.js";
import usuarios from "./usuarios.js";
import db from "../config/db.js";
import { Categoria, Precio, Usuario } from "../models/index.js";


//! Poblar la base de datos con datos iniciales
const importarDatos = async () => {
    try {
        // Autenticar la base de datos
        await db.authenticate();

        // Generar las columnas de la tabla
        await db.sync(); //! Este método sincroniza el modelo con la base de datos, es decir, crea la tabla si no existe

        //* // Insertar los datos en la tabla
        // await Categoria.bulkCreate(categorias);
        // console.log('Datos importados correctamente');
        // process.exit(0); // Detener la app con éxito
        await Promise.all([
            Categoria.bulkCreate(categorias),
            Precio.bulkCreate(precios),
            Usuario.bulkCreate(usuarios)
        ]).then(() => {
            console.log('Datos importados correctamente');
            process.exit(0); // Detener la app con éxito
        });



    } catch (error) {
        console.log(error);
        process.exit(1); // Detener la app con error
    }
}


//! Eliminar los datos de la base de datos
const eliminarDatos = async () => {
    try {

        //! Forma 1
        // await Promise.all([
        //     Categoria.destroy({ where: {}, truncate: true }),
        //     Precio.destroy({ where: {}, truncate: true })
        // ]).then(() => {
        //     console.log('Datos eliminados correctamente');
        //     process.exit(0); // Detener la app con éxito
        // });

        //! Forma 2
        await db.sync({ force: true }); //! Este método sincroniza el modelo con la base de datos, es decir, elimina la tabla si existe


    } catch (error) {
        console.log(error);
        process.exit(1); // Detener la app con error
    }
}



if (process.argv[2] === '-i') {
    importarDatos();
} 

if (process.argv[2] === '-e') {
    eliminarDatos();
}