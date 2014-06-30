// Ionic Starter App

//Globals
var fadeSpeed = .5;

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

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
  $stateProvider
  .state('jobs_page', {
    url: '/Jobs',
    templateUrl: 'jobs_page.html',
    controller : "JobsCtrl"
  })
  .state('notes_page', {
    url: '/Notes',
    templateUrl: 'notes_page.html',
    controller : "NotesCtrl"
  })
  .state('alerts_page', {
    url: '/Alerts',
    templateUrl: 'alerts_page.html',
    controller : "AlertsCtrl"
  })
  $urlRouterProvider.otherwise("/Jobs");
})

.controller('JobsCtrl', function($scope) {
  
})
.controller('NotesCtrl', function($scope) {
  
})
.controller('AlertsCtrl', function($scope) {
  
})

.directive('back', function () {
    return {
        restrict: 'E',
        link: function(scope, element) {
          element.on('click', function() {
            window.history.back();
          });
        },
        controller: 'NavCtrl'
    };
})
//
//.directive('AddNoteModal', function () {
//    return {
//        restrict: 'A',
//        link: function(scope, element) {
//          element.on('click', function() {
//            console.log("Sup Plays");
//          });
//        },
//        controller: 'NavCtrl'
//    };
//});

function AddNoteController($scope) {
  
    $scope.hideNewNoteModal = function() {
      $("#hover").fadeOut(fadeSpeed);
      $("#addNoteModal").fadeOut(fadeSpeed);
    }
}

function NavCtrl($scope) {
  
  $scope.goBack = function() {
    $ionicNavBarDelegate.back();
  };

  $scope.getClass = function(path) { 

    if (window.location.href.indexOf(path) != -1) {
      return "active"
    } else {
      return ""
    }
  }

  $scope.showAddNoteModal = function() {
    console.log("Sup playa?");
    $("#hover").fadeIn(fadeSpeed);
    $("#addNoteModal").fadeIn(fadeSpeed);
  }

//    $("#addNoteModal").fadeOut();
//    $("#hover").fadeOut();
}
