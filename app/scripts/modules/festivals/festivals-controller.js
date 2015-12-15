function FestivalsController($scope, $state, $stateParams, FestivalService, PerformanceService, $ionicFilterBar) {
  console.log('Hello from your Controller: FestivalsCtrl in module main:. This is your controller:', this);
  var fail = function(msg) { throw "Could not retrieve festival(s): ", msg; };

  var show = function(festival) {
    // Configure the Filter/Search Bar
      var filterBarInstance;
      $scope.showFilterBar = function() {
        filterBarInstance = $ionicFilterBar.show({
          items: $scope.performances,
          update: function(filteredItems, filterText) { $scope.performances = filteredItems; }
        });
      };

    // Set up the timeline
      var timelineContainer = document.getElementById('festival-timeline');
      var ZOOM_MIN = 4 * 3600000;
      var MAX_ZOOM_SHOW_MINOR = 89161006;
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
        timeAxis: { scale: 'hour', step: 3 },
        format: {
          minorLabels: { hour: 'ha' },
          majorLabels: { day: 'ddd' }
        },
        showMinorLabels: false,
        zoomMin: ZOOM_MIN, // 4 hours converted to ms
      };

      var timeline = new vis.Timeline(timelineContainer, timelineData, timelineOpts);
      timeline.on('rangechange', function(e) {
        var zoomLevel = e.end - e.start;
        console.log(zoomLevel);
        if (zoomLevel <= MAX_ZOOM_SHOW_MINOR) {
          timeline.setOptions({ showMinorLabels: true });
        } else if (zoomLevel > MAX_ZOOM_SHOW_MINOR) {
          timeline.setOptions({ showMinorLabels: false });
        }
      });

    // Other view data
      $scope.festival = festival;
      $scope.performances = PerformanceService.getPerformancesForFestival(0);
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
  '$ionicFilterBar',
  FestivalsController
]);

    // var performance = Parse.Object.extend("Performance");
    // var festival = Parse.Object.extend("Festival");
    // var relation = festival.relation("performances");
    // relation.add(performance);
