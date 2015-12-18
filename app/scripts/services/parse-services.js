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
  this.getFriends = function() {
    var user = Parse.User.current();
    if (!user) return;
    var query = new Parse.Query(Parse.User);
    var deferred = $q.defer();

    query.find({
      success: function(users) { deferred.resolve(users); },
      error: function(err) { deferred.reject(err); }
    });

    return deferred;
  };

  this.addPerformance = function(performance) {
    var user = Parse.User.current();
    if (!user) return;
    var rel = user.relation('performances');
    rel.add(performance);
    user.save();
  };

  this.removePerformance = function(performance) {
    var user = Parse.User.current();
    if (!user) return;
    var rel = user.relation('performances');
    rel.remove(performance);
    user.save();
  };

  this.getLineupForFestival = function(festival) {
    var user = Parse.User.current();
    if (!user) return;

    var deferred = $q.defer();

    // First get all of the user's performances
    user.relation('performances').query()
    .equalTo('festival', festival).find({
      success: function(performances) { deferred.resolve(performances) },
      error: function(err) { deferred.reject(err); }
    });
    return deferred.promise;
  }
}

module.exports = angular.module('LinedUp.services.Parse', [])
.service('FestivalService', ['$q', FestivalService])
.service('PerformanceService', ['$q', PerformanceService])
.service('UserService', ['$q', UserService]);
