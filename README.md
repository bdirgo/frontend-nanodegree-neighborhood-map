# frontend-nanodegree-neighborhood-map
Started this project by using the sample code from Google Maps, and began adding functions that I need. Such as the addMarker function, to add Markers on top of the map. All of this was in one file called map.js and called by the googlemaps.html.
Once the map.js file was rendering properly I moved on to trying to get the ajax call. So I created an ajax.js and called it from the ajax.html. The tricky part with that was trying to get the signature for OAuth correct. First I had to learn what a nonce is, it's a unique identifier so use Math.random for that. Then I had to figure out how to put all of the required parameters into the "header", turns out that just means pass all the parameters in the same URL that the search term is on seperated by ampersands, "&". This was the most tricky part, because XHR is very particular, and jQuery kept on inserting its own callback for some reason...
Now I am trying to get the two of them to talk to each other. Much progress has been made, I feel like I'm half way there.

Much thanks to MarkN for this forum post explaining how AJAX works, https://discussions.udacity.com/t/how-to-make-ajax-request-to-yelp-api/13699/4

And to vshane668 for the help figuring out how to use that data once the ajax call came through, https://discussions.udacity.com/t/updating-knockout-observablearray-with-ajax-callback-produces-randomly-sorted-results/47528


