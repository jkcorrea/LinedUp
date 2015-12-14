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

function PerformanceService($q) {
  this.getPerformancesForFestival = function(id) {
    return [
      {  id: 0, name: "A Band 0" },
      {  id: 1, name: "B Band 1" },
      {  id: 2, name: "C Band 2" },
      {  id: 3, name: "C Band 3" },
      {  id: 4, name: "C Band 4" },
      {  id: 5, name: "D Band 5" },
      {  id: 6, name: "E Band 6" },
      {  id: 7, name: "O Band 7" },
      {  id: 8, name: "P Band 8" },
      {  id: 9, name: "W Band 9" }
    ];
  };
}

module.exports = angular.module('parseServices', [])
.service('FestivalService', ['$q', FestivalService])
.service('PerformanceService', ['$q', PerformanceService]);
