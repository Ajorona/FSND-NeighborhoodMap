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
    
    var markers = countyDatabase.map(function (county, index) {
        return new google.maps.Marker({
            position: {lat: county.lat, lng: county.lng},
            title: county.position
        });
    });

    (function addSView() {
        var count = markers.length;
        SViewDatabase.map(function (site, index) {
            markers[count + index].push(new google.maps.Marker({
                position: {lat: site.lat, lng: site.lng},
                title: site.position
            });
            )
        });
    }());
    
    var markerCluster = new MarkerClusterer(bayarea, markers, {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
}
