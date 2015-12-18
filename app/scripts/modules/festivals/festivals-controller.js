function FestivalsController(
          $scope,
          $state,
          $stateParams,
          FestivalService,
          PerformanceService,
          UserService,
          $ionicFilterBar)
{
  var user = Parse.User.current();

  var fail = function(model,err){console.log("Could not retrieve "+(model||'festival')+"(s): ",err)};

  var show = function(festival) {
    function cmpArtists(A,B){var a=A.name.toLowerCase(),b=B.name.toLowerCase();return a>b?1:(a<b?-1:0);}
    var activeTab = 'lineup';
    $scope.festival = festival;
    $scope.timelineItems = [];
    $scope.listItems = [];
    $scope.searching = false;

    // Search bar config
      var filterBarInstance;
      $scope.showFilterBar = function() {
        filterBarInstance = $ionicFilterBar.show({
          items: $scope.listItems,
          update: function(items){$scope.listItems=items},
          done: function() {$scope.$apply(function(){$scope.searching=true})},
          cancel: function() {$scope.$apply(function(){$scope.searching=false})}
        });
      };

    // Timeline config
      var timelineContainer = document.getElementById('festival-timeline');
      var ZOOM_MIN = 4 * 3600000;
      var MAX_ZOOM_SHOW_MINOR = 89161006;

      var start = new Date(festival.get('start'))
        , end = new Date(festival.get('end'));
      timelineOpts = {
        min: start.setHours(start.getHours() - 12),
        max: end.setHours(start.getHours() + 16),
        timeAxis: { scale: 'hour', step: 3 },
        format: { minorLabels: { hour: 'ha' } },
        showMinorLabels: false,
        zoomMin: ZOOM_MIN, // 4 hours converted to ms
        template: formatContent,
        onRemove: removeFromTimeline,
      };


      var timeline = new vis.Timeline(timelineContainer, [], [], timelineOpts);

      // Show minor labels when zoomed in enough
      timeline.on('rangechange', function(e) {
        var zoomLevel = e.end - e.start;
        if (zoomLevel <= MAX_ZOOM_SHOW_MINOR) {
          timeline.setOptions({ showMinorLabels: true });
        } else if (zoomLevel > MAX_ZOOM_SHOW_MINOR) {
          timeline.setOptions({ showMinorLabels: false });
        }
      });

      timeline.on('doubleClick', function(e) {
        if (e.item) $scope.$apply(function() {
          lineupChange(timeline.itemSet.getItems().get(e.item), 'lineup');
        });
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
        $scope.$apply(function(){ lineupChange(item, 'lineup'); });
        cb(item);
      }

    // My Lineup data
      function lineupTabData() {
        // Get festival lineup, populate list or timeline
        function cmpPerformances(userPerf) { return userPerf.id === this.id; }
        PerformanceService.getPerformancesForFestival(festival)
        .then(function(performances) {
        UserService.getLineupForFestival(festival)
        .then(function(userLineup) {
          var tmp_lineup = []
            , tmp_timeline = [];

          // Go through each performance, adding to timeline or
          // festival lineup depending on what the current user has in Parse
          for (var ix = 0; ix < performances.length; ix++) {
            var p = performances[ix];
            var perfItem = {
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

            // Push into festival or user's lineup
            if (userLineup.some(cmpPerformances, p)) tmp_timeline.push(perfItem);
            else tmp_lineup.push(perfItem);
          }

          $scope.listItems = tmp_lineup.sort(cmpArtists);
          $scope.timelineItems = tmp_timeline;
          timeline.setItems(tmp_timeline);
        }, fail.bind(null, 'user_performance'));
        }, fail.bind(null, 'performance'));

        timeline.setGroups(festival.get('stages').map(function(stage, ix) {
          return { id: ix+1, content: stage };
        }));
      }
      lineupTabData(); // Initial view. Invoke immediately

      function friendsTabData() {
        // Get user's lineup, set to first group
        UserService.getLineupForFestival(festival)
        .then(function(userLineup) {
          var tmp_timeline = userLineup.map(function(p) {
            return {
              // Vis Timeline data
              id: p.id,
              start: p.get('start'),
              end: p.get('end'),
              className: 'magenta',
              type: 'box',
              group: 0 // Current user is always group 0
            };
          });
        }, fail.bind(null, 'user_performance'));

        timeline.setGroups([{ id: 0, content: user.get('firstName') }]);
      }

    // View actions
      $scope.lineupChange = lineupChange;
      function lineupChange(item, dest) {
        function find(a, b, ix) { return (b.id === item.id) ? ix : a; }
        var tmp_lineup, tmp_timeline, tmp_item, ix;
        if (!dest || dest === 'timeline') {
          ix = $scope.listItems.indexOf(item);
          tmp_item = $scope.listItems[ix];
          tmp_lineup = $scope.listItems.slice(0);
          tmp_lineup.splice(ix, 1);
          tmp_timeline = $scope.timelineItems.concat(tmp_item);

          // Add this performance to the user's lineup
          UserService.addPerformance(item.performance);
        } else {
          ix = $scope.timelineItems.reduce(find, 0);
          tmp_item = $scope.timelineItems[ix];
          tmp_timeline = $scope.timelineItems.slice(0);
          tmp_timeline.splice(ix, 1);
          tmp_lineup = $scope.listItems.concat(tmp_item).sort(cmpArtists);

          // Remove this performance from user's lineup
          UserService.removePerformance(item.performance);
        }

        $scope.listItems = tmp_lineup;
        $scope.timelineItems = tmp_timeline;
        timeline.setItems(tmp_timeline);
      }

      $scope.tabSelect = function(selected) {
        activeTab = selected;
        switch (selected) {
        case 'lineup':
          lineupTabData();
          break;
        case 'friends':
          friendsTabData();
          break;
        case 'landmarks':
          break;
        }
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

module.exports = angular.module('LinedUp.controllers.Festivals', [])
.controller('FestivalsController', [
  '$scope',
  '$state',
  '$stateParams',
  'FestivalService',
  'PerformanceService',
  'UserService',
  '$ionicFilterBar',
  FestivalsController
]);

