// To do: better binding 
/* Model */
var initialNeighborhood = 'Miami, FL';
var config = {
    authTokenPara1: 'https://api.foursquare.com/v2/venues/explore?ll=',
    authTokenPara2: '&oauth_token=I3QD5N1FBA1JNPGRATZUNDGEFLHOAEJDEHFSAA13KHXNGCSX&v=20150724'
};

/* ViewModel */
var ViewModel = function() {
    var self=this;
    var map;
    var service;

    this.neighborhood = ko.observable(initialNeighborhood); // pre-defined neighborhood
    this.initialList = ko.observableArray([]);              // pre-defined placed 

    function initialMap() {
        var mapOptions = {
            zoom: 14,
            disableDefaultUI: true
        };
        map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
    } // end initialMap

    initialMap();

    function searchNeighborhood(neighborhood) {
        var request = {
            query: neighborhood
        };
        service = new google.maps.places.PlacesService(map);
        service.textSearch(request, callbackNeighborhood);
    } // end searchNeighborhood

    this.resetNeighborhood = ko.computed(function() {
        if (self.neighborhood() != '' ) {
            searchNeighborhood(self.neighborhood());
        }
    });

    function callbackNeighborhood(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            showNeighborhood(results[0]);
        }
    } // end callbackNeighborhood

    function showNeighborhood(placeData) {
        var lat = placeData.geometry.location.lat();    // latitude from the place service
        var lng = placeData.geometry.location.lng();    // longitude from the place service
        var name = placeData.formatted_address;         // name of the place from the place service
        var bounds = new google.maps.LatLngBounds();    // create a LatLngBounds object
        var neighCenter = new google.maps.LatLng(lat,lng);

        var marker = new google.maps.Marker({
            map: map,
            position: placeData.geometry.location,
            title: name,
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

        // extend the bound to contain the given point
        bounds.extend(placeData.geometry.location);
        // center the map
        map.setCenter(neighCenter); 

        var fsUrl = config.authTokenPara1+lat+','+lng+config.authTokenPara2;
        //self.initialList(fsUrl);
        $.getJSON(fsUrl, function(data) {
            var place = data.response.groups[0].items;
            /* Place marker for each place. */
            for (var i=0; i < place.length; i++) {
                /* Get marker's location */
                createPlaceMarker(place[i].venue);
                self.initialList.push(place[i]);
            }
        }); // end getJSON

    } // end showNeighborhood


    function createPlaceMarker(data) {
        var lat = data.location.lat;
        var lng = data.location.lng;
        var name = data.name;
        var address = data.location.address;
        var bounds = new google.maps.LatLngBounds(); 

        var marker = new google.maps.Marker({
            map: map,
            position: new google.maps.LatLng(lat, lng),
            title: name
        }); // end marker

        var infoWindow = new google.maps.InfoWindow({
            content: address
        }); // end infoWindow

        google.maps.event.addListener(marker,'click', function() {
            infoWindow.open(map,marker);
        });

        bounds.extend(new google.maps.LatLng(lat, lng));
        
    } // end createPlaceMarker

    //console.log(this.initialList().length);
    //requestPlace(this.neighborhoodLat(),this.neighborhoodLng());
}; // end ViewModel

ko.applyBindings(new ViewModel())
