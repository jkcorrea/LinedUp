function FestivalsController($scope, $state, $stateParams, FestivalService) {
  console.log('Hello from your Controller: FestivalsCtrl in module main:. This is your controller:', this);

  var show = function() {
    FestivalService.getFestival($stateParams.festivalId).then(
      function success(festival) { $scope.festival = festival; },
      function fail(err) { throw err; }
    );
  };

  var index = function() {
    FestivalService.getFestivals().then(
      function success(festivals) { $scope.festivals = festivals; },
      function fail(err) { throw err; }
    );
  };

  // Run the corresponding controller#action
  switch ($state.current.name) {
    case 'main.festival':
      show();
      break;
    case 'main.festivals':
    default:
      index();
      break;
  }
};

module.exports = angular.module('festivals', [])
.controller('FestivalsController', [
  '$scope',
  '$state',
  '$stateParams',
  'FestivalService',
  FestivalsController
]);
