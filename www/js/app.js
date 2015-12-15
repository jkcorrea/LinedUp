require('ionic/js/ionic.bundle');

require('./modules/festivals');
require('./modules/map');
require('./modules/landmarks');
require('./modules/debug');
require('./services');

module.exports = angular.module('LinedUp', [
  'ionic',
  // 'ngCordova',
  'ui.router',
  'festivals',
  'map',
  'landmarks',
  'debug',
  'parseServices',
  // TODO: load other modules selected during generation
])
.constant('Config', require('./constants/config-const'))
.config(require('./router'))
.run(require('./app-main'));
