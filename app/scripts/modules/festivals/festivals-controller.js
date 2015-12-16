function FestivalsController($scope, $state, $stateParams, FestivalService, PerformanceService, $ionicFilterBar) {
  var fail = function(model, err) { throw "Could not retrieve "+(model||'festival')+"(s): ", err; };

  var show = function(festival) {
    var inTimeline = {}
      , inLineup = {};

    // Configure the Filter/Search Bar
      var filterBarInstance;
      $scope.showFilterBar = function() {
        filterBarInstance = $ionicFilterBar.show({
          items: $scope.artists,
          update: function(filteredItems, filterText) { $scope.artists = filteredItems; }
        });
      };

    // Set up the timeline
      var timelineContainer = document.getElementById('festival-timeline');
      var ZOOM_MIN = 4 * 3600000;
      var MAX_ZOOM_SHOW_MINOR = 89161006;
      var timelineData = new vis.DataSet();
      var timelineGroups = festival
        .get('stages')
        .map(function(stage, index){return {id: index, content: stage}});

      timelineOpts = {
        min: festival.get("start") || "",
        max: festival.get("end") || "",
        timeAxis: { scale: 'hour', step: 3 },
        format: {
          minorLabels: { hour: 'ha' },
          majorLabels: { day: 'ddd', month: 'ddd', year: 'ddd' }
        },
        showMinorLabels: false,
        zoomMin: ZOOM_MIN, // 4 hours converted to ms
      };

      var timeline = new vis.Timeline(timelineContainer, timelineData, timelineGroups, timelineOpts);
      timeline.on('rangechange', function(e) {
        var zoomLevel = e.end - e.start;
        if (zoomLevel <= MAX_ZOOM_SHOW_MINOR) {
          timeline.setOptions({ showMinorLabels: true });
        } else if (zoomLevel > MAX_ZOOM_SHOW_MINOR) {
          timeline.setOptions({ showMinorLabels: false });
        }
      });

    // Other view data
      $scope.festival = festival;
      PerformanceService.getPerformancesForFestival(festival)
        .then(function(performances) {
          //performances;
          $scope.lineup = performances.map(function(p) {
            inLineup[p.id] = {
              name: p.get('artist').get('name'),
              avatar: p.get('artist').get('avatar'),
              performance: p
            };
            return inLineup[p.id];
          });
        }, fail.bind(null, 'performance'));

    // User actions
      $scope.addToTimeline = function(item) {
        var p = item.performance;
        inTimeline[p.id] = item;
        delete inLineup[p.id];

        timelineData.add({
          id: p.id,
          content: '<i class=\"fi-flag\"></i> ' + p.get('artist').get('name'),
          start: p.get('start'),
          end: p.get('end'),
          className: 'magenta',
          type: 'box',
          group: p.get('stage')
        });
      };
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
