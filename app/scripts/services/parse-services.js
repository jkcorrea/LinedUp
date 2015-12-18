var Artist = Parse.Object.extend('Artist')
  , Festival = Parse.Object.extend('Festival')
  , Performance = Parse.Object.extend('Performance')

function FestivalService($q) {
  this.saveFestival = function(festival) {};
  this.searchFestivals = function(query) {};

  this.getFestivals = function() {
    var query = new Parse.Query(Festival);
    var deferred = $q.defer();

    query.find({
      success: function(festivals) { deferred.resolve(festivals); },
      error: function(err) { deferred.reject(err); },
    });

    return deferred.promise;
  };

  this.getFestival = function(id) {
    var query = new Parse.Query(Festival);
    var deferred = $q.defer();

    query.get(id, {
      success: function(festival) { deferred.resolve(festival); },
      error: function(err) { deferred.reject(err); },
    });

    return deferred.promise;
  };
}

function PerformanceService($q) {
  this.getPerformancesForFestival = function(festival) {
    var query = new Parse.Query(Performance);
    query.equalTo('festival', festival);
    query.include('artist');
    var deferred = $q.defer();

    query.find({
      success: function(performances) { deferred.resolve(performances); },
      error: function(err) { deferred.reject(err); }
    });

    return deferred.promise;
  };
}

function UserService($q) {
  this.getFriends = function(user) {
    var query = new Parse.Query(Parse.User);
    query.notEqualTo('objectId', user.id);
    var deferred = $q.defer();

    query.find({
      success: function(users) { deferred.resolve(users); },
      error: function(err) { deferred.reject(err); }
    });

    return deferred.promise;
  };

  this.addPerformance = function(user, performance) {
    var rel = user.relation('performances');
    rel.add(performance);
    user.save();
  };

  this.removePerformance = function(user, performance) {
    var rel = user.relation('performances');
    rel.remove(performance);
    user.save();
  };

  this.getLineupForFestival = function(user, festival) {
    var deferred = $q.defer();
    // First get all of the user's performances
    user.relation('performances').query()
    .equalTo('festival', festival).find({
      success: function(relations) {
        // Now actually get all performance objects
        var promises = relations.map(function(p) {
          var q = new Parse.Query(Performance);
          var d = $q.defer();
          q.get(p.id, {
            success: function(performance) { d.resolve(performance); },
            error: function(err) { d.reject(err); }
          });
          return d.promise;
        });

        // Wait until they're all retrieved, then send result
        $q.all(promises).then(function(performances) {
          deferred.resolve(performances)
        }, function(err) { deferred.reject(err); });
      },
      error: function(err) { deferred.reject(err); }
    });

    return deferred.promise;
  }
}

module.exports = angular.module('LinedUp.services.Parse', [])
.service('FestivalService', ['$q', FestivalService])
.service('PerformanceService', ['$q', PerformanceService])
.service('UserService', ['$q', UserService]);
