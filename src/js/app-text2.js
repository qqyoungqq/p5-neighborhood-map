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
            zoom: 14
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

    function initialMap() {
        map = GoogleMap(mapCanvas,neighborhood);

          var request = {
            location: new google.maps.LatLng(neighborhood.lat,neighborhood.lng),
            radius: '500',
            types: ['restaurant']
        };

        service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, callback);


        } // end initialMap

    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            var place = results[i];
            createPlaceMarker(results[i]);
            }
        }
    }

    function createPlaceMarker(data) {
        //var lat = data.location.lat;
        //var lng = data.location.lng;
        //var name = data.name;
        //var address = data.location.address;
        var bounds = new google.maps.LatLngBounds(); 

        var marker = new google.maps.Marker({
            map: map,
            position: data.geometry.location,
            title: data.name
        }); // end marker

        var infoWindow = new google.maps.InfoWindow({
            content: data.name
        }); // end infoWindow

        google.maps.event.addListener(marker,'click', function() {
            infoWindow.open(map,marker);
        });

        bounds.extend(data.geometry.location);

        //map.fitBounds(bounds);
        
    } // end createPlaceMarker

    initialMap();

    /*self.displayMarker = ko.computed(function() {
        $.getJSON(fsUrl, function(data) {
            var place = data.response.groups[0].items;
            for (var i=0; i < place.length; i++) {
                createPlaceMarker(place[i].venue);
                self.initialList.push(place[i]);
            }

            // change the map boundary according to suggestedBounds
            var bounds = data.response.suggestedBounds;
            if (bounds != undefined) {
                mapBounds = new google.maps.LatLngBounds(
                new google.maps.LatLng(bounds.sw.lat, bounds.sw.lng),
                new google.maps.LatLng(bounds.ne.lat, bounds.ne.lng));
                map.fitBounds(mapBounds);
            }
        }); // end getJSON
    }); // end displayMarker*/

}; // end ViewModel

ko.applyBindings(new ViewModel());