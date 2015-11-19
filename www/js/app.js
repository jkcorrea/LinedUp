'use strict';

require('ionic/js/ionic.bundle');

require('./modules/festivals/festivals');

module.exports = angular.module('LinedUp', [
  'ionic',
  // 'ngCordova',
  'ui.router',
  'festivals',
  // TODO: load other modules selected during generation
])
.constant('Config', require('./constants/config-const'))
.config(require('./router'))
.run(require('./app-main'));

