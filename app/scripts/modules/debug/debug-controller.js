function DebugController($log, $scope, Config) {
  $log.log('Hello from your Controller: DebugController in module main:. This is your controller:', this);

  // bind data from services
  $scope.ENV = Config.ENV;
  $scope.BUILD = Config.BUILD;

  // PASSWORD EXAMPLE
  $scope.password = {
    input: '', // by user
    strength: ''
  };
  $scope.grade = function () {
    var size = $scope.password.input.length;
    if (size > 8) {
      $scope.password.strength = 'strong';
    } else if (size > 3) {
      $scope.password.strength = 'medium';
    } else {
      $scope.password.strength = 'weak';
    }
  };
  $scope.grade();

};

module.exports = angular.module('debug', [])
.controller('DebugController', ['$log', '$scope', 'Config', DebugController]);
