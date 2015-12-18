var fbUtil = Parse.FacebookUtils;

function SessionsController($scope, $state, Config) { //$cordovaFacebook) {
  $scope.loginFacebook = function() {
    fbUtil.logIn(Config.FB_PERMISSIONS.join(","), {
      success: function(user) {
        $state.go('main.festivals')
      },
      error: function(user, err) {
        console.error(user, err);
      }
    });

    // // Native Android / iOS login
    // if (ionic.Platform.isIOS() || ionic.Platform.isAndroid()) {
    //   $cordovaFacebook.login(Config.FB_PERMISSIONS)
    //   .then(function(res) {
    //     var exp_date = new Date();
    //     exp_date.setSeconds(exp_date.getSeconds() + res.authResponse.expiresIn);
    //     exp_date = exp_date.toISOString();

    //     var fbAuthData = {
    //       id: res.authResponse.userID,
    //       access_token: res.authResponse.accessToken,
    //       expiration_date: exp_date
    //     }

    //     fbUtil
    //       .logIn(fbAuthData)
    //       .then(loggedIn, loginFail);
    //   }, function(err) {
    //     console.log(err);
    //   });
    // }

    // // Browser login
    // else {
    //   fbUtil
    //     .logIn(Config.FB_PERMISSIONS)
    //     .then(loggedIn, loginFail);
    // }
  }
}

module.exports = angular.module('LinedUp.controllers.Sessions', [])
.controller('SessionsController', [
  '$scope',
  '$state',
  'Config',
  SessionsController
]);
