function FestivalsController($scope, $state, $stateParams, FestivalService, visDataSet) {
  console.log('Hello from your Controller: FestivalsCtrl in module main:. This is your controller:', this);

  var show = function() {
    $scope.timelineOpts = {};
    var dataSet = new visDataSet();
    dataSet.add({
      "1": {
        "id": 1,
        "content": "<i class=\"fi-flag\"></i> item 1",
        "start": "2014-09-01T17:59:13.706Z",
        "className": "magenta",
        "type": "box"
      }
    });

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

  var x = vis;
}

module.exports = angular.module('festivals', [])
.controller('FestivalsController', [
  '$scope',
  '$state',
  '$stateParams',
  'FestivalService',
  'ngVis',
  FestivalsController
]);
