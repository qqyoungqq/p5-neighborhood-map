// To do: better binding 
/* Model */
var neighborhood = {
    lat: 25.7616798,
    lng: -80.19179020000001,
    name: 'Miami, FL'
}

var config = {
    authTokenPara1: 'https://api.foursquare.com/v2/venues/explore?ll=',
    authTokenPara2: '&oauth_token=I3QD5N1FBA1JNPGRATZUNDGEFLHOAEJDEHFSAA13KHXNGCSX&v=20150724'
};

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
    var map;
    var mapCanvas =  document.getElementById('map-canvas');
    var fsUrl = config.authTokenPara1+neighborhood.lat+','+neighborhood.lng+config.authTokenPara2;

    self.initialList = ko.observableArray();              // pre-defined placed 
    self.filterList = ko.observableArray();
    self.searchWord = ko.observable('');

    function initialMap() {
        map = GoogleMap(mapCanvas,neighborhood);
        } // end initialMap

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

    initialMap();

    self.displayMarker = ko.computed(function() {
        $.getJSON(fsUrl, function(data) {
            var place = data.response.groups[0].items;
            for (var i=0; i < place.length; i++) {
                createPlaceMarker(place[i].venue);
                self.initialList.push(place[i]);
                self.filterList.push(place[i].venue);
            }
        }); // end getJSON
    }); // end displayMarker 

}; // end ViewModel

ko.applyBindings(new ViewModel());