(function(){


    const lat = document.querySelector('#lat').textContent;
    const lng = document.querySelector('#lng').textContent;
    const calle = document.querySelector('#calle').textContent;
    const mapa = L.map('mapa').setView([lat, lng], 16);

    console.log({
        lat,
        lng
    });
    console.log(mapa);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapa);


    // Agregar el pin
    L.marker([lat, lng]).addTo(mapa).bindPopup(calle).openPopup();


})()