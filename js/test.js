'use strict';



var SView = function (position, map, lat, lng, zoom, heading, pitch) {
    this.position = position;
    this.map = map;
    this.lat = lat;
    this.lng = lng;
    this.zoom = zoom;
    this.heading = heading;
    this.pitch = heading;
};

var County = function (position, map, lat, lng, zoom) {
    this.position = position;
    this.map = map;
    this.lat = lat;
    this.lng = lng;
    this.zoom = zoom;
};

var countyDatabase = {
    Alameda : new County("Alameda County", 'bayarea', 37.601689, -121.719546, 12),
    contracosta : new County("Contra Costa County", 'bayarea', 37.853409, -121.901795, 12),
    marin : new County("Marin County", 38.083403, 'bayarea', -122.763304, 12),
    napa : new County("Napa County", 'bayarea', 38.502469, -122.265389),
    sf : new County("San Francisco County", 'bayarea', 37.774929, -122.419416, 12),
    sanmateo : new County("San Mateo County", 'bayarea', 37.433734, -122.401419, 12),
    santaclara : new County("Santa Clara County", 'bayarea', 37.333658, -121.890704, 12),
    solanocounty : new County("Solano County", 'bayarea', 38.310497, -121.901795, 12),
    sonomacounty : new County("Sonoma County", 'bayarea', 38.577956, -122.988832, 12),
    santacruz : new County("Santa Cruz County", 'bayarea', 37.045399, -121.957958, 12)
};

var SViewDatabase =  {
    Alamedasite : new SView('Jack London Square', 'bayarea', 37.7947939, -122.2770558, 12, 252.63, 106.37),
    contracostasite : new SView('Mount Diablo', 'bayarea', 37.8817588, -121.9140186, 12, 271.67, 100.56),
    marinsite : new SView('Golden Gate Bridge', 'bayarea', 37.8187103, -122.4721451, 12, 252.63, 99.56),
    napasite : new SView('Downtown Napa', 'bayarea', 38.2984241, -122.2842797, 12, 118.22, 90.31),
    sfsite : new SView('Skyline', 'bayarea', 37.7403805, -122.4201316, 12, 29.08, 87.21),
    sanmateosite : new SView('Pulgas Water Temple', 'bayarea', 37.4835189, -122.3162989, 12, 169.64, 87.87),
    santaclarasite : new SView('Computer History Museum', 'bayarea', 37.4137657, -122.0780323,  12, 57.07, 94.97),
    solanocountysite : new SView('Mare Island Historical Park', 'bayarea', 38.0980429, -122.2710533, 12,  304.72, 87.53),
    sonomacountysite : new SView('Bodega Bay', 'bayarea', 38.3015501, -123.0568967, 12, 241.82, 93.6),
    santacruzsite : new SView('Henry Cowell State Park', 'bayarea', 37.0382202, -122.0627259, 12, 332.28, 158)
};

var markers = [];

app


(function (countyDatabase, SViewDatabase) {
    for (var county in countyDatabase) {
        markers.push(county);
        console.log("working!");
    }
    for (var site in SViewDatabase) {
        markers.push(site);
    }
})();

console.log(markers);