// Ionic Starter App

//Globals
var fadeSpeed = .5;

//backStack, keeps track of the backstack for each seperate tab

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic'])

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

//.config(function($stateProvider, $urlRouterProvider) {
//		$stateProvider
//		.state('jobs_page', {
//			url: '/Jobs',
//			templateUrl: 'jobs_page.html',
//			controller : "JobsCtrl"
//		})
//		.state('notes_page', {
//			url: '/Notes',
//			templateUrl: 'notes_page.html',
//			controller : "NotesCtrl"
//		})
//		.state('alerts_page', {
//			url: '/Alerts',
//			templateUrl: 'alerts_page.html',
//			controller : "AlertsCtrl"
//		})
//		$urlRouterProvider.otherwise("/Jobs");
//})

//.controller('JobsCtrl', function($scope) {
//	$scope.myJobs = [
//		{
//			title: "Replace Faulty Bolts",
//			members: "You"
//		},
//		{
//			title: "Install Arcjet Manifolds",
//			members: "You, Derin"
//		},
//		{
//			title: "Clean you Workplace",
//			members: "You"
//		},
//	];
//})
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
				var currentBackStack = localStorage.getItem('currentBackStackName');
				if (currentBackStack == null) {
					currentBackStack = 'jobs'
					localStorage.setItem('currentBackStackName', currentBackStack);
				}
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

/*
This directive allows us to pass a function in on an enter key to do what we want.
From: http://ericsaupe.com/angularjs-detect-enter-key-ngenter/
 */
.directive('ngEnter', function () {
	return function (scope, element, attrs) {
		element.bind("keydown keypress", function (event) {
			if(event.which === 13) {
				scope.$apply(function (){
					scope.$eval(attrs.ngEnter);
				});

				event.preventDefault();
			}
		});
	};
});

app.factory('jobService', function($rootScope) {

	var JobService = {};
	var list = [
		{
			id: "1",
			title: "Replace Faulty Bolts",
			members: "Olga K. Astra Not(You)",
			created: "3/3/14",
			creator: "Olga K.",
			notes: [
				"this is a test",
				"you are a test"
			],
			tools: [
				{
					name: "Clamp C8",
					current_location: "Mercury-1"
				},
				{
					name: "Clamp C12",
					current_location: "Mercury-2"
				}
			]
		},
		{
			title: "Install Arcjet Manifolds",
			members: "You, Derin"
		},
		{
			title: "Clean you Workplace",
			members: "You"
		},
	];

		JobService.getItem = function(index) { return list[index]; }
			JobService.addItem = function(item) { list.push(item); }
JobService.removeItem = function(item) { list.splice(list.indexOf(item), 1); }
JobService.getJobWithId = function(jobId) {
	for (key in list) {
		if (list[key].id == jobId) {
			return list[key];
		}
	}
}
JobService.addNoteToJob = function(jobId, note) {
	var jobToUpdate = JobService.getJobWithId(jobId);
	jobToUpdate.notes.push(note);
}
JobService.jobs = list;

return JobService;
});

function JobsCtrl($scope, jobService, $rootScope) {
	$scope.myJobs = jobService.jobs;
}

function JobCtrl($scope, jobService, $location) {
	//console.log($location.search('id'));
	var absUrl = $location.$$absUrl;
	var jobId = absUrl.substr(absUrl.indexOf('=')+1);

	$scope.job = jobService.getJobWithId(jobId);

	$scope.addNote = function(note) {
		jobService.addNoteToJob(jobId, note);
	};

}

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
			$scope.hideModal();
			console.log( "please fill out form "); // turn into an alert / notification	
		}
		else {
			formType.job !== undefined ? sendToNotes( formType ) : sendToJobs( formType ); 
			console.log( "submit successfully called" ); 
			$scope.hideModal(); 	
		}
		$scope.showFeedback( formType ); 
	}

	$scope.showFeedback = function( formType ) {
		var title = ""; 
		var notice = ""; 

		if (formType === undefined) {
			notice = "appear error"; 
			$("#notification").addClass( notice ).html("<div> An Error Occurred... </div>"); 
		}
		else {
			// title can be the formType.title
			formType.job !== undefined ? title = "Note" : title = "Job"; 

			// add the formtype title to the notification page
			notice = "appear success"; 
			$("#notification").addClass( notice ).html("<div> Your " + title + " Was Successfully Created ! </div>");
		}

		setTimeout(function() {
			$("#notification").removeClass( notice ).addClass( "disappear" ); 
		}, 2400);	
	}

}

function NavCtrl($scope) {

	//	$scope.goBack = function() {
	//		$ionicNavBarDelegate.back();
	//	};

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

}