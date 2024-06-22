(function () {
    // body
    const lat = 5.7180412;
    const lng = -72.9423523;
    const mapa = L.map('mapa-inicio').setView([lat, lng], 16);

    let markers = new L.FeatureGroup().addTo(mapa);

    // Filtros
    const filtros = {
        categoria: '',
        precio: '',
    };
    const categoriasSelect = document.querySelector('#categorias');
    const precioSelect = document.querySelector('#precios');
    let propiedades = [];

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapa);

    // Filtrado de categorias y precios
    categoriasSelect.addEventListener('change', (e) => {
        filtros.categoria = +e.target.value;
        filtrarPropiedades();
    });

    precioSelect.addEventListener('change', (e) => {
        filtros.precio = +e.target.value;
        filtrarPropiedades();
    });

    const obtenerPropiedades = async () => {
        try {
            const url = '/api/propiedades';
            const resultado = await fetch(url);
            propiedades = await resultado.json();

            mostrarPropiedades(propiedades);
        } catch (error) {
            console.log(error);
        }
    };

    const mostrarPropiedades = (propiedades) => {

        // Limpiar los markers
        markers.clearLayers();

        propiedades.forEach((propiedad) => {
            // agrear pointerEvents:
            const marker = new L.marker(
                [parseFloat(propiedad?.lat), parseFloat(propiedad?.lng)],
                { autoPan: true }
            ).addTo(mapa).bindPopup(`
                <p class="text-indigo-600 font-bold m-0">${propiedad?.categoria.nombre}</p>
                <h1 class="text-md font-extrabold uppercase mb-1">${propiedad?.titulo}</h1>
                <img class="w-full" src="/uploads/${propiedad?.imagen}" alt="${propiedad?.titulo}">
                <p class="text-gray-600 font-bold">${propiedad?.precio.nombre}</p>
                <a href="/propiedad/${propiedad?.id}" class="bg-indigo-600 block p-2 text-center font-bold uppercase text-white" target="_blank" rel="noopener noreferrer"
                >Ver Propiedad</a>
            `);

            markers.addLayer(marker);
        });
    };

    const filtrarPropiedades = () => {
        const resultado = propiedades.filter(filtrarCategoria).filter(filtrarPrecio);
        mostrarPropiedades(resultado);
    };

    const filtrarCategoria = (propiedad) => {
        return filtros.categoria
            ? propiedad.categoriaId === filtros.categoria
            : propiedad;
    };
    
    const filtrarPrecio = (propiedad) => {
        return filtros.precio
            ? propiedad.precioId === filtros.precio
            : propiedad;
    };



    obtenerPropiedades();
})();
