(function () {
    // body
    const lat = 5.7180412;
    const lng = -72.9423523;
    const mapa = L.map('mapa-inicio').setView([lat, lng], 16);

    let markers = new L.FeatureGroup().addTo(mapa);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapa);

    const obtenerPropiedades = async () => {
        try {
            const url = '/api/propiedades';
            const resultado = await fetch(url);
            const propiedades = await resultado.json();

            mostrarPropiedades(propiedades);
        } catch (error) {
            console.log(error);
        }
    };

    const mostrarPropiedades = (propiedades) => {
        propiedades.forEach((propiedad) => {
            // agrear pointerEvents:
            const marker = new L.marker(
                [parseFloat(propiedad?.lat), parseFloat(propiedad?.lng)],
                { autoPan: true, }
            ).addTo(mapa).bindPopup(`
                <p class="text-indigo-600 font-bold m-0">${propiedad?.categoria.nombre}</p>
                <h1 class="text-md font-extrabold uppercase mb-1">${propiedad?.titulo}</h1>
                <img class="w-full" src="/uploads/${propiedad?.imagen}" alt="${propiedad?.titulo}">
                <p class="text-gray-600 font-bold">${propiedad?.precio.nombre}</p>
                <a href="/propiedad/${propiedad?.id}" class="bg-indigo-600 block p-2 text-center font-bold uppercase text-white" target="_blank" rel="noopener noreferrer"
                >Ver Propiedad</a>
            `);

            markers.addLayer(marker);
        })
    };

    obtenerPropiedades();
})();
