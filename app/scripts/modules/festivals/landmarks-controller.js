function LandmarksController($scope, $state, $stateParams, FestivalService, LandmarkService) {
  var fail = function(model,err){console.log("Could not retrieve "+(model||'landmark')+"(s): ",err)};

  var landmarks = function(landmarks) {
    $scope.landmarks = landmarks;
  };

  var map = function(landmarks) {
    $scope.landmarks = landmarks;

    require('../../../bower_components/google-maps/lib/Google').load(function(g) {
    // Set lat long coords for center of map
    var latLng = new g.maps.LatLng(36.271895, -115.009732);
    var mapOptions = {
      center: latLng,
      zoom: 16,
      mapTypeId: g.maps.MapTypeId.SATELLITE,
      streetViewControl: false,
      mapTypeControl: false
    };
    // Create new map based on set lat long coords
    $scope.map = new g.maps.Map(document.getElementById("map"), mapOptions);

    FestivalOverlay.prototype = new g.maps.OverlayView();
    var overlay;
    var bounds = new google.maps.Circle({
      center: latLng, radius: 600
    }).getBounds();
    overlay = new FestivalOverlay(bounds, festival.get('mapImage').url(), $scope.map);
    // Image overlay (https://developers.google.com/maps/documentation/javascript/examples/overlay-simple)
      function FestivalOverlay(bounds, image, map) {
        this.bounds_ = bounds;
        this.image_ = image;
        this.map_ = map;
        this.div_ = null;
        this.setMap(map);
      }

      FestivalOverlay.prototype.onAdd = function() {
        var div = document.createElement('div');
        div.style.borderStyle = 'none';
        div.style.borderWidth = '0px';
        div.style.position = 'absolute';

        // Create the img element and attach it to the div.
        var img = document.createElement('img');
        img.src = this.image_;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.position = 'absolute';
        div.appendChild(img);

        this.div_ = div;

        // Add the element to the "overlayLayer" pane.
        var panes = this.getPanes();
        panes.overlayLayer.appendChild(div);
      }

      FestivalOverlay.prototype.draw = function() {
        // We use the south-west and north-east
        // coordinates of the overlay to peg it to the correct position and size.
        // To do this, we need to retrieve the projection from the overlay.
        var overlayProjection = this.getProjection();

        // Retrieve the south-west and north-east coordinates of this overlay
        // in LatLngs and convert them to pixel coordinates.
        // We'll use these coordinates to resize the div.
        var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
        var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

        // Resize the image's div to fit the indicated dimensions.
        var div = this.div_;
        div.style.left = sw.x + 'px';
        div.style.top = ne.y + 'px';
        div.style.width = (ne.x - sw.x) + 'px';
        div.style.height = (sw.y - ne.y) + 'px';
      }


    for (var i = 0; i < landmarks.length; i++) {
      // Get landmark lat long coords from Parse and place marker on map
      var lm = landmarks[i];
      var name = lm.get('name')
        , category = lm.get('category')
        , lat = lm.get('latitude')
        , lng = lm.get('longitude');

      var marker = new g.maps.Marker({
        position: {lat: lat, lng: lng},
        map: $scope.map,
        icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
        title: name,
      });
      function onClick(name, category, marker) {
        new g.maps.InfoWindow({
          content: name + " (" + category + ")"
        }).open($scope.map, marker)
      }
      marker.addListener('click', onClick.bind(null, name, category, marker));
    }
    });
  };

  var festival;
  FestivalService.getFestival($stateParams.festivalId)
  .then(function(f) {
    festival = f;
    $scope.festival = f;
    switch ($state.current.name) {
      case 'main.festival.map':
        LandmarkService.getLandmarks()
          .then(map, fail);
        break;
      case 'main.festival.landmarks':
        LandmarkService.getLandmarks()
          .then(landmarks, fail);
        break;
    }
    }, fail);
};

module.exports = angular.module('LinedUp.controllers.Landmarks', [])
.controller('LandmarksController', [
  '$scope',
  '$state',
  '$stateParams',
  'FestivalService',
  'LandmarkService',
  LandmarksController
]);
