var modulesDir = './js/modules/';
function getTemplateUrl(template, module) {
  return modulesDir + (module || template) + '/' + template + '.html';
}

function forceLogin($state) { if (!Parse.User.current()) $state.go('login'); }

function AppRouter($stateProvider, $urlRouterProvider, $ionicFilterBarConfigProvider) {
  $urlRouterProvider.otherwise('/login');
  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: getTemplateUrl('login'),
      controller: 'LoginController as login'
    })
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
            controller: 'FestivalsController as festivals'
          }
        }
      })
      .state('main.festival', {
        url: '/festival/:festivalId',
        views: {
          'pageContent': {
            templateUrl: getTemplateUrl('festival', 'festivals'),
            controller: 'FestivalsController as festivals'
          }
        }
      });
}

module.exports = ['$stateProvider', '$urlRouterProvider', '$ionicFilterBarConfigProvider', AppRouter];
