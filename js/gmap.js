/* 
function initMap() {
  var centerBA = {lat: 37.6562, lng: -122.288};
  var bayarea = new google.maps.Map(document.getElementById('map'), {
    zoom: 9,
    center: centerBA
  });
  var marker = new google.maps.Marker({
    position: centerBA,
    map: bayarea,
  });

    (function getMarkers() {
        for (var county in countyDatabase) {
            markers.push(new google.maps.Marker({
                position: {
                    lat: county.lat,
                    lng: county.lng
                },
                title: county.position
            });)
        }
        for (var site in SViewDatabase) {
            markers.push(new google.maps.Marker({
                position: {
                    lat: site.lat,
                    lng: site.lng
                },
                title: site.position
            });)
        }
    })();


    var markerCluster = new MarkerClusterer(bayarea, markers, {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
}

*/