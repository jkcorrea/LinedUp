var modulesDir = './js/modules/';
var getTemplateUrl = function (template, module) {
  return modulesDir + (module || template) + '/' + template + '.html';
};

function AppRouter ($stateProvider, $urlRouterProvider) {
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
      })
      .state('main.map', {
        url: '/map',
        views: {
          'pageContent': {
            templateUrl: getTemplateUrl('map'),
            controller: 'MapController as map'
          }
        }
      })
      .state('main.landmarks', {
        url: '/landmarks',
        views: {
          'pageContent': {
            templateUrl: getTemplateUrl('landmarks'),
            controller: 'LandmarksController as landmarks'
          }
        }
      })
      .state('main.debug', {
        url: '/debug',
        views: {
          'pageContent': {
            templateUrl: getTemplateUrl('debug'),
            controller: 'DebugController as debug'
          }
        }
      });

}

module.exports = ['$stateProvider', '$urlRouterProvider', AppRouter];
