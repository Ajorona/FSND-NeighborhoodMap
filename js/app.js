document.addEventListener ('DOMContentLoaded', function () {

    var AppViewModel = function () {
      var self = this;
      self.condition = "sunny";
      self.humidity = "40%";
      self.temperature = "75";
      self.wind = "5";
  };

  ko.applyBindings (new AppViewModel());

  nm.getCounty ("SanFrancisco");

  nm.countyData = function (name) {
    this.weather = {};
    this.wiki = {};
    this.nyt = {};
    this.name = name;
  }

  nm.currentCounty = new countyData ();

  nm.getCounty = function (name) {
    var countyObj = countyDatabase[name];
    $.when(getWeather(countyObj), getNYT(countyObj), getWiki(countyObj)
    ).done(function(weather, nyt, wiki) {
        currentCounty.weather = weather;
        currentCounty.nyt = nyt;
        currentCounty.wiki = wiki;
        currentCounty.name = countyObj.name;
        console.log(currentCounty.weather);
        console.log(currentCounty.nyt);
        console.log(currentCounty.wiki);
    });
  }
  ///// UNIT AJAX REQUESTS /////

  nm.getWeather = function (countyObj) {
      var deferred = $.Deferred();
      $.ajax({
          dataType: "json",
          method: "GET",
          url: "http://api.wunderground.com/api/"
          + "d406854e7b14e2ec"
          + "/conditions/q/CA/"
          + countyObj.name
          + ".json"
      }).then(function(data) {
          deferred.resolve(data);
      }).catch( function(xhr, textStatus, errorThrown){
          console.error("weather failed");
      });
  }

  nm.getNYT = function (countyObj) {
      var deferred = $.Deferred();
      var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
      url += '?' + $.param({
          'api-key': "878139c3c6844fac94b815b3a4698c03",
          'q': countyObj.name,
          'sort': 'newest',
          'page': 0
      });
      $.ajax({
          url: url,
          method: 'GET',
      }).then(function(data) {
          deferred.resolve(data);
      }).catch( function(xhr, textStatus, errorThrown){
          console.error("nyt failed");
      });
  }

  nm.getWiki = function (countyObj) {
      var deferred = $.Deferred();
      $.ajax({
          url: "http://en.wikipedia.org/w/api.php" 
             + "?origin=*"
             + "&format=json"                     
             + "&action=query"
             + "&prop=extracts"
             + "&exintro="
             + "&explaintext="
             + "&titles="
             + countyObj.name,
            method: 'GET'
      }).then(function(data) {
          deferred.resolve(data);
      }).catch( function(xhr, textStatus, errorThrown){
          console.error("wiki failed");
      });
  }
});