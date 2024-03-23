import {Dropzone} from "dropzone";

const token = document.querySelector('meta[name="csrf-token"]').content;

Dropzone.options.imagen = {
    dictDefaultMessage: "Arrastra tu imagen aquí",
    acceptedFiles: ".png,.jpg,.jpeg",
    maxFilesize: 5,
    maxFiles: 1,
    parallelUploads: 1,
    autoProcessQueue: false, // No subir la imagen automáticamente
    addRemoveLinks: true,
    dictRemoveFile: "Eliminar archivo",
    dictMaxFilesExceeded: "Solo puedes subir una imagen",
    headers: {
        "X-CSRF-TOKEN": token,
    },
    paramName: "imagen",
    init: function () {
        const dropzone = this;

        //publicar
        const btnPublicar = document.querySelector('#publicar');

        btnPublicar.addEventListener('click', async () => {
            dropzone.processQueue();
        });

        dropzone.on('queuecomplete' , (file, mensaje) => {
            if (dropzone.getActiveFiles().length === 0 && dropzone.getQueuedFiles().length === 0) {
                window.location.href = '/propiedades';
            }
        });
    },
}