'use strict';
function FestivalsCtrl ($scope, $log) {
  $log.log('Hello from your Controller: FestivalsCtrl in module main:. This is your controller:', this);

  $scope.festivals = [];

  new Parse.Query(Parse.Object.extend('Festival')).find({
    success: function (festivalObjects) {
      $scope.festivals = festivalObjects.map(function (f) {
        return { name: f.get('name'), banner: f.get('banner').url() };
      });
      $scope.$apply();
    },
    error: function (err) {
      throw err;
    }
  });
}

module.exports = ['$scope', '$log', FestivalsCtrl];
