import express from 'express';
import csrf from 'csurf'; //! Importar el modulo de proteccion CSRF
import cookieParser from 'cookie-parser'; //! Importar el modulo de cookies
import router from './routes/usuarioRoutes.js';
import dbInstance from './config/db.js';

// Instanciar express
const app = express();


// Habilitar body parser para leer datos del body
app.use(express.urlencoded({extended: true}));


//! Habilitar cookie parser
app.use(cookieParser());

//! Habilitar CSRF: Cross Site Request Forgery
app.use(csrf({cookie: true})); //! Habilitar CSRF con cookies


// Conectar a la base de datos
try {
    await dbInstance.authenticate();
    console.log('Base de datos conectada');
    dbInstance.sync(); // Sincronizar los modelos con la base de datos
} catch (error) {
    console.log(error);
}


// Rutas
app.use('/auth', router);

// Habilitar PUG
app.set('view engine', 'pug');
app.set('views', './views');

//! Habilitar carpeta public
app.use(express.static('public'));



// Definir puerto
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`);
});