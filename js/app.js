'use strict';

var bayarea;
var markers = [];

/*
reset button

$("#resetMap").click( function () {
    console.log('you are fired') 
});
*/
var initMap = function() {
    const map = document.querySelector('#map');
    const center = {
        lat: 37.656,
        lng: -122.288
    };

    bayarea = new google.maps.Map(map, {
        center,
        zoom: 9,
        scrollwheel: false,
    });

    var getMarkers = function getMarkers(siteDatabase) {
        var i = 1;
        for (var site in siteDatabase) {
            site = siteDatabase[site];
            addMarker(site, i * 200);
            i++;
        };

        var infowindow = new google.maps.InfoWindow({
            content: "<i class='fa fa-spinner fa-spin fa-lg' style='color: #FFA46B;' title='Loading...'></i> Loading..."
        });

        function addMarker(site, timeout) {
            window.setTimeout(function() {
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(site.lat, site.lng),
                    map: bayarea,
                    title: site.position,
                    county: site.county,
                    animation: google.maps.Animation.DROP
                });
            google.maps.event.addListener(marker, 'click', (function(marker, infowindow) {
                return function() {
                    if (infowindow) {
                        infowindow.close();
                    }
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                    setTimeout(function(){ marker.setAnimation(null); }, 1500);
                    infowindow.open(bayarea, marker)
                    wikiExtract(marker.title).then(function(data) {
                        infowindow.setContent(data);
                    });
                };
            })(marker, infowindow));
            markers.push(marker);
            }, timeout);
        }    
    };
    getMarkers(siteDatabase);
};

function wikiExtract(site) {
    return $.when(ventanaWik(site)).then( (wiki) => {
        return dig(wiki.query.pages).extract;
    });
    function dig(object) {
        return object[Object.keys(object)[0]];
    }
    function ventanaWik(site) {
        return $.ajax({
            type: 'json',
            url: 'https://en.wikipedia.org/w/api.php' + '?origin=*'
            + '&format=json' + '&action=query' + '&prop=extracts'
            + '&exintro=' + '&explaintext=' + '&titles=' + site,
            method: 'GET'
        }).promise();
    }
};

function googleError() {
    alert('Failed to initialize the Google Maps API');
    console.log('Failed to initialize Google Maps API');
}

var Site = function(position, county, lat, lng, zoom, heading, pitch) {
    var self = this;
    self.position = position;
    self.county = county;
    self.lat = lat;
    self.lng = lng;
    self.zoom = zoom;
    self.heading = heading;
    self.pitch = pitch;
};

var County = function(position, city, lat, lng, zoom) {
    var self = this;
    self.position = position;
    self.city = city;
    self.lat = lat;
    self.lng = lng;
    self.zoom = zoom;
};

var siteDatabase = {
    alamedasite: new Site('Jack London Square', 'alameda', 37.7947939, -122.2770558, 12, 252.63, 0),
    contracostasite: new Site('Mount Diablo', 'contracosta', 37.8817588, -121.9140186, 12, 271.67, 0),
    marinsite: new Site('Golden Gate Bridge', 'marin', 37.8187103, -122.4721451, 12, 252.63, 0),
    napasite: new Site('Napa Valley AVA', 'napa', 38.2984241, -122.2842797, 12, 118.22, 0),
    sfsite: new Site('San Francisco', 'sf', 37.7403805, -122.4201316, 12, 29.08, 0),
    sanmateosite: new Site('Pulgas Water Temple', 'sanmateo', 37.4835189, -122.3162989, 12, 169.64, 0),
    santaclarasite: new Site('Computer History Museum', 'santaclara', 37.4137657, -122.0780323, 12, 57.07, 0),
    solanocountysite: new Site('Mare Island', 'solanocounty', 38.0980429, -122.2710533, 12, 304.72, 0),
    sonomacountysite: new Site('Bodega Bay', 'sonomacounty', 38.3015501, -123.0568967, 12, 241.82, 0),
    santacruzsite: new Site('Henry Cowell Redwoods State Park', 'santacruz', 37.0382202, -122.0627259, 12, 332.28, 0)
};

var countyDatabase = {
    alameda: new County('Alameda', 'Oakland', 37.601, -121.719, 12),
    contracosta: new County('Contra Costa', 'Walnut Creek', 37.853409, -121.901795, 12),
    marin: new County('Marin', 'San Rafael', 38.083403, -122.763304, 12),
    napa: new County('Napa', 'Napa', 38.502469, -122.265389),
    sf: new County('San Francisco', 'San Francisco', 37.774929, -122.419416, 12),
    sanmateo: new County('San Mateo', 'Redwood city', 37.433734, -122.401419, 12),
    santaclara: new County('Santa Clara', 'San Jose', 37.333658, -121.890704, 12),
    solanocounty: new County('Solano', 'Fairfield', 38.310497, -121.901795, 12),
    sonomacounty: new County('Sonoma', 'Santa Rosa', 38.577956, -122.988832, 12),
    santacruz: new County('Santa Cruz', 'Santa Cruz', 37.045399, -121.957958, 12)
};

var CountyAPI = function(county, site) {
    this.county = county.position;
    this.city = county.city;
    this.site = site.position;
    this.condition = null;
    this.temperature = null;
    this.humidity = null;
    this.wind = null;
    this.wikiText = null;
    this.urlSV = null;
};

function getAPI(name) {
    var county = countyDatabase[name];
    var site = siteDatabase[name + 'site'];
    return $.when(getWeather(county), getWiki(site)).then(function(weather, wiki) {
        var countyAPI = new CountyAPI(county, site);
        countyAPI.position = county.position;
        countyAPI.city = county.city;
        countyAPI.site = site.position;
        countyAPI.condition = weather[0].current_observation.weather;
        countyAPI.temperature = weather[0].current_observation.temperature_string;
        countyAPI.humidity = weather[0].current_observation.relative_humidity;
        countyAPI.wind = weather[0].current_observation.wind_mph;
        countyAPI.wikiText = dig(wiki[0].query.pages).extract;
        countyAPI.urlSV = (function getSV() {
            const api_key = 'AIzaSyBG2ZPB_EqI2qNnEOSc4IEPUQCbBwinWBQ';
            var url = 'https://maps.googleapis.com/maps/api/streetview?'
            + 'size=600x200' + '&location=' + site.lat + ',' + site.lng
            + '&heading=' + site.heading + '&pitch=' + site.pitch + '&key='
            + api_key;
            return url;
        })();
        return countyAPI;
    });

    function dig(object) {
        return object[Object.keys(object)[0]];
    }

    function getWeather(obj) {
        return $.ajax({
            type: 'json',
            method: 'GET',
            url: 'http://api.wunderground.com/api/' + 'd406854e7b14e2ec' + '/conditions/q/CA/' + obj.city + '.json'
        }).promise();
    }

    function getWiki(obj) {
        return $.ajax({
            type: 'json',
            url: 'https://en.wikipedia.org/w/api.php' + '?origin=*'
            + '&format=json' + '&action=query' + '&prop=extracts'
            + '&exintro=' + '&explaintext=' + '&titles=' + obj.position,
            method: 'GET'
        }).promise();
    }
}

var showCounty = function(site) {
    for (var i = 0; i < markers.length; i++) {
        if (markers[i].title != site) {
            markers[i].setIcon('image/white-icon.png');
        } else if (markers[i].title == site) {
            markers[i].setIcon('image/red-icon.png');
        }
    }
};

var region = function(name, counties) {
    this.name = name;
    this.counties = ko.observableArray(counties);
};

var regions = [
    new region('North Bay', ['marin', 'napa', 'solanocounty', 'sonomacounty']),
    new region('East Bay', ['alameda', 'contracosta']),
    new region('South Bay', ['santaclara']),
    new region('San Francisco', ['sf']),
    new region('Peninsula', ['sanmateo']),
    new region('Santa Cruz', ['santacruz'])
];

var filterCounty = function(counties) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setIcon('image/white-icon.png');
    }
    for (var i = 0; i < counties.length; i++) {
        for(var j = 0; j < markers.length; j++) {
            if (counties[i] == markers[j].county) {
                markers[j].setIcon('image/red-icon.png');
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    var viewModel = function() {
        var self = this;
        self.position = ko.observable('');
        self.site = ko.observable('');
        self.condition = ko.observable(0);
        self.temperature = ko.observable(0);
        self.humidity = ko.observable(0);
        self.wind = ko.observable(0);
        self.wikiText = ko.observable('');
        self.urlSV = ko.observable('');
        self.error = ko.observable(false);

        getAPI('sf').then(function(primary) {
            self.position(primary.position);
            self.site(primary.site);
            self.condition(primary.condition);
            self.temperature(primary.temperature);
            self.humidity(primary.humidity);
            self.wind(primary.wind);
            self.wikiText(primary.wikiText);
            self.urlSV(primary.urlSV);
        }).catch(function(error) {
            self.error(true);
        });


        self.counties = ko.observableArray([{
            name: 'alameda',
            label: 'Alameda'
        }, {
            name: 'contracosta',
            label: 'Contra Costa'
        }, {
            name: 'marin',
            label: 'Marin'
        }, {
            name: 'napa',
            label: 'Napa'
        }, {
            name: 'sf',
            label: 'San Francisco'
        }, {
            name: 'sanmateo',
            label: 'San Mateo'
        }, {
            name: 'santaclara',
            label: 'Santa Clara'
        }, {
            name: 'solanocounty',
            label: 'Solano'
        }, {
            name: 'sonomacounty',
            label: 'Sonoma'
        }, {
            name: 'santacruz',
            label: 'Santa Cruz'
        }]);


        self.currentView = function(obj) {
            getAPI(obj.name).then(function(current) {
                self.position(current.position);
                self.site(current.site);
                self.condition(current.condition);
                self.temperature(current.temperature);
                self.humidity(current.humidity);
                self.wind(current.wind);
                self.urlSV(current.urlSV);
                self.wikiText(current.wikiText);
                showCounty(current.site);
            }).catch(function(error) {
                self.error(true);
            });
        };

        self.categoryList = [];
        regions.map(region => {
            if (!self.categoryList.includes(region.name)) {
                self.categoryList.push(region.name);
            }
        });
        self.categories = ko.observableArray(categoryList);

        self.regionArray = regions;
       
        self.selected = ko.observable();

        self.regionSelect = ko.computed(() => {
            if (!self.selected()) {
                return self.regionArray();
            } else {
                return
                ko.utils.arrayFilter(self.regionArray(), (region) => {
                    filterCounty(region.counties);
                    return (region.name === self.selected() );
                });
            }
        } // end regionSelect

    }; //end viewModel

    ko.applyBindings(new viewModel());
});
