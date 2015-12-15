function FestivalService($q) {
  this.saveFestival = function(festival) {
    // return $http.post('/festivals', festival);s
  };

  this.searchFestivals = function(query) {
    // return $http.get('/festivals/search/' + query);
  };

  this.getFestivals = function() {
    var festivalQuery = new Parse.Query(Parse.Object.extend('Festival'));
    var deferred = $q.defer();

    festivalQuery.find({
      success: function(festivals) { deferred.resolve(festivals); },
      error: function(err) { deferred.reject(err); },
    });

    return deferred.promise;
  };

  this.getFestival = function(id) {
    var festivalQuery = new Parse.Query(Parse.Object.extend('Festival'));
    var deferred = $q.defer();

    festivalQuery.get(id, {
      success: function(festival) { deferred.resolve(festival); },
      error: function(err) { deferred.reject(err); },
    });

    return deferred.promise;
  };
}

function LandmarkService($q) {
  this.saveLandmark = function(landmark) {
  };

  this.searchLandmarks = function(query) {
  };

  this.getLandmarks = function() {
    var landmarkQuery = new Parse.Query(Parse.Object.extend('Landmark'));
    var deferred = $q.defer();

    landmarkQuery.find({
      success: function(landmarks) { deferred.resolve(landmarks); },
      error: function(err) { deferred.reject(err); },
    });

    return deferred.promise;
  };

  this.getLandmark = function(id) {
    var landmarkQuery = new Parse.Query(Parse.Object.extend('Landmark'));
    var deferred = $q.defer();

    landmarkQuery.get(id, {
      success: function(landmark) { deferred.resolve(landmark); },
      error: function(err) { deferred.reject(err); },
    });

    return deferred.promise;
  };
}

module.exports = angular.module('parseServices', [])
.service('FestivalService', ['$q', FestivalService]);

module.exports = angular.module('parseServices', [])
.service('LandmarkService', ['$q', LandmarkService]);
