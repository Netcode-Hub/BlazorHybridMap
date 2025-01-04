let map, marker, infoWindow;
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

    GetLocationDetails(lat, lng);
}

function GetLocationDetails(lat, lng) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results[0]) {
            const addressComponents = results[0].address_components;
            const country = addressComponents.find(c => c.types.includes("country"))?.long_name;
            const town = addressComponents.find(c => c.types.includes("locality"))?.long_name;
            const state = addressComponents.find(c => c.types.includes("administrative_area_level_1"))?.long_name;
            const postalCode = addressComponents.find(c => c.types.includes("postal_code"))?.long_name;

            SetInfoWindow(lat, lng, country, town, state, postalCode);
        }
    });
}

function SetInfoWindow(lat, lng, country, town, state, postalCode) {
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
        <h3 style="margin:00 10px; font-size:16px; color: #333;"> Location Details </h3>
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