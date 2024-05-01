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
            ).addTo(mapa).bindPopup('Información de la propiedad');

            markers.addLayer(marker);
        })
    };

    obtenerPropiedades();
})();
