function LandmarksController($scope, $state, $stateParams, LandmarkService) {
  console.log('Hello from your Controller: LandmarksController in module main:. This is your controller:', this);

  var show = function() {
    LandmarkService.getLandmark($stateParams.objectId).then(
      function success(landmark) { $scope.landmark = landmark; },
      function fail(err) { throw err; }
    );
  };

  var index = function() {
    LandmarkService.getLandmarks().then(
      function success(landmarks) { $scope.landmarks = landmarks; },
      function fail(err) { throw err; }
    );
  };

  index();
  show();
};

module.exports = angular.module('landmarks', [])
.controller('LandmarksController', [
  '$scope',
  '$state',
  '$stateParams',
  'LandmarkService',
  LandmarksController
]);
