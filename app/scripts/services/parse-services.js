var Artist = Parse.Object.extend('Artist')
  , Festival = Parse.Object.extend('Festival')
  , Performance = Parse.Object.extend('Performance');

function FestivalService($q) {
  this.saveFestival = function(festival) {
    // return $http.post('/festivals', festival);s
  };

  this.searchFestivals = function(query) {
    // return $http.get('/festivals/search/' + query);
  };

  this.getFestivals = function() {
    var festivalQuery = new Parse.Query(Festival);
    var deferred = $q.defer();

    festivalQuery.find({
      success: function(festivals) { deferred.resolve(festivals); },
      error: function(err) { deferred.reject(err); },
    });

    return deferred.promise;
  };

  this.getFestival = function(id) {
    var festivalQuery = new Parse.Query(Festival);
    var deferred = $q.defer();

    festivalQuery.get(id, {
      success: function(festival) { deferred.resolve(festival); },
      error: function(err) { deferred.reject(err); },
    });

    return deferred.promise;
  };
}

function PerformanceService($q) {
  this.getPerformancesForFestival = function(festival) {
    var performanceQuery = new Parse.Query(Performance);
    performanceQuery.equalTo('festival', festival);
    performanceQuery.include('artist');
    var deferred = $q.defer();

    performanceQuery.find({
      success: function(performances) { deferred.resolve(performances); },
      error: function(err) { deferred.reject(err); }
    });

    return deferred.promise;
  };
}

module.exports = angular.module('parseServices', [])
.service('FestivalService', ['$q', FestivalService])
.service('PerformanceService', ['$q', PerformanceService]);
