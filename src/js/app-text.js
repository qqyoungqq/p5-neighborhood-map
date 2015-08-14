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

var point = function(map,name,position) {
    this.map = map;
    this.name = name;
    this.position = position;
    this.marker = new google.maps.Marker({
        map: map,
        position: position,
        title: name
    }); // end marker

   var infoWindow = new google.maps.InfoWindow();

    google.maps.event.addListener(this.marker,'click', function() {
        infoWindow.setContent(name);
        infoWindow.open(map,this);
    });

}

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

    self.query= ko.observable('');
    self.points = ko.observableArray();
    self.map = GoogleMap(mapCanvas,neighborhood);         // use Google Map objects

    var service = new google.maps.places.PlacesService(self.map);
    service.nearbySearch(request, callback);

    self.clickMarker = function(clickedPlace) {
        var placeName = clickedPlace.name.toLowerCase();
        for (var i = 0; i<self.points().length; i++) {
            if (self.points()[i].name.toLowerCase() === placeName.toLowerCase()) {
                google.maps.event.trigger(self.points()[i].marker, 'click');
                self.map.panTo(self.points()[i].position);
            }
        } 
    }; // end clickMarker

    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                self.points.push(new point(self.map,results[i].name,results[i].geometry.location));
            }
        }
    }

    // Update the place list while searching
    self.search = ko.computed(function(){  
        return ko.utils.arrayFilter(self.points(), function(point){
            return point.name.toLowerCase().indexOf(self.query().toLowerCase()) >= 0;
        });
    });

    // Update markers while searching
    self.updateMarkers = ko.computed(function(){
            for (var i=0; i < self.points().length; i++) {
                if (self.points()[i].name.toLowerCase().indexOf(self.query().toLowerCase()) <0 ) {
                    self.points()[i].marker.setVisible(false);
                } else {
                    self.points()[i].marker.setVisible(true);
                }
            }
    });

}; // end ViewModel

ko.applyBindings(new ViewModel());
