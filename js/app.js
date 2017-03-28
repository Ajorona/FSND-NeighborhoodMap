'use strict';

var bayarea;

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
        var markers = [];
        for (var site in siteDatabase) {
            site = siteDatabase[site];
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(site.lat, site.lng),
                map: bayarea,
                title: site.position
            });
            markers.push(marker);
            addWindow(marker, site);
        }
        function addWindow(marker, site) {
            var infoWindow = new google.maps.InfoWindow({
                content: site.position,
            });
            marker.addListener('click', function() {
                infoWindow.open(bayarea, marker);
            });
        }
        return markers;
    };
    window.markers = getMarkers(siteDatabase);
};

var Site = function(position, lat, lng, zoom, heading, pitch) {
    var self = this;
    self.position = position;
    self.lat = lat;
    self.lng = lng;
    self.zoom = zoom;
    self.heading = heading;
    self.pitch = pitch;
};

var County = function (position, city, lat, lng, zoom) {
    var self = this;
    self.position = position;
    self.city = city;
    self.lat = lat;
    self.lng = lng;
    self.zoom = zoom;
};

var siteDatabase =  {
    alamedasite : new Site('Jack London Square', 37.7947939, -122.2770558, 12, 252.63, 0),
    contracostasite : new Site('Mount Diablo', 37.8817588, -121.9140186, 12, 271.67, 0),
    marinsite : new Site('Golden Gate Bridge', 37.8187103, -122.4721451, 12, 252.63, 0),
    napasite : new Site('Napa Valley AVA', 38.2984241, -122.2842797, 12, 118.22, 0),
    sfsite : new Site('San Francisco', 37.7403805, -122.4201316, 12, 29.08, 0),
    sanmateosite : new Site('Pulgas Water Temple', 37.4835189, -122.3162989, 12, 169.64, 0),
    santaclarasite : new Site('Computer History Museum', 37.4137657, -122.0780323,  12, 57.07, 0),
    solanocountysite : new Site('Mare Island', 38.0980429, -122.2710533, 12,  304.72, 0),
    sonomacountysite : new Site('Bodega Bay', 38.3015501, -123.0568967, 12, 241.82, 0),
    santacruzsite : new Site('Henry Cowell Redwoods State Park', 37.0382202, -122.0627259, 12, 332.28, 0)
};
var countyDatabase = {
    alameda : new County('Alameda', 'Oakland', 37.601, -121.719, 12),
    contracosta : new County('Contra Costa', 'Walnut Creek', 37.853409, -121.901795, 12),
    marin : new County('Marin', 'San Rafael', 38.083403, -122.763304, 12),
    napa : new County('Napa', 'Napa', 38.502469, -122.265389),
    sf : new County('San Francisco', 'San Francisco', 37.774929, -122.419416, 12),
    sanmateo : new County('San Mateo', 'Redwood city', 37.433734, -122.401419, 12),
    santaclara : new County('Santa Clara', 'San Jose', 37.333658, -121.890704, 12),
    solanocounty : new County('Solano', 'Fairfield', 38.310497, -121.901795, 12),
    sonomacounty : new County('Sonoma', 'Santa Rosa', 38.577956, -122.988832, 12),
    santacruz : new County('Santa Cruz', 'Santa Cruz', 37.045399, -121.957958, 12)
};

var CountyAPI = function (county, site) {
    this.county = county.position;
    this.city = county.city;
    this.site = site.position;
    this.condition = null;
    this.temperature = null;
    this.humidity = null;
    this.wind = null;
    this.wikiText = null;
    this.nytArray = null;
    this.urlSV = null;
};

function getAPI(name) {
    var county = countyDatabase[name];
    var site = siteDatabase[name + 'site'];
    return $.when(getWeather(county), getNYT(county), getWiki(site)).then(
        function(weather, nyt, wiki) {
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
                const api_key = 'AIzaSyBG2ZPB_EqI2qNnEOSc4IEPUQCbBwinWBQ'
                var url = 'https://maps.googleapis.com/maps/api/streetview?' +
                          'size=600x400' + '&location=' + site.lat + ',' +
                                   site.lng + '&heading=' + site.heading +
                               '&pitch=' + site.pitch + '&key=' + api_key;
                return url;
            })();
            countyAPI.nytArray = (function getnytArray() {
                var toParse = nyt[2].responseJSON.response.docs;
                var nytArray = [];
                for (var i = 0; i < toParse.length; i++) {
                    var article = {
                        title: toParse[i].headline.main,
                        webURL: toParse[i].web_url,
                        leadP: toParse[i].lead_paragraph
                    };
                    nytArray.push(article);
                };
                return nytArray;
            })();
            return countyAPI;
        });

    function dig(object) {
        return object[Object.keys(object)[0]]
    };

    function getWeather(obj) {
        return $.ajax({
            type: "json",
            method: "GET",
            url: "http://api.wunderground.com/api/" +
                "d406854e7b14e2ec" + "/conditions/q/CA/" + obj.city +
                ".json"
        }).promise();
    };

    function getWiki(obj) {
        return $.ajax({
            type: "json",
            url: "https://en.wikipedia.org/w/api.php" + "?origin=*" +
                "&format=json" + "&action=query" + "&prop=extracts" +
                "&exintro=" + "&explaintext=" + "&titles=" + obj.position,
            method: 'GET'
        }).promise();
    };


    function getNYT(obj) {
        var url =
            "https://api.nytimes.com/svc/search/v2/articlesearch.json";
        url += '?' + $.param({
            'api-key': "878139c3c6844fac94b815b3a4698c03",
            'q': obj.position,
            'sort': 'newest',
            'page': 0
        });
        return $.ajax({
            type: "json",
            url: url,
            method: 'GET'
        }).promise();
    };
};

document.addEventListener('DOMContentLoaded', function() {

    var viewModel = function() {
        var self = this;
        self.position = ko.observable("");
        self.site = ko.observable("");
        self.condition = ko.observable(0);
        self.temperature = ko.observable(0);
        self.humidity = ko.observable(0);
        self.wind = ko.observable(0);
        self.wikiText = ko.observable("");
        self.urlSV = ko.observable("");
        self.nytArray = ko.observableArray([]);

        getAPI('sf').then(function(primary) {
            self.position(primary.position),
            self.site(primary.site),
            self.condition(primary.condition),
            self.temperature(primary.temperature),
            self.humidity(primary.humidity),
            self.wind(primary.wind),
            self.wikiText(primary.wikiText),
            self.urlSV(primary.urlSV),
            self.nytArray(primary.nytArray)
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
                self.position(current.position),
                self.site(current.site),
                self.condition(current.condition),
                self.temperature(current.temperature),
                self.humidity(current.humidity),
                self.wind(current.wind),
                self.urlSV(current.urlSV),
                self.nytArray(current.nytArray),
                self.wikiText(current.wikiText)
                for( var i = 0; i < window.markers.length; i++) {
                    console.log(current.site)
                    console.log(markers[i].title)
                    if (markers[i].title != current.site) {
                        markers[i].setMap(null);
                    } else if (markers[i].title == current.site) {
                        markers[i].setMap(bayarea);
                    }
                }
            });
        };
    };
    ko.applyBindings(new viewModel());
});
