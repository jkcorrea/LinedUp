function MapController() {
  console.log('Hello from your Controller: MapController in module main:. This is your controller:', this);
};

module.exports = angular.module('map', [])
.controller('MapController', [MapController]);
