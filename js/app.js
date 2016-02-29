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

function initMap() {
	  var myLatLng = {lat: 37, lng: 34};

	  // Create a map object and specify the DOM element for display.
	  var map = new google.maps.Map(document.getElementById('map'), {
	    center: myLatLng,
	    scrollwheel: false,
	    zoom: 13
	  });

	  // Create a marker and set its position.
	  var marker = new google.maps.Marker({
	    map: map,
	    position: myLatLng,
	    title: 'Hello World!'
	  });
	}

ko.applyBindings(new ViewModel());
