var CONSUMER_KEY = "aphDfCWy7HLKW6bBTslbLQ",
	TOKEN = "qe9IDWhZwsr39pz3mKxeXLoMvLy4OgHP",
	CONSUMER_SECRET = "AXmph-zynkPixYHUtj7xZY-DxyQ",
	TOKEN_SECRET = "EDI1ptFZogJvC9APmWr-AoIc2LY",
	API_HOST = 'api.yelp.com',
	DEFAULT_TERM = 'thai',
	DEFAULT_LOCATION = 'Sydney',
	SEARCH_LIMIT = 10,
	SEARCH_PATH = '/v2/search',
	SEARCH_LOCATION = 'Glebe,+Sydney+New+South+Wales',
	BUSINESS_PATH = '/v2/business',
	BUSINESS_TERM = 'yelp-san-francisco';

/**
 * Generates a random number and returns it as a string for OAuthentication
 * @return {string}
 */
function nonce_generate() {
  return (Math.floor(Math.random() * 1e12).toString());
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
  setMapOnAll(map);
}

// Set the map on a specific marker
function setMapOnMarker(i, map) {
	markers[i].setMap(map);
}


/**
 * Creates a Marker on the map that is passed in
 * @param {object} location, {lat: 123, lng: 22}
 * @param {object} map, the map the marker will appear on
 * @return {marker} returns the marker made so that the model can reference it later
 */
function addMarker(location, contentString, map) {
	var infowindow = new google.maps.InfoWindow({
		content: contentString,
		maxWidth: 200
	});
	var marker = new google.maps.Marker({
		position: location,
		animation: google.maps.Animation.DROP,
		map: map,
	});
	marker.addListener('click', function() {

		if(lastInfoWindow === infowindow) {
		    infowindow.close();
		    lastInfoWindow = null;
		    marker.setAnimation(null);
		}
		else {
		    if(lastInfoWindow !== null) {
		        lastInfoWindow.close();
		    }
		    infowindow.open(map, marker);
		    marker.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){marker.setAnimation(null);}, 1440);
		    lastInfoWindow = infowindow;
		}
	});
	markers.push(marker);
	return marker;
}

var map;
var lastInfoWindow = null;
var markers = [];
function initMap() {
	var sydney = {lat: -33.8650, lng: 151.2094};
	map = new google.maps.Map(document.getElementById('map'), {
		center: sydney,
		scrollwheel: false,
		zoom: 15
	});
}

function googleError() {
	alert('There seems to be something that has gone wrong. Make sure you are connected to the internet, and try refreshing the page.');
}

window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
    alert('There seems to be something that has gone wrong. Make sure you are connected to the internet, and try refreshing the page. If you are the site administrator the details are below. Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber
    + ' Column: ' + column + ' StackTrace: ' +  errorObj);
}

/**
 * Place class with Knockout Observables as the properties
 * @param {string} name, Name of the resturant
 * @param {string} id, unique id
 * @param {number} lat
 * @param {number} lng
 */
var Place = function(name, id, lat, lng, address) {
	this.name = ko.observable(name);
	this.business_id = ko.observable(id);
	this.lat = ko.observable(lat);
	this.lng = ko.observable(lng);
	this.address = ko.observableArray(address);
	this.formattedAddress = ko.observable("<b>" + name + "</b> <br>" + address.join("<br> "));
	this.marker = addMarker({lat: lat,lng: lng}, "<b>" + name + "</b> <br>" + address.join("<br> "), map);
	this.showHide = ko.observable(true);
}

var ViewModel = function () {

	var self = this;
	this.mapList = ko.observableArray([]);
	var $mapList = $("#mapList");
	this.query = ko.observable('');
	this.showHide = ko.observable(true);

	self.search = function(value) {
		if (value !== '') {
			clearMarkers();
			for (var x in self.mapList()) {
				if (self.mapList()[x].name().toLowerCase().indexOf(value.toLowerCase()) >= 0) {
					self.mapList()[x].showHide(true);
					setMapOnMarker(x,map);
				} else {

					self.mapList()[x].showHide(false);
				}
			}
		}
		else if (value === '') {
			self.showHide(true);
			showMarkers();
			for (var x in self.mapList()) {
				self.mapList()[x].showHide(true);
			}
		}
	}

	self.query.subscribe(self.search);

	self.setCurrentPlace = function(clickedPlace) {
		self.currentPlace(clickedPlace);
		var infowindow = new google.maps.InfoWindow({
			content: self.currentPlace().formattedAddress(),
			position: {lat: self.currentPlace().lat(), lng: self.currentPlace().lng()},
			pixelOffset: {width:0, height:-40},
			maxWidth: 200
		});
		if(lastInfoWindow === infowindow) {
		    infowindow.close();
		    lastInfoWindow = null;
		}
		else {
		    if(lastInfoWindow !== null) {
		        lastInfoWindow.close();
		    }
		    infowindow.open(map, self.currentPlace.marker);
		    lastInfoWindow = infowindow;
		}
	};

	self.request = function(callback){
		var yelp_url = 'https://' + API_HOST + SEARCH_PATH;

		var parameters = {
			callback: 'cb',              // This is crucial to include for jsonp implementation in AJAX or else the oauth-signature will be wrong.
			oauth_consumer_key: CONSUMER_KEY,
			oauth_token: TOKEN,
			oauth_nonce: nonce_generate(),
			oauth_timestamp: Math.floor(Date.now()/1000),
			oauth_signature_method: 'HMAC-SHA1',
			oauth_version : '1.0',
			term: DEFAULT_TERM,
			location: DEFAULT_LOCATION
		};

		var encodedSignature = oauthSignature.generate('GET',yelp_url, parameters, CONSUMER_SECRET, TOKEN_SECRET);
		parameters.oauth_signature = encodedSignature;

		var settings = {
			url: yelp_url,
			data: parameters,
			cache: true,                // This is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
			dataType: 'jsonp',
			success: function(results){
				clearTimeout(requestTimeout);
				callback(results);
			},
			fail: function(xhr, status) {
				alert("Sorry, but something went wrong when loading the website. Make sure you are connected to the internet, and try refreshing the page. Error code: " + status);
				console.log("AJAX fail :-(");
			}
		};

		//Handle a failed ajax call by placing text where the list would go.
		var requestTimeout = setTimeout(function(){
			$mapList.text("failed to get Yelp resources. Make sure you are connected to the internet, and try refreshing the page.");
		}, 8000);

		// Send AJAX query via jQuery library.
		$.ajax(settings);
	};

	self.request(function(data){
		for (var i = data.businesses.length - 1; i >= 0; i--) {
	  		self.mapList.push(new Place(
	  			data.businesses[i].name,
	  			data.businesses[i].id,
	  			data.businesses[i].location.coordinate.latitude,
	  			data.businesses[i].location.coordinate.longitude,
	  			data.businesses[i].location.display_address
	  			));
	  	};
		self.currentPlace = ko.observable( self.mapList()[0] );
	});


}

ko.applyBindings(new ViewModel());
