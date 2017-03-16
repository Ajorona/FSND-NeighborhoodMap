
$(window).load(getWeatherJSON());

function getWeatherJSON() {
    $.ajax({
        dataType: "json",
        method: "GET",
        url: "http://api.wunderground.com/api/"
        + "d406854e7b14e2ec"
        + "/conditions/q/CA/San_Francisco.json"
    }).done(function(data) {
        console.log(data);
    }).fail(function() {
        alert("AJAX REQUEST FAILED");
    });
}