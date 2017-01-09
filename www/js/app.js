/*

  DeepBlue Starter Kit - version 1.1
  Copyright (c) 2015 INMAGIK SRL - www.inmagik.com
  All rights reserved

  written by Mauro Bianchi
  bianchimro@gmail.com  
  
  file: app.js
  
*/

angular.module('deepBlue', ['ionic', 'deepBlue.controllers', 'deepBlue.services', 'ngStorage'])

.run(function($ionicPlatform, $rootScope, $timeout, $state) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    /* 
      #SIMPLIFIED-IMPLEMENTATION:
      Example access control.
      A real app would probably call a service method to check if there
      is a logged user.

      #IMPLEMENTATION-DETAIL: views that require authorizations have an
      "auth" key with value = "true".
    */
    $rootScope.$on('$stateChangeStart', 
      function(event, toState, toParams, fromState, fromParams){
        if(toState.data && toState.data.auth == true && !$rootScope.user.email){
          event.preventDefault();
          $state.go('app.login');   
        }
    });

  });
})

.config(function($stateProvider, $urlRouterProvider) {

  /*

    Here we setup the views of our app.
    In this case:
    - post, account, main, checkout, catPosts will require login
    - app will go to the "start view" when launched.

    #IMPLEMENTATION-DETAIL: views that require authorizations have an
    "auth" key with value = "true".

  */
  
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
  
  .state('app.start', {
    url: '/start',
    views: {
      'menuContent': {
        templateUrl: 'templates/start.html'
      }
    }
  })



  .state('app.forgot', {
    url: '/forgot',
    views: {
      'menuContent': {
        templateUrl: 'templates/forgot.html'
      }
    }
  })

  .state('app.signup', {
    url: '/signup',
    views: {
      'menuContent': {
        templateUrl: 'templates/signup.html'
      }
    }
  })

  .state('app.account', {
      url: '/account',
      data : { auth : true },
      views: {
        'menuContent': {
          templateUrl: 'templates/account.html',
          controller : 'AccountCtrl'
        }
      }
  })

  .state('app.main', {
    url: '/main',
    data : { auth : true },
    cache : false,
    views: {
      'menuContent': {
        templateUrl: 'templates/main.html',
        controller : 'mainCtrl'
      }
    }
  })

  .state('app.catContent', {
    url: '/catContent/:catId',
    views: {
      'menuContent': {
        templateUrl: 'templates/catContent.html',
        controller : 'catContentCtrl'
      }
    }
  })

  .state('app.catPosts', {
    url: '/catPosts',
    data : { auth : true },
    cache : false,
    views: {
      'menuContent': {
        templateUrl: 'templates/catPosts.html',
        controller : 'catPostsCtrl'
      }
    }
  })
  .state('app.post', {
    url: "/catPosts/:postId",
    views: {
      'menuContent': {
        templateUrl: 'templates/post.html',
        controller : 'postCtrl'
      }
    }
  })





  .state('app.checkout', {
    url: '/checkout',
    data : { auth : true },
    cache : false,
    views: {
      'menuContent': {
        templateUrl: 'templates/checkout.html',
        controller : 'CheckoutCtrl'
      }
    }
  })
  
  // If none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/start');

});
