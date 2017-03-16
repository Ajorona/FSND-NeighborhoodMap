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
