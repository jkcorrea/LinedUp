module.exports = angular.module('LinedUp')
.directive('bgImg', function() {
  return function(scope, element, attrs){
    attrs.$observe('bgImg', function(value) {
      element.css({
        'background-image': 'url(' + value +')',
        'background-size' : 'cover'
      });
    });
  };
});
