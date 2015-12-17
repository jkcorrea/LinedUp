function AppMain ($ionicPlatform, Config, $window) {
  $ionicPlatform.ready(function () {
    // Init Parse
    Parse.initialize(Config.PARSE_APP_ID, Config.PARSE_JS_KEY);

    if ($window.cordova && $window.cordova.plugins && $window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to
      // show the accessory bar above the keyboard for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      // Disable native scroll
      cordova.plugins.Keyboard.disableScroll(true);
    }


    // org.apache.cordova.statusbar required
    if (window.StatusBar) { StatusBar.styleDefault(); }

    // Init Parse FB sdk if on a browser
    if (!(ionic.Platform.isIOS() || ionic.Platform.isAndroid())) {
      window.fbAsyncInit = function() {
        Parse.FacebookUtils.init({
          appId: Config.FB_APP_ID,
          xfbml: true
        });
      };

      (function(d,s,id) {
         var js, fjs = d.getElementsByTagName(s)[0];
         if (d.getElementById(id)) {return;}
         js = d.createElement(s); js.id = id;
         js.src = "//connect.facebook.net/en_US/sdk.js";
         fjs.parentNode.insertBefore(js, fjs);
       }(document, 'script', 'facebook-jssdk'));
    }

  });
}

module.exports = ['$ionicPlatform', 'Config', '$window', AppMain];
