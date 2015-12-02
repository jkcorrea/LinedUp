function FestivalsController($scope, $state, $stateParams, FestivalService) {
  console.log('Hello from your Controller: FestivalsCtrl in module main:. This is your controller:', this);

  var show = function() {
    FestivalService.getFestival($stateParams.festivalId).then(
      function success(festival) {
        $scope.festivalName = festival.get('name');
      }, function fail(err) {
        console.log(err);
      });
  };

  var index = function() {
    $scope.festivals = [];
    FestivalService.getFestivals().then(
      function success(result) {
        $scope.festivals = result;
      }, function fail(err) {
        console.log('Failed to load all festivals!\n', err);
      });
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
}

module.exports = angular.module('festivals', [])
.controller('FestivalsController', [
  '$scope',
  '$state',
  '$stateParams',
  'FestivalService',
  FestivalsController
]);
