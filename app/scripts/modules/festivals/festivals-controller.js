function FestivalsController($scope, $state, $stateParams, FestivalService, PerformanceService, $ionicFilterBar) {
  var fail = function(model, err) { throw "Could not retrieve "+(model||'festival')+"(s): ", err; };

  var show = function(festival) {
    $scope.timelineItems = []
    $scope.lineupItems = [];

    // Configure the Filter/Search Bar
      var filterBarInstance;
      $scope.showFilterBar = function() {
        filterBarInstance = $ionicFilterBar.show({
          items: $scope.lineupItems,
          update: function(filteredItems, filterText) {
            $scope.lineupItems = filteredItems;
          }
        });
      };

    // Set up the timeline
      var timelineContainer = document.getElementById('festival-timeline');
      var ZOOM_MIN = 4 * 3600000;
      var MAX_ZOOM_SHOW_MINOR = 89161006;
      var timelineGroups = festival
        .get('stages')
        .map(function(stage, index){return {id: index, content: stage}});

      var start = new Date(festival.get('start'))
        , end = new Date(festival.get('end'));
      timelineOpts = {
        min: start.setHours(start.getHours() - 6),
        max: end.setHours(start.getHours() + 6),
        timeAxis: { scale: 'hour', step: 3 },
        format: { minorLabels: { hour: 'ha' } },
        showMinorLabels: false,
        zoomMin: ZOOM_MIN, // 4 hours converted to ms
      };

      var timeline = new vis.Timeline(timelineContainer, [], timelineGroups, timelineOpts);
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
        var tmp_lineup =  performances.map(function(p) {
          return {
            // Lineup list data
            name: p.get('artist').get('name'),
            avatar: p.get('artist').get('avatar'),
            performance: p,

            // Vis Timeline data
            id: p.id,
            content: p.get('artist').get('name'),
            start: p.get('start'),
            end: p.get('end'),
            className: 'magenta',
            type: 'box',
            group: p.get('stage')
          };
        });
        $scope.lineupItems = tmp_lineup;
      }, fail.bind(null, 'performance'));

    // User actions
      $scope.lineupChange = function(item, dest) {
        var tmp_lineup, tmp_timeline, tmp_item, ix;
        if (!dest || dest === 'timeline') {
          ix = $scope.lineupItems.indexOf(item);
          tmp_item = $scope.lineupItems[ix];
          tmp_lineup = $scope.lineupItems.slice(0);
          tmp_lineup.splice(ix, 1);
          tmp_timeline = $scope.timelineItems.concat(tmp_item);
        } else {
          ix = $scope.timelineItems.indexOf(item);
          tmp_item = $scope.timelineItems[ix];
          tmp_timeline = $scope.timelineItems.slice(0);
          tmp_timeline.splice(ix, 1);
          tmp_lineup = $scope.lineupItems.concat(tmp_item);
        }

        $scope.lineupItems = tmp_lineup;
        $scope.timelineItems = tmp_timeline;
        timeline.setItems(tmp_timeline);
      }
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
