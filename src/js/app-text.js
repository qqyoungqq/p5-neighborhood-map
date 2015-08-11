// To do: better binding 
/* Model */
var neighborhood = {
    lat: 27.7761,
    lng: -82.6386,
    name: 'St. Petersburg, FL'
};

var request = {
    location: new google.maps.LatLng(neighborhood.lat,neighborhood.lng),
    radius: 500,
    types: ['food']
};

// MapMarkerSet class contains information of map markers for searching.
var PlaceMarkerSet = function(marker, name, position) {
  this.marker = marker,
  this.name = name,
  this.position = position
};


var config = {
    authTokenPara1: 'https://api.foursquare.com/v2/venues/explore?ll=',
    authTokenPara2: '&oauth_token=I3QD5N1FBA1JNPGRATZUNDGEFLHOAEJDEHFSAA13KHXNGCSX&v=20150724'
};

// Define Google Map objects
var GoogleMap = function(element,neighborhood) {
    var center = new google.maps.LatLng(neighborhood.lat,neighborhood.lng);
    var mapOptions = {
            center: center,
            zoom: 16
    };    
    var map = new google.maps.Map(element,mapOptions);
    var marker = new google.maps.Marker({
            map: map,
            position: center,
            title: neighborhood.name,
            icon: {
            // Star
                path: 'M 0,-24 6,-7 24,-7 10,4 15,21 0,11 -15,21 -10,4 -24,-7 -6,-7 z',
                fillColor: '#ffff00',
                fillOpacity: 1,
                scale: 1/2,
                strokeColor: '#bd8d2c',
                strokeWeight: 1
            }
    }); // end marker
    return map;
}


/* ViewModel */
var ViewModel = function() {
    var self=this;
    var mapCanvas =  document.getElementById('map-canvas');
    var fsUrl = config.authTokenPara1+neighborhood.lat+','+neighborhood.lng+config.authTokenPara2;
    var placeMarkers = [];

    self.initialList = ko.observableArray();              // pre-defined placed 
    self.filterList = ko.observableArray();
    self.searchWord = ko.observable('');
    self.map = GoogleMap(mapCanvas,neighborhood);         // use Google Map objects

    var service = new google.maps.places.PlacesService(self.map);
    service.nearbySearch(request, callback);

    self.clickMarker = function(clickedPlace) {
        var placeName = clickedPlace.name.toLowerCase();
        for (var i in placeMarkers) {
        if (placeMarkers[i].name === placeName) {
            google.maps.event.trigger(placeMarkers[i].marker, 'click');
            map.panTo(placeMarkers[i].position);
        }
        }
    }; // end clickMarker

    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                createMarker(results[i]);
                self.initialList.push(results[i]);
                self.filterList.push(results[i]);
            }
        }
    }

    //Define functions to display markers on the map (communicate with Google Map)
    function createMarker(data) {
        var placeLoc = data.geometry.location;
        var name = data.name;
        var bounds = new google.maps.LatLngBounds(); 
        var marker = new google.maps.Marker({
            map: self.map,
            position: placeLoc
        }); // end marker

        placeMarkers.push(new PlaceMarkerSet(marker, name.toLowerCase(), placeLoc));

        var infoWindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker,'click', function() {
            infoWindow.setContent(data.name);
            infoWindow.open(self.map,this);
        });

        bounds.extend(placeLoc);
        
    } // end createPlaceMarker()

}; // end ViewModel

ko.applyBindings(new ViewModel());