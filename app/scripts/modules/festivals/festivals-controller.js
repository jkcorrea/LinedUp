function FestivalsController($scope, $state, $stateParams, FestivalService, PerformanceService, $ionicFilterBar) {
  var fail = function(model,err){console.log("Could not retrieve "+(model||'festival')+"(s): ",err)};

  var show = function(festival) {
    function cmpArtists(A,B){var a=A.name.toLowerCase(),b=B.name.toLowerCase();return a>b?1:(a<b?-1:0);}
    $scope.festival = festival;
    $scope.timelineItems = [];
    $scope.lineupItems = [];
    $scope.searching = false;

    // Search bar config
      var filterBarInstance;
      $scope.showFilterBar = function() {
        filterBarInstance = $ionicFilterBar.show({
          items: $scope.lineupItems,
          update: function(items){$scope.lineupItems=items;},
          done: function() {$scope.$apply(function(){$scope.searching=true})},
          cancel: function() {$scope.$apply(function(){$scope.searching=false})}
        });
      };

    // Timeline config
      var timelineContainer = document.getElementById('festival-timeline');
      var ZOOM_MIN = 4 * 3600000;
      var MAX_ZOOM_SHOW_MINOR = 89161006;
      var timelineGroups = festival
        .get('stages')
        .map(function(stage,ix){return{id:ix+1,content:stage}});

      var start = new Date(festival.get('start'))
        , end = new Date(festival.get('end'));
      timelineOpts = {
        min: start.setHours(start.getHours() - 6),
        max: end.setHours(start.getHours() + 6),
        timeAxis: { scale: 'hour', step: 3 },
        format: { minorLabels: { hour: 'ha' } },
        showMinorLabels: false,
        zoomMin: ZOOM_MIN, // 4 hours converted to ms
        editable: { remove: true },
        template: formatContent,
        onRemove: removeFromTimeline,
      };


      var timeline = new vis.Timeline(timelineContainer, [], timelineGroups, timelineOpts);

      // Show minor labels when zoomed in enough
      timeline.on('rangechange', function(e) {
        var zoomLevel = e.end - e.start;
        if (zoomLevel <= MAX_ZOOM_SHOW_MINOR) {
          timeline.setOptions({ showMinorLabels: true });
        } else if (zoomLevel > MAX_ZOOM_SHOW_MINOR) {
          timeline.setOptions({ showMinorLabels: false });
        }
      });

      function formatContent(item) {
        return (
            '<div class="artist-avatar" style="background-image: url(\''+item.avatar+'\'); background-size: cover;">'
          + '</div>'
          + '<div>' + item.name + '</div>'
        );
      }

      // Deleting from timeline -> send back to lineup
      function removeFromTimeline(item, cb) {
        $scope.$apply(function(){$scope.lineupChange(item, 'lineup');});
        cb(item);
      }

    // View data
      PerformanceService.getPerformancesForFestival(festival)
      .then(function(performances) {
        var tmp_lineup =  performances.map(function(p) {
          return {
            // Lineup list data
            avatar: p.get('artist').get('avatar'),
            name: p.get('artist').get('name'),
            performance: p,

            // Vis Timeline data
            id: p.id,
            start: p.get('start'),
            end: p.get('end'),
            className: 'magenta',
            type: 'box',
            group: p.get('stage')
          };
        }).sort(cmpArtists);
        $scope.lineupItems = tmp_lineup;
      }, fail.bind(null, 'performance'));

    // View actions
      $scope.lineupChange = function(item, dest) {
        function find(a, b, ix) { return (b.id === item.id) ? ix : a; }
        var tmp_lineup, tmp_timeline, tmp_item, ix;
        if (!dest || dest === 'timeline') {
          ix = $scope.lineupItems.indexOf(item);
          tmp_item = $scope.lineupItems[ix];
          tmp_lineup = $scope.lineupItems.slice(0);
          tmp_lineup.splice(ix, 1);
          tmp_timeline = $scope.timelineItems.concat(tmp_item);
        } else {
          ix = $scope.timelineItems.reduce(find, 0);
          tmp_item = $scope.timelineItems[ix];
          tmp_timeline = $scope.timelineItems.slice(0);
          tmp_timeline.splice(ix, 1);
          tmp_lineup = $scope.lineupItems.concat(tmp_item).sort(cmpArtists);
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

module.exports = angular.module('LinedUp.controllers.Festivals', [])
.controller('FestivalsController', [
  '$scope',
  '$state',
  '$stateParams',
  'FestivalService',
  'PerformanceService',
  '$ionicFilterBar',
  FestivalsController
]);

