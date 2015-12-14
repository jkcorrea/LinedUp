require('../bower_components/ionic/js/ionic.bundle');
require('../bower_components/angular-visjs/angular-vis');
require('../bower_components/ion-alpha-scroll/src/ion-alpha-scroll');

window.Parse = require('../bower_components/parse/parse');
window.vis = require('../bower_components/vis/dist/vis');

require('./modules');
require('./services');

module.exports = angular.module('LinedUp', [
  'ionic',
  // 'ngCordova',
  'ui.router',

  'ngVis',
  'ion-alpha-scroll',

  'festivals',
  'parseServices',
])
.constant('Config', require('./constants/config-const'))
.config(require('./router'))
.run(require('./app-main'));
