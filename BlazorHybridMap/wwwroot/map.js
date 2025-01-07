let map, marker, infoWindow, directionsService, directionsRenderer;
function initializeMap(lat, lng) {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: lat, lng: lng },
        zoom: 13
    });

    if (marker) {
        marker.setMap(null);
        marker = null;
    }

    SetMapMarker(lat, lng, "Your Current Location");
    Search();

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    InitializeStartEndFields();
}

function SetMapMarker(lat, lng, title) {
    const coodinates = new google.maps.LatLng(lat, lng);
    marker = new google.maps.Marker({
        position: coodinates,
        map: map,
        title: title,
        icon: {
            url: "https://www.iconpacks.net/icons/2/free-location-pin-icon-2965-thumb.png",
            scaledSize: new google.maps.Size(50, 50),
            achor: new google.maps.Point(16, 32)
        }
    });

    marker.addListener("click", function () {
        infoWindow.open(map, marker);
    });

    GetLocationDetails(lat, lng, title);
}

function GetLocationDetails(lat, lng, title) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results[0]) {
            const addressComponents = results[0].address_components;
            const country = addressComponents.find(c => c.types.includes("country"))?.long_name;
            const town = addressComponents.find(c => c.types.includes("locality"))?.long_name;
            const state = addressComponents.find(c => c.types.includes("administrative_area_level_1"))?.long_name;
            const postalCode = addressComponents.find(c => c.types.includes("postal_code"))?.long_name;

            SetInfoWindow(lat, lng, country, town, state, postalCode, title);
        }
    });
}

function SetInfoWindow(lat, lng, country, town, state, postalCode, title) {
    infoWindow = new google.maps.InfoWindow();
    infoWindow.setContent(
        `
        <div style="
                padding: 15px;
                font-family: Arial, sans-serif;
                background-color: #f9f9f9;
                border: 1px solid #ddd;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                max-width: 250px;
        ">
        <h3 style="margin:00 10px; font-size:16px; color: #333;"> ${title} </h3>
         <p style="margin: 0; color: #555;"><strong>Country:</strong> ${country || "Not available"}</p>
         <p style="margin: 0; color: #555;"><strong>Town:</strong> ${town || "Not available"}</p>
         <p style="margin: 0; color: #555;"><strong>State:</strong> ${state || "Not available"}</p>
         <p style="margin: 0; color: #555;"><strong>Postal Code:</strong> ${postalCode || "Not available"}</p>
          <p style="margin: 10px 0 0; color: #555;"><strong>Latitude:</strong> ${lat}</p>
          <p style="margin: 0; color: #555;"><strong>Longitude:</strong> ${lng}</p>
        </div>
         `
    );

    if (marker) {
        infoWindow.open(map, marker);
    }
}

function Search() {
    const input = document.getElementById("search-box");
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo("bounds", map);
    autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) {
            alert("No details found for the selected location");
            return;
        } else {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            if (marker) {
                marker.setMap(null);
                marker = null;
            }
            SetMapMarker(lat, lng, "Found Location");
            map.setCenter(place.geometry.location);
            map.setZoom(15);
        }
    })
}


let startLatLng, endLatLng;
function InitializeStartEndFields() {
    const startInput = document.getElementById("start-location");
    const endInput = document.getElementById("end-location");
    const startAutocomplete = new google.maps.places.Autocomplete(startInput);
    const endAutocomplete = new google.maps.places.Autocomplete(endInput);


    startAutocomplete.addListener("place_changed", () => {
        const place = startAutocomplete.getPlace();
        startLatLng = place.geometry.location;
    });
    endAutocomplete.addListener("place_changed", () => {
        const place = endAutocomplete.getPlace();
        endLatLng = place.geometry.location;
    });
}

function CalculateRoute() {
    if (marker) {
        marker.setMap(null);
        marker = null;
    }
    const request = {
        origin: startLatLng,
        destination: endLatLng,
        travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, (result, status) => {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
            const route = result.routes[0];
            
            const leg = route.legs[0];
            const distance = leg.distance.text;
            const duration = leg.duration.text;
            const infoDiv = document.getElementById("route-info");
            infoDiv.innerHTML = `Distance: ${distance} <br> Duration: ${duration}`
        }
    });
}