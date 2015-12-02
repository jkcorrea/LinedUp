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
      success: function(results) {
        deferred.resolve(results.map(function(f) {
          return {
            id: f.id,
            name: f.get('name'),
            banner: f.get('banner').url(),
          };
        }));
      },
      error: function(err) {
        deferred.reject(err);
      },
    });

    return deferred.promise;
  };

  this.getFestival = function(id) {
    var festivalQuery = new Parse.Query(Parse.Object.extend('Festival'));
    var deferred = $q.defer();

    festivalQuery.get(id, {
      success: function(result) {
        deferred.resolve(result);
      },
      error: function(err) {
        deferred.reject(err);
      },
    });

    return deferred.promise;
  };
}

module.exports = angular.module('parseServices', [])
.service('FestivalService', ['$q', FestivalService]);
