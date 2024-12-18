const socket = io();

//check if browser supports geolocation
if (navigator.geolocation) {
    //use watchPosition to track the user location continuously
    navigator.geolocation.watchPosition((position) => {
        const {latitude, longitude} = position.coords;

        // emit the latitude and longitude via socket with "send-location". 
        socket.emit('send-location', {latitude,longitude})
    },

    // Log any errors to the console
    (error) => {
        console.error('Unable to retrieve your location', error);
    },
    {
        // setting for high accuracy, a 5-second timeout, and no caching
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    }
);
}

// intialize a map centered at coordinates(0,0) with the a zoom level of 15 using leaflet. 
const map = L.map("map").setView([0,0], 16);
//Add OpenStreetMap tiles to the Map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; <a href='https://www.linkedin.com/in/amarjec/'>amarjec</a> 2024"
}).addTo(map);

// create empty object marker

const markers = {};


socket.on("receive-location",  (data) => {
    const {id, latitude, longitude} = data;
    map.setView([latitude, longitude]);
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
})

socket.on("user-disconnected", ()=> {
    if(markers[id]) {
        map.removeMarkers(markers[id]);
        delete markers[id];
    }
})