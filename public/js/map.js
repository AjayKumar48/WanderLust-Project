// var map = L.map('map').setView([28.6139, 77.2090], 10);    // [latitude,longitude]
// L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     maxZoom: 19,
//     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
// }).addTo(map);
// console.log(coordinates);


//  L.marker([28.6139, 77.2090])
// .addTo(map)
// .bindPopup('Delhi')
// .openPopup();
    const coordinates = window.mapData.coordinates;
    console.log(coordinates);

    const longitude = coordinates[0];
    const latitude = coordinates[1];

    console.log(longitude, latitude);

    const map = L.map("map").setView(
        [latitude, longitude],
        13
    );

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);


    L.marker([latitude, longitude])
        .addTo(map)
        .bindPopup(`<h6>${window.mapData.location} </h6> <br> Exect Location will be provided after Booking`)
        .openPopup();

