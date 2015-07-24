/* Model */
var initialNeighborhood = 'Miami, FL';

/* ViewModel */
var ViewModel = function() {
    var self=this;
    var map;
    var service;

    this.neighborhood = ko.observable(initialNeighborhood);

    function initialMap() {
        var mapOptions = {
            zoom: 14,
            disableDefaultUI: true
        };
        map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
    }

    initialMap();

    function searchNeighborhood(neighborhood) {
        var request = {
            query: neighborhood
        };
        service = new google.maps.places.PlacesService(map);
        service.textSearch(request, callbackNeighborhood);
    }

    this.resetNeighborhood = ko.computed(function() {
        if (self.neighborhood() != '' ) {
            searchNeighborhood(self.neighborhood());
        }
    });

    function callbackNeighborhood(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            showNeighborhood(results[0]);
        }
    }

    function showNeighborhood(placeData) {
        var lat = placeData.geometry.location.lat();    // latitude from the place service
        var lon = placeData.geometry.location.lng();    // longitude from the place service
        var name = placeData.formatted_address;         // name of the place from the place service
        var bounds = new google.maps.LatLngBounds();    // create a LatLngBounds object
        var neighCenter = new google.maps.LatLng(lat,lon);

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
        });

        // extend the bound to contain the given point
        bounds.extend(placeData.geometry.location);
        // center the map
        map.setCenter(neighCenter); 

    }

};

ko.applyBindings(new ViewModel())