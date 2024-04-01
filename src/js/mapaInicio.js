(function() {
    // body
    const lat = 5.7180412; 
    const lng = -72.9423523;
    const mapa = L.map('mapa-inicio').setView([lat, lng], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapa);

    
})();