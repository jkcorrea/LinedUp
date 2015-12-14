var modulesDir = './js/modules/';
var getTemplateUrl = function (template, module) { return modulesDir + (module || template) + '/' + template + '.html' };

function AppRouter ($stateProvider, $urlRouterProvider, $ionicFilterBarConfigProvider) {
  $urlRouterProvider.otherwise('/main/festivals');
  $stateProvider
    .state('main', {
      url: '/main',
      abstract: true,
      templateUrl: getTemplateUrl('menu'),
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
