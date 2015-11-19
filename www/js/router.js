'use strict';

var modulesDir = '/js/modules/';
var getTemplateUrl = function (template) {
  return modulesDir + template + '/' + template + '.html';
};

function AppRouter ($stateProvider, $urlRouterProvider) {
  // ROUTING with ui.router
  $urlRouterProvider.otherwise('/main/festivals');
  $stateProvider
    // this state is placed in the <ion-nav-view> in the index.html
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
            controller: 'FestivalsCtrl'
          }
        }
      })
      .state('main.debug', {
        url: '/main/debug',
        views: {
          'pageContent': {
            templateUrl: getTemplateUrl('debug'),
            controller: 'DebugCtrl'
          }
        }
      });
}

module.exports = ['$stateProvider', '$urlRouterProvider', AppRouter];
