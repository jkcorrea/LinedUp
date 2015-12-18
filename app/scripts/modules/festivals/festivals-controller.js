function FestivalsController(
          $scope,
          $state,
          $stateParams,
          FestivalService,
          PerformanceService,
          UserService,
          $ionicFilterBar)
{
  Parse.User.current().fetch();
  var user = Parse.User.current();

  var fail = function(model,err){console.log("Could not retrieve "+(model||'festival')+"(s): ",err)};

  var show = function(festival) {
    function cmpListItems(A,B){var a=A.name.toLowerCase(),b=B.name.toLowerCase();return a>b?1:(a<b?-1:0);}
    $scope.activeTab = $state.current.url.slice(1);
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
      var timelineContainer = document.getElementById($scope.activeTab + '-timeline');
      var ZOOM_MIN = 4 * 3600000; // 4 hrs in ms
      var ZOOM_MAX = 2 * 86400000; // 1 day in ms
      var MAX_ZOOM_SHOW_MINOR = 89161006;

      var start = new Date(festival.get('start'))
        , end = new Date(festival.get('end'));
      timelineOpts = {
        start: start,
        min: start.setHours(start.getHours() - 15),
        max: end.setHours(start.getHours() + 20),
        timeAxis: { scale: 'hour', step: 3 },
        format: { minorLabels: { hour: 'ha' } },
        showMinorLabels: false,
        zoomMin: ZOOM_MIN,
        zoomMax: ZOOM_MAX,
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
          lineupChange(timeline.itemsData.get(e.item), 'lineup');
        });

        if (e.group && e.group !== user.id) $scope.$apply(function() {
          toggleFriend(timeline.groupsData.get(e.group));
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

    // View data
      // Generates a list/timeline item obj from a Parse Performance
      // Accepts either (opts, performance) or (performance)
      function generatePerfItem(opts, p_) {
        var p = p_;
        if (arguments.length < 2) p = opts;

        return {
          id: p.id.concat(opts.id || ''),
          avatar: p.get('artist').get('avatar'),
          name: p.get('artist').get('name'),
          performance: p,
          start: p.get('start'),
          end: p.get('end'),
          className: 'magenta',
          type: 'box',
          group: opts.group || p.get('stage')
        };
      }

      function lineupTabData() {
        // Get festival lineup, populate list or timeline
        function cmpPerformances(userPerf) { return userPerf.id === this.id; }
        PerformanceService.getPerformancesForFestival(festival)
        .then(function(performances) {
        UserService.getLineupForFestival(user, festival)
        .then(function(userLineup) {
          var tmp_lineup = []
            , tmp_timeline = [];

          // Go through each performance, adding to timeline or
          // festival lineup depending on what the current user has in Parse
          for (var ix = 0; ix < performances.length; ix++) {
            var p = performances[ix];
            var item = generatePerfItem(p);
            // Push into festival or user's lineup
            if (userLineup.some(cmpPerformances, p)) tmp_timeline.push(item);
            else tmp_lineup.push(item);
          }

          $scope.listItems = tmp_lineup.sort(cmpListItems);
          $scope.timelineItems = tmp_timeline;
          timeline.setItems(tmp_timeline);
        }, fail.bind(null, 'user_performance'));
        }, fail.bind(null, 'performance'));

        timeline.setGroups(festival.get('stages').map(function(stage, ix) {
          return { id: ix+1, content: stage };
        }));
      }


      var friendsLineups = new vis.DataSet()
        , friendsGroups = new vis.DataSet();
      function friendsTabData() {
        timeline.setGroups(friendsGroups);
        timeline.setItems(friendsLineups);

        // Get user's lineup, set to first group
        UserService.getLineupForFestival(user, festival)
        .then(function(userLineup) {
          var tmp_timeline = userLineup
            .map(generatePerfItem.bind(null, { group: user.id }));
          $scope.timelineItems = tmp_timeline;
          friendsLineups.update(tmp_timeline);
        }, fail.bind(null, 'user_performance'));

        friendsGroups.update([{
          id: user.id,
          content: user.get('firstName') || 'Me'
        }]);

        // Set up item list for friends instead of artists
        $scope.listItems = []; // show loading animation...
        UserService.getFriends(user)
        .then(function(friends) {
          $scope.listItems = friends.map(function(f) {
            return {
              name: f.get('firstName')+' '+f.get('lastName'),
              avatar: f.get('picture'),
              user: f
            };
          }).sort(cmpListItems);
        }, fail.bind(null, 'friends'));
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
          UserService.addPerformance(user, item.performance);
        } else {
          ix = $scope.timelineItems.reduce(find, 0);
          tmp_item = $scope.timelineItems[ix];
          tmp_timeline = $scope.timelineItems.slice(0);
          tmp_timeline.splice(ix, 1);
          tmp_lineup = $scope.listItems.concat(tmp_item).sort(cmpListItems);

          // Remove this performance from user's lineup
          UserService.removePerformance(user, item.performance);
        }

        $scope.listItems = tmp_lineup;
        $scope.timelineItems = tmp_timeline;
        timeline.setItems(tmp_timeline);
      }

      $scope.toggleFriend = toggleFriend;
      function toggleFriend(item) {
        if (item.user && friendsGroups.get(item.user.id)) {
          // Remove items from timeline
          friendsLineups.remove(friendsLineups.getIds({
            filter: function(it) { return it.group === item.user.id; }
          }));

          // Remove the user group
          friendsGroups.remove(item.user.id);
        } else {
          // Get friend's lineup and add to timeline
          UserService.getLineupForFestival(item.user, festival)
          .then(function(friendLineup) {
            var tmp_timeline = friendLineup
              .map(generatePerfItem.bind(null, {
                group: item.user.id,
                id: item.user.id // Avoid collisions with other users
              })).concat($scope.timelineItems);
            $scope.timelineItems = tmp_timeline;
            friendsLineups.update(tmp_timeline);
          }, fail.bind(null, 'friend_performance'));

          // Add a row for friend
          friendsGroups.update({
            id: item.user.id,
            content: item.user.get('firstName'),
            user: item.user
          });
        }
      };

      $scope.isChecked = function(item) {
        return friendsGroups.get(item.user.id) ? 'checked' : '';
      };



      switch ($scope.activeTab) {
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

  var index = function(festivals) { $scope.festivals = festivals; };

  // Run the corresponding controller#action
  switch ($state.current.name) {
    case 'main.festival.lineup':
    case 'main.festival.friends':
    case 'main.festival.landmarks':
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

