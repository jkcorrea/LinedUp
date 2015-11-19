'use strict';

function AppMain ($ionicPlatform, Config) {
  $ionicPlatform.ready(function () {
    // console.log('test');
    Parse.initialize(Config.ENV['PARSE_APP_ID'], Config.ENV['PARSE_JS_KEY']);

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    // if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
    //   cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    // }
    // if (window.StatusBar) {
    //   // org.apache.cordova.statusbar required
    //   //StatusBar.styleLightContent();
    // }
  });
}

module.exports = ['$ionicPlatform', 'Config', AppMain];
