//jQuery AJAX requests return promise object
var getWeather = function (obj) {
        return $.ajax({
            dataType: "json",
            method: "GET",
            url: "http://api.wunderground.com/api/" +
                "d406854e7b14e2ec" + "/conditions/q/CA/" +
                obj.position + ".json"
        });
    };

var getWiki = function (obj) {
        return $.ajax({
            url: "http://en.wikipedia.org/w/api.php" +
                "?origin=*" + "&format=json" +
                "&action=query" + "&prop=extracts" +
                "&exintro=" + "&explaintext=" + "&titles=" +
                obj.position,
            method: 'GET'
        });
    };
var getNYT = function (obj) {
    var url =
        "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    url += '?' + $.param({
        'api-key': "878139c3c6844fac94b815b3a4698c03",
        'q': obj.position,
        'sort': 'newest',
        'page': 0
    });
    return $.ajax({
        url: url,
        method: 'GET'
    });
};

var CountyAPI = function (county, site) {
    this.county = county.position;
    this.site = site.position;
    this.weather = {};
    this.wiki = {}; 
    this.nyt = {};
};

var getAPI = function(name) {
    var county = countyDatabase[name];
    var site = SViewDatabase[name + 'site'];
    var countyAPI = new CountyAPI(county, site);
    $.when(getWeather(county), getNYT(county),
        getWiki(site)).then(function (weather,
        nyt, wiki) {
        countyAPI.weather = weather;
        countyAPI.nyt = nyt;
        countyAPI.wiki = wiki;
    });
    return countyAPI;
};

//external raw git file used for countyDatabase
    var current = getAPI('alameda');
    console.log(current);