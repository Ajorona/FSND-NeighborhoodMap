
function County(name) {
  this.weather = {};
  this.wiki = {};
  this.nyt = {};
  this.name = name;
}

var currentCounty = new Country();

function getCounty(countyClick) {
    var countyObj  = countyDatabase[countyClick];
    $.when(getWeather(countyObj),getNYT(countyObj), getWiki(countyObj).done(function(weather, nyt, wiki) {
  currentCounty.weather = weather;
  currentCounty.nyt = nyt;
  currentCounty.wiki = wiki;
});
  }

 
 
 function getWeather() {
      var deferred = $.Deferred();
      $.ajax({
          dataType: "json",
          method: "GET",
          url: "http://api.wunderground.com/api/"
          + "d406854e7b14e2ec"
          + "/conditions/q/CA/San_Francisco.json"
      }).then(function(data) {
         deferred.resolve(data);
            }).catch(function(error) {
          deferred.reject(error)
          alert("AJAX REQUEST FAILED");
      });
  }

  function getNYT(county) {
  var deferred = $.Deferred();
      var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
      url += '?' + $.param({
          'api-key': "878139c3c6844fac94b815b3a4698c03",
          'q': county.name,
          'sort': 'newest',
          'page': 0
      });
      $.ajax({
          url: url,
          method: 'GET',
      }).then(function(result) {
          console.log('success nyt');
          currentCounty.nyt = result;
      }).catch( function(xhr, textStatus, errorThrown){
        alert('request failed');
      });
  }

  function getWiki() {
   var deferred = $.Deferred();
      $.ajax({
          url: "http://en.wikipedia.org/w/api.php" 
             + "?origin=*"
             + "&format=json"                     
             + "&action=query"
             + "&prop=extracts"
             + "&exintro="
             + "&explaintext="
             + "&titles=San%20Francisco",
            method: 'GET'
      }).then(function(data) {
          console.log(currentCounty.wiki);
          deferred.resolve(data);
      }).catch( function(xhr, textStatus, errorThrown){
        alert('request failed');
      });
  }