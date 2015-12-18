function MapController($scope, $state, $stateParams, LandmarkService) {
  console.log('Hello from your Controller: MapController in module main:. This is your controller:', this);

  var show = function() {
    LandmarkService.getLandmark($stateParams.objectId).then(
      function success(landmark) { $scope.landmark = landmark; },
      function fail(err) { throw err; }
    );
  };

  var index = function() {
    LandmarkService.getLandmarks().then(
      function success(landmarks) {
        // Set lat long coords for center of map
        var latLng = new google.maps.LatLng(36.271895, -115.009732);
        var mapOptions = {
          center: latLng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.SATELLITE
        };
        // Create new map based on set lat long coords
        $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

        var marker = new google.maps.Marker({
          position: {lat: 36.271895, lng: -115.009732},
          map: $scope.map,
          icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
        });

        $scope.landmarks = landmarks;
        for (var i = 0; i < landmarks.length; i++) {
          // Get landmark lat long coords from Parse and place marker on map
          LandmarkService.getLandmark(landmarks[i].id).then(
            function success(lm) {
              var infowindow = new google.maps.InfoWindow({
                content: lm.get('name') + " (" + lm.get('category') + ")"
              });
              var marker = new google.maps.Marker({
                position: {lat: lm.get('latitude'), lng: lm.get('longitude')},
                map: $scope.map,
                icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                title: lm.get('name')
              });
              marker.addListener('click', function() {
                infowindow.open($scope.map, marker);
              });
            },
            function fail(err) { throw err; }
          );
        };
      },
      function fail(err) { throw err; }
    );
  };

  index();
  show();
};

module.exports = angular.module('map', [])
.controller('MapController', [
  '$scope',
  '$state',
  '$stateParams',
  'LandmarkService',
  MapController]);
