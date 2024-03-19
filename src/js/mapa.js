(function () {

    // Logical OR para que no de error si no encuentra el elemento
    const lat = document.querySelector('#lat').value || 5.7180412; 
    const lng = document.querySelector('#lng').value || -72.9423523;
    const mapa = L.map('mapa').setView([lat, lng], 16);
    let maker;


    // Utilizar provider y Geocoder
    const geocodeService = L.esri.Geocoding.geocodeService();


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapa);

    // Agregar el pin
    maker = new L.marker([lat, lng], {
        draggable: true,
        autoPan: true,
    }).addTo(mapa);

    
    // Detectar movimiento del marker
    maker.on('moveend', function (e) {

        maker = e.target;

        const position = maker.getLatLng(); // Get position
        // console.log(position);
        mapa.panTo(new L.LatLng(position.lat, position.lng)); // Set map center to marker position

        // Obtener la información al mover el pin
        geocodeService
            .reverse()
            .latlng(position, 16)
            .run(function (error, result) {
                if (error) {
                    return;
                }

                console.log(result);
                
                maker.bindPopup(result.address.LongLabel);

                document.querySelector('.calle').textContent = result?.address?.Address ?? '';
                document.querySelector('#calle').value = result?.address?.Address ?? '';
                document.querySelector('#lat').value = result?.latlng?.lat;
                document.querySelector('#lng').value = result?.latlng?.lng;

                maker.openPopup();
            });

    })

})();
