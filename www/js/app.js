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

app.factory('toolService', function($rootScope) {

	var ToolService = {};
	var list = [
		{
			id: '1',
			name: "Clamp C8",
			current_location: "Mercury-1"
		},
		{
			id: '2',
			name: "Screwdriver 42",
			current_location: "Mercury-2"
		},
		{
			id: '3',
			name: "1/4 Inch Wrench",
			current_location: "Saturn-2"
		},
		{
			id: '4',
			name: "Socket Set",
			current_location: "Venus-2"
		},
		{
			id: '5',
			name: "Torque Wrench B93",
			current_location: "Pluto"
		},
		{
			id: '6',
			name: "Torque Wrench A77",
			current_location: "Saturn-4"
		}
	];

	ToolService.getItem = function(index) { return list[index]; }
	ToolService.addItem = function(item) { list.push(item); }
	ToolService.removeItem = function(item) { list.splice(list.indexOf(item), 1); }
	ToolService.getJobWithId = function(toolId) {
		for (key in list) {
			if (list[key].id == toolId) {
				return list[key];
			}
		}
	}
	ToolService.tools = list;

	return ToolService;
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
					id: '1',
					name: "Clamp C8",
					current_location: "Mercury-1"
				},
				{
					id: '2',
					name: "Screwdriver 42",
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


		//
		//		var job = 
		//		{
		//		title: "Replace Faulty Bolts",
		//		members: "Olga K. Astra",
		//		created: Date.now(),
		//		creator: "Olga K.",
		//		tools: [{
		//		name: "Clamp C8",
		//		current_location: "Mercury-1"
		//		},
		//		{
		//		name: "Clamp C12",
		//		current_location: "Mercury-2"
		//		}]
		//	},
		//			{
		//				title: "Install Arcjet Manifolds",
		//				members: “Admin"
		//			},
		//
		//			{
		//				title: "Clean you Workplace",
		//				members: “Admin"
		//			},
		//
		//			]





		JobService.getItem = function(index) { return list[index]; }
			JobService.addItem = function(item) { list.push(item); }
JobService.removeItem = function(item) { list.splice(list.indexOf(item), 1); }
JobService.getJobWithId = function(jobId) {
	for (key in list) {
		if (list[key].id == jobId) {
			return list[key];
		}
	}

	JobService.addNoteToJob = function(jobId, note) {
		var jobToUpdate = JobService.getJobWithId(jobId);
		jobToUpdate.notes.push(note);
	}
	JobService.addToolToJob = function(jobId, note) {
		var jobToUpdate = JobService.getJobWithId(jobId);
		jobToUpdate.tools.push(note);
	}
	JobService.jobs = list;

	return JobService;
}

});



//////////////// All Job Factory ////////////////
app.factory("Jobs", function(){
	this.insert = function( data ) {
		var k = ""; 
		for ( var k in data ) {
			this.push( data[ k ] ); 
		}
	}

	this.get = function( id ) {
		var k = ""; 
		for ( var k in this ) {
			if ( this[ k ]._id === id ) 
				return this[ k ]; 
		}
		return "doesn't exist"
	}
});



app.service('jobService', ['$http', function ($http) {

	var urlBase = '/api/jobs';
	var noteUrlBase = '/api/notes'

	this.getJobs = function() {
		return $http.get( urlBase );
	};

	this.getJobWithId = function( id ) {
		return $http.get( urlBase + '/' + id );
	};

	this.addTool = function() {
		return $http.put( urlBase + '/' + id );
	}

	//	this.deleteCustomer = function (id) {
	//		return $http.delete(urlBase + '/' + id);
	//	};

	// for adding notes on job page
	//		create note
	//			insert note into job
	//				update job
}]);




app.service('noteService', ['$http', function ($http) {

	var urlBase = '/api/notes';

	this.getNotes = function() {
		return $http.get( urlBase );
	};

	this.createNote = function( note ) {
		return $http.post( urlBase, note );
	}

	this.getNoteWithId = function( id ) {
		return $http.get( urlBase + '/' + id );
	};

	this.addTool = function() {
		return $http.put( urlBase + '/' + id );
	}

	//	this.deleteCustomer = function (id) {
	//		return $http.delete(urlBase + '/' + id);
	//	};

}]);









//////////////// Job Controller ////////////////
function JobCtrl( $scope, jobService, noteService, $location, Jobs ) {

	var absUrl = $location.$$absUrl;
	var jobId = absUrl.substr( absUrl.indexOf('=') + 1 );

	// get all the notes 
	// have to change this to another function later... get all notes with job id xx
	noteService.getNotes()
	.success( function( data ) {
		$scope.notes = data;
		console.log ( " All notes ", data )
	})
	.error( function( data ) {
		console.log( "Error with getting all jobs: ", data ); 
	})

	// Show the job with the given id
	jobService.getJobWithId( jobId )
	.success( function( data ) {
		$scope.job = data;
		console.log ( " this page's job ", data )
	})
	.error( function( data ) {
		console.log( "Error with getting all jobs: ", data._id ); 
	})
	//	$scope.myJob = get_object_id( jobId, ; 

	$scope.job = jobService.getJobWithId(jobId);

	$scope.addNote = function(note) {
		console.log( note.message , " | is the new note "); 
		noteService.createNote( note )
		.success( function( data ) {
			console.log( "note successfully created | ", data )

			noteService.getNotes()
			.success( function( data ) {
				$scope.notes = data;
				console.log ( " All notes ", data )
			})
			.error( function( data ) {
				console.log( "Error with getting all jobs: ", data ); 
			})

		})
	};

	$scope.addTool = function(tool) {
		jobService.addToolToJob(jobId, {name: tool});
	};

}

//////////////// Controller for Modal Logic ////////////////
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


//////////////// Navigation Controller ////////////////
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


//////////////// Notes Controller For Node.js & MondoDB Test ////////////////
function NotesCtrl( $scope, $http ) { //$http variale 
	console.log( " note controller has been accessed " );
	console.log( " " )
	console.log( " " )

	// get all the notes and show them once a user lands on this page
	$http.get( '/api/notes' )
	.success( function( data ) {
		$scope.text = data; 
		console.log( "all the notes in the database | ", data ); 
		console.log( " " )
	})
	.error( function( data ) {
		console.log( "Error with getting notes: ", data ); 
		console.log( " " )
	}); 

	// create a note and send it to the database 
	// after submission, send the text to the node API
	$scope.createNote = function() {
		console.log("called createNote")
		$http.post( '/api/notes', $scope.formData )
		.success( function( data ) {
			$scope.formData = {}; // clear the form so users can enter 
			$scope.text = data; 
			console.log( "successfully sent the form data to the notes node api | ", data ); 
		})
		.error( function( data ) {
			console.log( "Error! Something went wrong ... ", data)
			console.log( " " )
		})
	}
}


//////////////// Jobs Controller For Node.js & MondoDB Test ////////////////
function JobsCtrl( $scope, jobService, $rootScope, $http, jobService ) {
	//	console.log ( " scope.Jobs ", Jobs )

	// onload, show all jobs
	jobService.getJobs()
	.success( function( data ) {
		$scope.jobs = data;
		console.log ( " new Jobs ", data )
	})
	.error( function( data ) {
		console.log( "Error with getting all jobs: ", data ); 
	})


	$scope.createJob = function() {
		$http.post( '/api/jobs', $scope.formData )
		.success( function( data ) {
			$scope.formData = {}; // clear the form so users can enter 
			$scope.notes = data; 
			console.log( "successfully sent the form data to the notes node api | ", data ); 
		})
		.error( function( data ) {
			console.log( "Error! Something went wrong ... ", data)
			console.log( " " )
		})
	}

	$scope.broadcastJob = function( id ) {
		//		console.log( " the job ", get_object_id( id, Jobs ) ); 
		//		console.log( "seeing if the http variable is available ", Job )
	}
}


