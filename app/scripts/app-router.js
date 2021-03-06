var modulesDir = './js/modules/';
function getTemplateUrl(template, module) {
  return modulesDir + (module || template) + '/' + template + '.html';
}

function isLoggedIn() { return Parse.User.current(); }
function forceLogin($state) { if (!isLoggedIn()) $state.go('login'); }
function bypassLogin($state) { if (isLoggedIn()) $state.go('main.festivals'); }

function AppRouter($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/main/festivals');

  $stateProvider
    // Sessions
    .state('login', {
      url: '/login',
      templateUrl: getTemplateUrl('login', 'sessions'),
      controller: 'SessionsController',
      onEnter: ['$state', bypassLogin]
    })
    .state('logout', {
      url: '/logout',
      onEnter: function() { Parse.User.logOut(); },
      controller: function($state) { $state.go('login'); }
    })

    // Main views
    .state('main', {
      url: '/main',
      abstract: true,
      templateUrl: getTemplateUrl('menu'),
      onEnter: ['$state', forceLogin]
    })
      .state('main.festivals', {
        url: '/festivals',
        views: {
          'pageContent': {
            templateUrl: getTemplateUrl('festivals'),
            controller: 'FestivalsController'
          }
        }
      })
      .state('main.festival', {
        url: '/festival/:festivalId',
        abstract: true,
        views: {
          'pageContent': {
            templateUrl: getTemplateUrl('tabs', 'festivals'),
          }
        }
      })
        .state('main.festival.lineup', {
          url: '/lineup',
          views: {
            'lineupTabContent': {
              templateUrl: getTemplateUrl('lineup', 'festivals'),
              controller: 'FestivalsController'
            }
          }
        })
        .state('main.festival.friends', {
          url: '/friends',
          views: {
            'friendsTabContent': {
              templateUrl: getTemplateUrl('friends', 'festivals'),
              controller: 'FestivalsController'
            }
          }
        })
        .state('main.festival.landmarks', {
          url: '/landmarks',
          views: {
            'landmarksTabContent': {
              templateUrl: getTemplateUrl('landmarks', 'festivals'),
              controller: 'LandmarksController'
            }
          }
        })
        .state('main.festival.map', {
          url: '/map',
          views: {
            'landmarksTabContent': {
              templateUrl: getTemplateUrl('map', 'festivals'),
              controller: 'LandmarksController'
            }
          }
        });
}

module.exports = ['$stateProvider', '$urlRouterProvider', AppRouter];
