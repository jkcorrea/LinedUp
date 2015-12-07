require('../bower_components/ionic/js/ionic.bundle');
window.Parse = require('../bower_components/parse/parse');
window.vis = require('../bower_components/vis/dist/vis');
require('../bower_components/angular-visjs/angular-vis');

require('./modules/festivals');
require('./modules/debug');
require('./services');

module.exports = angular.module('LinedUp', [
  'ionic',
  // 'ngCordova',
  'ui.router',
  'festivals',
  'debug',
  'parseServices',
  'ngVis',
])
.constant('Config', require('./constants/config-const'))
.config(require('./router'))
.run(require('./app-main'));
