import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { generarId } from '../helpers/tokens.js';

// Obtener el directorio actual del archivo actual
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const storage = multer.diskStorage({
    destination: function (req, file, cb) { // cb = callback
        cb(null, path.join(__dirname, '../public/uploads')); // null = no hay error, path = ruta de la carpeta
    },
    filename: function (req, file, cb) {
        cb(null, generarId() + path.extname(file.originalname)); //  generarId() = nombre del archivo, path.extname(file.originalname) = extensión del archivo
    }
})

const upload = multer({
    storage,
});

export default upload; // Exportar la función upload para ser utilizada en el controlador de la propiedad
