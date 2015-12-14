function AppMain ($ionicPlatform, Config, $window) {
  $ionicPlatform.ready(function () {
    // console.log('test');
    Parse.initialize(Config.PARSE_APP_ID, Config.PARSE_JS_KEY);

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if ($window.cordova && $window.cordova.plugins && $window.cordova.plugins.Keyboard) {
      $window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      $window.cordova.plugins.Keyboard.disableScroll(true);
    }
    // if (window.StatusBar) {
    //   // org.apache.cordova.statusbar required
    //   //StatusBar.styleLightContent();
    // }
  });
}

module.exports = ['$ionicPlatform', 'Config', '$window', AppMain];
