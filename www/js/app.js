// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('songhop', [
  'ionic', 
  'ngCordova',
  'firebase', 
  'songhop.controllers',
  'songhop.services'
])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }  
  });
})


.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router, which uses the concept of states.
  // Learn more here: https://github.com/angular-ui/ui-router.
  // Set up the various states in which the app can be.
  // Each state's controller can be found in controllers.js.
  $stateProvider

  // Set up an abstract state for the tabs directive:
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    controller: 'TabsCtrl',
    resolve: {
        requireNoAuth: function($location, Auth){
          return Auth.$requireAuth().then(function(auth){
            $location.path('/tab/discover');
          }, function(error){
            $location.path('/login');
          });
        }
      }
  })

  // Each tab has its own nav history stack:

  .state('tab.discover', {
    url: '/discover',
    views: {
      'tab-discover': {
        templateUrl: 'templates/discover.html',
        controller: 'DiscoverCtrl'
      }
    },
    resolve: {
        requireNoAuth: function($location, Auth){
          return Auth.$requireAuth().catch(function(auth){
            $location.path('/login');
          });
        }
      }
  })

  .state('tab.favorites', {
      url: '/favorites',
      views: {
        'tab-favorites': {
          templateUrl: 'templates/favorites.html',
          controller: 'FavoritesCtrl'
        }
      },
      resolve: {
        requireNoAuth: function($location, Auth){
          return Auth.$requireAuth().then(function(auth){
            $location.path('/tab/favorites');
          }, function(error){
            $location.path('/login');
          });
        }
      }
    })
  
   .state('tab.location', {
      url: '/location',
      views: {
        'tab-location': {
          templateUrl: 'templates/location.html',
          controller: 'LocationCtrl'
        }
      },
      resolve: {
        requireNoAuth: function($location, Auth){
          return Auth.$requireAuth().then(function(auth){
            $location.path('/tab/location');
          }, function(error){
            $location.path('/login');
          });
        }
      }
    })

  .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'AuthCtrl',
      resolve: {
        requireNoAuth: function($location, Auth){
          return Auth.$requireAuth().then(function(auth){
              $location.path('/tab/discover');
          
          }, function(error){
            $location.path('/login');
          });
        }
      }
  })

 .state('signup',{
  url:'/signup',
  templateUrl:'templates/signup.html',
  controller: 'AuthCtrl',
  resolve: {
      requireNoAuth: function($location, Auth){
        return Auth.$requireAuth().then(function(auth){
          $location.path('/tab/discover');
        }, function(error){
          $location.path('/signup');
        });
      }
    }
 })
  // If none of the above states are matched, use this as the fallback:
  $urlRouterProvider.otherwise('/login');

})
.constant("FirebaseUrl","https://dazzling-heat-4080.firebaseio.com/")

.constant('SERVER', {
  // Local server
  //url: 'http://localhost:3000'

  // Public Heroku server
  url: 'https://ionic-songhop.herokuapp.com'
});
