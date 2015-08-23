/* Model */
// define neighborhood object 
var neighborhood = {
    lat: 27.7761,
    lng: -82.6386,
    name: 'St. Petersburg, FL'
};

// create ONE infoWindow in the global scope 
var infoWindow = new google.maps.InfoWindow();

// define point object scoring information on each place 
var point = function(map,venue) {
    this.map = map;
    this.name = venue.name;
    this.position = venue.location;
    this.url = venue.url;
    this.address = venue.location.address;
    this.contact = venue.contact.formattedPhone;
    this.rating = venue.rating+'/10';
    this.category = venue.categories[0].name;
    this.marker = new google.maps.Marker({
        map: map,
        position: venue.location,
        title: venue.name,
        animation: google.maps.Animation.DROP
    }); // end marker

    var contentString = '<div id="infoName">'+ this.name + '</div><div id="infoAdd">Address: ' + this.address +'</div><div id="infoCon">Contact: ' + this.contact + '</div>' + '<a id="infoUrl" href = ' + this.url +'>Click for more info</a>'
    
    this.openInfoWindow = function() {
        infoWindow.setContent(contentString);
        infoWindow.open(map,this);
        map.panTo(this.position);
        this.setAnimation(google.maps.Animation.BOUNCE);
        stopAnimation(this);

    }

    // Stop animation after two bounces
    function stopAnimation(marker) {
        setTimeout(function(){
            marker.setAnimation(null);
        }, 1400);
    }

    google.maps.event.addListener(this.marker,'click', this.openInfoWindow);
}

// define FourSquare configure object 
var config = {
    authTokenPara1: 'https://api.foursquare.com/v2/venues/explore?ll=',
    authTokenPara2: '&oauth_token=I3QD5N1FBA1JNPGRATZUNDGEFLHOAEJDEHFSAA13KHXNGCSX&v=20150724'
};

// define Google Map objects
var GoogleMap = function(element,neighborhood) {
    var center = new google.maps.LatLng(neighborhood.lat,neighborhood.lng);
    var mapOptions = {
            panControl: false,
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            center: center,
            zoom: 15
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

    google.maps.event.addListener(marker,'click', function() {
        infoWindow.setContent(marker.title);
        infoWindow.open(map,marker);
    });

    return map;
}


/* ViewModel */
var ViewModel = function() {
    var self=this;
    var mapCanvas =  document.getElementById('map-canvas');
    var fsUrl = config.authTokenPara1+neighborhood.lat+','+neighborhood.lng+config.authTokenPara2;

    self.query= ko.observable('');                        // query observable
    self.points = ko.observableArray();                   // points observableArray
    self.map = GoogleMap(mapCanvas,neighborhood);         // use Google Map objects


    // trigger animation when a marker is clicked and the map pan to that clicked marker
    self.clickMarker = function(clickedPlace) {           
        var placeName = clickedPlace.name.toLowerCase();
        for (var i = 0; i<self.points().length; i++) {
            if (self.points()[i].name.toLowerCase() === placeName.toLowerCase()) {
                google.maps.event.trigger(self.points()[i].marker, 'click');
                self.map.panTo(self.points()[i].position);
            }
        } 
    }; // end clickMarker

    // AJAX request 
    self.getFoursquarePlace = ko.computed(function() {
        $.getJSON(fsUrl, function(data) {
            var place = data.response.groups[0].items;
            for (var i=0; i < place.length; i++) {
                self.points.push(new point(self.map, place[i].venue));
            }
        }).error(function(e){
            console.log('Oops! Fail to get venues from FourSquare');
        }); // end getJSON
    }); // end getFoursquarePlaces 


    // update the place list while searching
    self.search = ko.computed(function(){  
        return ko.utils.arrayFilter(self.points(), function(point){
            return point.name.toLowerCase().indexOf(self.query().toLowerCase()) >= 0;
        });
    });

    // update markers while searching
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
