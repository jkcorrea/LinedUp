
    // <script src="bower_components/angular/angular.js"></script>
    // <script src="bower_components/angular-animate/angular-animate.js"></script>
    // <script src="bower_components/ionic/js/ionic.bundle.js"></script>
    // <script src="bower_components/parse/parse.js"></script>
    // <script src="bower_components/vis/dist/vis.js"></script>
// require('../bower_components/angular/angular');
// require('../bower_components/angular-animate/angular-animate');
require('../bower_components/ionic/js/ionic.bundle');
window.Parse = require('../bower_components/parse/parse');
window.vis = require('../bower_components/vis/dist/vis');

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
  // TODO: load other modules selected during generation
])
.constant('Config', require('./constants/config-const'))
.config(require('./router'))
.run(require('./app-main'));
