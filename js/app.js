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
	BUSINESS_PATH = '/v2/business';

var model = {
	data: [],
	init: function() {
		// this.mapList = ko.observableArray([]);
    }
}

/**
 * Generates a random number and returns it as a string for OAuthentication
 * @return {string}
 */
function nonce_generate() {
  return (Math.floor(Math.random() * 1e10).toString());
}

/**
 * Makes a request with the Yelp API
 * @param {string} host Host of the Yelp API
 * @param {string} path Path to the serch term or specific business
 * @return {jsonp} responce of the request
 */
function request(host, path){
	var yelp_url = 'https://' + host + path;

	var parameters = {
      oauth_consumer_key: CONSUMER_KEY,
      oauth_token: TOKEN,
      oauth_nonce: nonce_generate(),
      oauth_timestamp: Math.floor(Date.now()/1000),
      oauth_signature_method: 'HMAC-SHA1',
      oauth_version : '1.0',
      callback: 'cb',              // This is crucial to include for jsonp implementation in AJAX or else the oauth-signature will be wrong.
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
      success: function(results) {
      	//add results to the model.data object
        model.data = results;
        console.log("Success!");
      },
      fail: function() {
        console.log("fail :-(");

      }
    };
    // Send AJAX query via jQuery library.
    return $.ajax(settings);
}

function addMarker(location, label, map) {
	var marker = new google.maps.Marker({
		position: location,
		label: label,
		map: map
	});
}

var map;
function initMap() {
	var sydney = {lat: -33.8650, lng: 151.2094};
	map = new google.maps.Map(document.getElementById('map'), {
		center: sydney,
		scrollwheel: false,
		zoom: 15
	});
}

var ViewModel = function () {
	var self = this;
	$.ready(request(API_HOST, SEARCH_PATH));

}

ko.applyBindings(new ViewModel());
