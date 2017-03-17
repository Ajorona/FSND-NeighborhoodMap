'use strict';
document.addEventListener('DOMContentLoaded', function () {   

var AppViewModel = function () {
    var self = this;
    self.condition = ;
    self.humidity = "40%";
    self.temperature = "75";
    self.wind = "5";
};

ko.applyBindings(new AppViewModel());

//END
});