require('../bower_components/ionic/js/ionic.bundle');
require('../bower_components/ion-alpha-scroll/src/ion-alpha-scroll');
require('../bower_components/ionic-filter-bar/dist/ionic.filter.bar');
// require('../bower_components/ngCordova/dist/ng-cordova');

window.Parse = require('../bower_components/parse/parse');
window.vis = require('../bower_components/vis/dist/vis');


require('./modules');
require('./services');

module.exports = angular.module('LinedUp', [
  'ionic',
  // 'ngCordova',
  'ui.router',

  'ion-alpha-scroll',
  'jett.ionic.filter.bar',

  'LinedUp.controllers.Festivals',
  'LinedUp.controllers.Landmarks',
  'LinedUp.controllers.Sessions',
  'LinedUp.services.Parse',
])
.constant('Config', require('./constants/config-const'))
.config(require('./app-router'))
.run(require('./app-main'));

require('./directives');

