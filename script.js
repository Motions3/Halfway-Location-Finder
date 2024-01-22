window.onload = function () {
  var exampleYourLocation = "Piccadilly Circus, London";
  var exampleFriendLocation = "Heathrow Airport, London";
  findMeetupLocation(exampleYourLocation, exampleFriendLocation);
};

function findMeetupLocation(yourLocation, friendLocation) {
  yourLocation = yourLocation ? yourLocation.toUpperCase() : document.getElementById('yourLocation').value.toUpperCase();
  friendLocation = friendLocation ? friendLocation.toUpperCase() : document.getElementById('friendLocation').value.toUpperCase();

  if (yourLocation === "" || friendLocation === "") {
    alert("Please enter both locations.");
    return;
  }

  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: yourLocation }, function (results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      var yourLatLng = results[0].geometry.location;

      geocoder.geocode({ address: friendLocation }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          var friendLatLng = results[0].geometry.location;

          var midpoint = new google.maps.LatLng(
            (yourLatLng.lat() + friendLatLng.lat()) / 2,
            (yourLatLng.lng() + friendLatLng.lng()) / 2
          );

          displayMap(yourLatLng, friendLatLng, midpoint);
          displayDistance(yourLatLng, friendLatLng);
        } else {
          alert("Error finding friend's location: " + status);
        }
      });
    } else {
      // Use default locations for Piccadilly Circus and Heathrow Airport in London
      var defaultPiccadillyLatLng = new google.maps.LatLng(51.510067, -0.134148);
      var defaultHeathrowLatLng = new google.maps.LatLng(51.470022, -0.454295);

      var yourLatLng = defaultPiccadillyLatLng;
      var friendLatLng = defaultHeathrowLatLng;

      var midpoint = new google.maps.LatLng(
        (yourLatLng.lat() + friendLatLng.lat()) / 2,
        (yourLatLng.lng() + friendLatLng.lng()) / 2
      );

      displayMap(yourLatLng, friendLatLng, midpoint);
      displayDistance(yourLatLng, friendLatLng);
    }
  });
}

function displayMap(yourLatLng, friendLatLng, midpoint) {
  var mapOptions = {
    center: midpoint,
    zoom: 15
  };

  var map = new google.maps.Map(document.getElementById('map-container'), mapOptions);

  var yourMarker = new google.maps.Marker({
    position: yourLatLng,
    map: map,
    title: "Your Location"
  });

  var friendMarker = new google.maps.Marker({
    position: friendLatLng,
    map: map,
    title: "Friend's Location"
  });

  var midpointMarker = new google.maps.Marker({
    position: midpoint,
    map: map,
    title: "Meetup Location"
  });

  var bounds = new google.maps.LatLngBounds();
  bounds.extend(yourLatLng);
  bounds.extend(friendLatLng);
  bounds.extend(midpoint);
  map.fitBounds(bounds);

  var circle = new google.maps.Circle({
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    map: map,
    center: midpoint,
    radius: 100
  });

  var lineCoordinates = [
    yourLatLng,
    friendLatLng
  ];

  var polyline = new google.maps.Polyline({
    path: lineCoordinates,
    geodesic: true,
    strokeColor: '#0000FF',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });

  polyline.setMap(map);
}

function displayDistance(yourLatLng, friendLatLng) {
  var distanceInMeters = google.maps.geometry.spherical.computeDistanceBetween(yourLatLng, friendLatLng);
  var distanceInMiles = distanceInMeters * 0.000621371;
  var distanceInKm = distanceInMeters / 1000;

  var distanceInfo = document.getElementById('distance-info');
  distanceInfo.innerHTML = "Distance: " + distanceInMiles.toFixed(2) + " miles / " + distanceInKm.toFixed(2) + " km";
}
