// Ionic Starter App

//Globals
var fadeSpeed = .5;

//backStack, keeps track of the backstack for each seperate tab
var currentBackStack = 'jobs';

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
	//	$stateProvider
	//	.state('jobs_page', {
	//		url: '/Jobs',
	//		templateUrl: 'jobs_page.html',
	//		controller : "JobsCtrl"
	//	})
	//	.state('notes_page', {
	//		url: '/Notes',
	//		templateUrl: 'notes_page.html',
	//		controller : "NotesCtrl"
	//	})
	//	.state('alerts_page', {
	//		url: '/Alerts',
	//		templateUrl: 'alerts_page.html',
	//		controller : "AlertsCtrl"
	//	})
	//	$urlRouterProvider.otherwise("/Jobs");
})

.controller('JobsCtrl', function($scope) {
	// add functions to take data from job modal
})
.controller('NotesCtrl', function($scope) {
	// add functions to take data from notes modal
})
.controller('AlertsCtrl', function($scope) {

})

.directive('back', function () {
	return {
		restrict: 'E',
		link: function(scope, element) {
			element.on('click', function() {
				//window.history.back();

				// go back to the last page for this tab, if there aren't any more pages to go back to, do nothing
				var curStack = JSON.parse(localStorage.getItem(currentBackStack));
				if (curStack == null) {
					curStack = new Array();
				}
				if (curStack.length > 0) {
					var backpage = curStack[curStack.length-1];
					console.log(backpage);
					curStack.pop();
					localStorage.setItem(currentBackStack, JSON.stringify(curStack));
					window.location = backpage;
				}
			});
		},
		controller: 'NavCtrl'
	};
})

.directive('a', function () {
	return {
		restrict: 'E',
		link: function(scope, element) {
			element.on('click', function() {
				var curStack = JSON.parse(localStorage.getItem(currentBackStack));
				if (curStack == null) {
					curStack = new Array();
				}
				curStack.push(document.URL);
				localStorage.setItem(currentBackStack, JSON.stringify(curStack));
			});
		},
		controller: 'JobsCtrl'
	}
})


// Controller for Modal Logic
// we should think about making one controller for the modals.
function ModalCtrl( $scope ) {
	// current modal variable
	var $modal = ""; 

	$scope.showModal = function( name ) {
		$modal = name; 
		$("#selectionModal").fadeOut( fadeSpeed ); 
		( name === "note" ) ? $("#addNoteModal").fadeIn(fadeSpeed) : $("#addJobModal").fadeIn(fadeSpeed);
	}

	$scope.hideModal = function( $modal ) {
		// object containing jquery calls for note and job modals
		var modals = {
			note : {
				func: $("#addNoteModal").fadeOut(fadeSpeed)
			}, 
			job : {
				func: $("#addJobModal").fadeOut(fadeSpeed)
			}
		}
		// hide the translucent bg
		$("#hover").fadeOut(fadeSpeed);

		if ( $modal === undefined ) {
			$("#selectionModal").fadeOut( fadeSpeed ); 	
		}
		else {
			// call the appropriate function to fade the modal
			modals[ $modal ].func; 
		}

	}

	$scope.form = {}; 
	var sendToNotes = function( note ) {
		console.log(" insert into notes db ", note ); 
	}

	var sendToJobs = function( job ) {
		console.log(" insert into jobs db ", job ); 
	}


	$scope.submit = function( formType ) {		
		if ( formType === undefined ) {
			console.log( "please fill out form "); // turn into an alert / notification
			$scope.showFeedback( formType ); 	
		}
		else {
			formType.job !== undefined ? sendToNotes( formType ) : sendToJobs( formType ); 
			console.log( "submit successfully called" ); 
			$scope.hideModal(); 
			$scope.showFeedback( formType ); 	
		}
	}

	$scope.showFeedback = function( formType ) {
		var title = ""; 
		if (formType === undefined) {
			$("#notification").addClass( "appear error" )
			.html("<div> An Error Occurred </div>"); 

			setTimeout(function() {
				$("#notification").removeClass( "appear error" )
				.addClass( "disappear" ); 
				
			}, 2400);
		}
		else {
			// title can be the formType.title
			formType.job !== undefined ? title = "Note" : title = "Job"; 

			// add the formtype title to the notification page
			$("#notification").addClass( "appear success" )
			.html("<div> Your " + title + " Was Successfully Created ! </div>"); ; 

			setTimeout(function() {
				$("#notification").removeClass( "appear success" )
				.addClass( "disappear" ); 
			}, 2400);	
		}
	}

}

function NavCtrl($scope) {

	$scope.goBack = function() {
		$ionicNavBarDelegate.back();
	};

	$scope.getClass = function(path) { 
		//		we have to do something to account for highlighting the add notes tab
		if (window.location.href.indexOf(path) != -1) {
			return "active"
		} else {
			return ""
		}
	}

	$scope.showAddNoteModal = function() {
		console.log("calling show note modal"); 
		$("#hover").fadeIn(fadeSpeed);
		$("#addNoteModal").fadeIn(fadeSpeed);
	}

	$scope.showAddJobModal = function() {
		console.log("calling show job modal"); 
		$("#hover").fadeIn(fadeSpeed);
		$("#addJobModal").fadeIn(fadeSpeed);
	}


	$scope.showSelectionModal = function() {
		console.log("iniit")

		$("#addJobModal").fadeOut(fadeSpeed);
		$("#addNoteModal").fadeOut(fadeSpeed);

		$("#hover").fadeIn(fadeSpeed );
		$("#selectionModal").fadeIn( fadeSpeed ); 
	}

	$scope.switchBackStack = function (tab) {
		console.log("switch back stack to " + tab);
		currentBackStack = tab;
	}

}