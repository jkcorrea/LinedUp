function FestivalsController($scope, $state, $stateParams, FestivalService, PerformanceService) {
  console.log('Hello from your Controller: FestivalsCtrl in module main:. This is your controller:', this);
  var fail = function(msg) { throw "Could not retrieve festival(s): ", msg; };

  var show = function(festival) {
    var container = document.getElementById('festival-timeline');
    // var performance = Parse.Object.extend("Performance");
    // var festival = Parse.Object.extend("Festival");
    // var relation = festival.relation("performances");
    // relation.add(performance);

    $scope.festival = festival;
    $scope.performances = PerformanceService.getPerformancesForFestival(0);

    // var dataSet = new VisDataSet();
    // dataSet.add({
    //   "1": {
    //     "id": 1,
    //     "content": "<i class=\"fi-flag\"></i> item 1",
    //     "start": (new Date()).toISOString(),
    //     "className": "magenta",
    //     "type": "box"
    //   }
    // });

    timelineData = {};
    timelineOpts = {
      min: festival.get("start") || "",
      max: festival.get("end") || "",
      height: 250
    };

    var timeline = new vis.Timeline(container, timelineData, timelineOpts);
  };

  var index = function(festivals) { $scope.festivals = festivals; };

  // Run the corresponding controller#action
  switch ($state.current.name) {
    case 'main.festival':
      FestivalService.getFestival($stateParams.festivalId)
        .then(show, fail);
      break;
    case 'main.festivals':
    default:
      FestivalService.getFestivals()
        .then(index, fail);
  }
}

module.exports = angular.module('festivals', [])
.controller('FestivalsController', [
  '$scope',
  '$state',
  '$stateParams',
  'FestivalService',
  'PerformanceService',
  FestivalsController
]);
