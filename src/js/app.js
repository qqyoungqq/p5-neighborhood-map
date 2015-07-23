function initialize() {
	var neighborhood = 'Coral Gables, FL';

    var request = {
    	   query: neighborhood
    };

	var mapOptions = {
    	zoom: 14,
    	disableDefaultUI: true
	};

    var map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
    var infowindow = new google.maps.InfoWindow();

    var service = new google.maps.places.PlacesService(map);
    service.textSearch(request, callbackNeighborhood);
	
    function callbackNeighborhood(results, status) {
    	if (status == google.maps.places.PlacesServiceStatus.OK) {
    		getNeighborhoodInformation(results[0])
    	}
    }

    function getNeighborhoodInformation(placeData) {
 		var lat = placeData.geometry.location.lat();  // latitude from the place service
    	var lon = placeData.geometry.location.lng();  // longitude from the place service
    	var name = placeData.formatted_address;   	  // name of the place from the place service
    	var neighCenter = new google.maps.LatLng(lat,lon);
    	map.setCenter(neighCenter);	
    }

  window.mapBounds = new google.maps.LatLngBounds();
}

google.maps.event.addDomListener(window,'load',initialize);

window.addEventListener('resize', function(e) {
  // Make sure the map bounds get updated on page resize
   map.fitBounds(mapBounds);
});