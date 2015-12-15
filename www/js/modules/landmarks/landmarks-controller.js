function LandmarksController() {
  console.log('Hello from your Controller: LandmarksController in module main:. This is your controller:', this);
};

module.exports = angular.module('landmarks', [])
.controller('LandmarksController', [LandmarksController]);
