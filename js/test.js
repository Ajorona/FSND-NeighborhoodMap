    var getWeather = function(countyObj) {
        return $.ajax({
            dataType: "json",
            method: "GET",
            url: "http://api.wunderground.com/api/" +
                "d406854e7b14e2ec" + "/conditions/q/CA/" +
                countyObj.position + ".json"
        });
    };
    var getWiki = function(countyObj) {
        return $.ajax({
            url: "http://en.wikipedia.org/w/api.php" +
                "?origin=*" + "&format=json" +
                "&action=query" + "&prop=extracts" +
                "&exintro=" + "&explaintext=" + "&titles=" +
                countyObj.position,
            method: 'GET'
        });
    };
    var getNYT = function(countyObj) {
        var url =
            "https://api.nytimes.com/svc/search/v2/articlesearch.json";
        url += '?' + $.param({
            'api-key': "878139c3c6844fac94b815b3a4698c03",
            'q': countyObj.position,
            'sort': 'newest',
            'page': 0
        });
        return $.ajax({
            url: url,
            method: 'GET'
        });
    };
    var CountyData = function(name) {
        this.weather = {};
        this.wiki = {};
        this.nyt = {};
        this.name = name;
        var currentCounty = new CountyData();
        var getCounty = function(name) {
            var countyObj = countyDatabase[name];
            $.when(getWeather(countyObj), getNYT(countyObj),
                getWiki(countyObj)).then(function(weather,
                nyt, wiki) {
                currentCounty.weather = weather;
                currentCounty.nyt = nyt;
                currentCounty.wiki = wiki;
                currentCounty.name = countyObj.name;
            });
        return currentCounty
        };
        
    var CountyData = function (name) {
        this.weather = {};
        this.wiki = {};
        this.nyt = {};
        this.name = name;
    };
    
        
    currentCounty = CountyData('alameda');
    console.log(currentCounty);
        
        