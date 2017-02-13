

angular.module('deepBlue', ['ionic', 'ionic-toast', 'deepBlue.controllers', 'deepBlue.services', 'ngStorage', 'ngCordova'])

.run(function($ionicPlatform, $rootScope, $timeout, $state) {
  $ionicPlatform.ready(function() {

    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }

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

  .state('app.main', {
    url: '/main',
    views: {
      'menuContent': {
        templateUrl: 'templates/main.html',
        controller : 'mainCtrl'
      }
    }
  })

  .state('app.catContent', {
    url: '/catContent/:catId',
    cache : false,
    views: {
      'menuContent': {
        templateUrl: 'templates/catContent.html',
        controller : 'catContentCtrl'
      }
    }
  })

  .state('app.catPosts', {
    url: '/catPosts',
    cache : false,
    views: {
      'menuContent': {
        templateUrl: 'templates/catPosts.html',
        controller : 'catPostsCtrl'
      }
    }
  })

  .state('app.favorites', {
    url: '/favorites',
    views: {
      'menuContent': {
        templateUrl: 'templates/favorites.html',
        controller : 'favCtrl'
      }
    }
  })
  .state('app.post', {
    url: '/catPosts/:postId',
    cache : false,
    views: {
      'menuContent': {
        templateUrl: 'templates/post.html',
        controller : 'postCtrl'
      }
    }
  })





  
  // If none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/start');

});
