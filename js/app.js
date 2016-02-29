var model = [
	{lat: 37, long: 34},
	{lat: 37.0001, long: 34.0033},
	{lat: 37.0011, long: 34.0003}
]

var Loc = function(loc){
	this.lat = loc.lat;
	this.long = loc.long;
}

var ViewModel = function () {
	var self = this;
	this.mapList = ko.observableArray([]);
	model.forEach(function(eachLoc){
		self.mapList.push(new Loc(eachLoc));
	});
}

var map;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
	  center: {lat: -34.397, lng: 150.644},
	  zoom: 8
	});
}

ko.applyBindings(new ViewModel());
