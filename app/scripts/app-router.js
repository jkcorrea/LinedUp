var modulesDir = './js/modules/';
function getTemplateUrl(template, module) {
  return modulesDir + (module || template) + '/' + template + '.html';
}

function forceLogin($state) { if (!Parse.User.current()) $state.go('login'); }

function AppRouter($stateProvider, $urlRouterProvider, $ionicFilterBarConfigProvider) {
  $urlRouterProvider.otherwise('/login');
  $stateProvider

    // Sessions
    .state('login', {
      url: '/login',
      templateUrl: getTemplateUrl('login', 'sessions'),
      controller: 'SessionsController'
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
        views: {
          'pageContent': {
            templateUrl: getTemplateUrl('festival', 'festivals'),
            controller: 'FestivalsController'
          }
        }
      });
}

module.exports = ['$stateProvider', '$urlRouterProvider', '$ionicFilterBarConfigProvider', AppRouter];
