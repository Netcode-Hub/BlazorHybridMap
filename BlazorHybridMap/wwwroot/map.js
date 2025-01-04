
function initializeMap(lat, lng) {
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: lat, lng: lng },
        zoom: 8
    });
}