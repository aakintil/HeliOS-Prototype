// Ionic Starter App

//Globals
var fadeSpeed = .5;
var members = [ "Olga K.", "Aderinsola A.", "Adam M.", "Maggie B.", "Lisa D.", "Kirsten Y.", "Christine O.", "Matt S.", "Alex E." ]



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


////////////////////////////////////////////////
///////////////// DIRECTIVES ///////////////////
////////////////////////////////////////////////

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

////////////////////////////////////////////////
////////////////// SERVICES ////////////////////
////////////////////////////////////////////////

//////////////// Job Service ////////////////
app.service('jobService', ['$http', function ($http) {

	var urlBase = '/api/jobs';
	var noteUrlBase = '/api/notes'; 

	this.getJobs = function() {
		return $http.get( urlBase );
	};

	this.getJobWithId = function( id ) {
		return $http.get( urlBase + '/' + id );
	};

	this.createJob = function( job ) {
		return $http.post( urlBase, job );
	}

	//	this.getNoteWithId = function( id ) {
	//		return $http.get( urlBase + '/' + id );
	//	};


	this.addTool = function() {
		return $http.put( urlBase + '/' + id );
	}

	//	this.addNote = function( note, id ) {
	//		return $http.put( noteUrlBase + '/' + id, note )
	//	}

	this.updateJobWithNote = function( id ) {
		return $http.post( urlBase + '/' + id )
	}

	//		this.getNotesWithId = function( note, id ) {
	//		return $http.put( noteUrlBase + '/' + id, note )
	//	}
	//	
	//	$scope.job = jobService.getNotesWithId(jobId);
	//	this.deleteCustomer = function (id) {
	//		return $http.delete(urlBase + '/' + id);
	//	};

	// for adding notes on job page
	//		create note
	//			insert note into job
	//				update job
}]);

//////////////// Note Service ////////////////
app.service('noteService', ['$http', function ($http) {

	var urlBase = '/api/notes';

	this.getNotes = function() {
		return $http.get( urlBase );
	};

	this.createNote = function( note, id ) {
		return $http.post( urlBase, note, id );
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

//////////////// MIGHT DELETE | USELESS SERVICE ////////////////
app.service('updateJobsService', function () {
	//	var jobs = ""; 
	var jobs = ""; 

	this.getJobs = function() {
		return jobs; 
	}

	this.addToJobs = function( job ) {
		jobs = job; 
	}
});

//////////////// Tool Service ////////////////
app.service('toolService', ['$http', function ($http) {

	var urlBase = '/api/tools';
	var store = ""; 

	this.getTools = function() {
		return $http.get( urlBase );
	};

	this.saveQuery = function( input ) {
		store = input; 
	}

	this.getToolWithName = function( name ) {
		return $http.get( urlBase + '/'  + name);
	}
	
}]);





////////////////////////////////////////////////
///////////////// CONTROLLERS //////////////////
////////////////////////////////////////////////

//////////////// Job Controller ////////////////
function JobCtrl( $scope, jobService, noteService, $location ) {

	var absUrl = $location.$$absUrl;
	var jobId = absUrl.substr( absUrl.indexOf('=') + 1 );

	// Show the job with the given id
	jobService.getJobWithId( jobId )
	.success( function( data ) {
		$scope.job = data; 
	})
	.error( function( data ) {
		console.log( "Error with getting all jobs 44: ", data._id ); 
	})


	noteService.getNotes()
	.success( function( data ) {
		$scope.notes = {}
		console.log(" in here "); 
		var i = "";
		for ( var i in data ) {
			console.log ( " All notes ", data[i].job_id )
			if ( data[i].job_id === jobId ) { $scope.notes[ i ] = data[ i ]  }; 
		}
	})
	.error( function( data ) {
		console.log( "Error with getting all jobs: ", data ); 
	})



	$scope.addNote = function(note) {
		var form = {}; 
		form.note = note; 
		form.id = jobId; 
		noteService.createNote( form )
		.success( function( data ) {
			console.log( "all notes from this job successfully created | ", data )
			$scope.notes = data; 
		})
	};

	$scope.addTool = function(tool) {
		jobService.addToolToJob(jobId, {name: tool});
	};

}


//////////////// Controller for Modal Logic ////////////////
function ModalCtrl( $scope, jobService, noteService ) {
	// current modal variable
	var $modal = ""; 

	jobService.getJobs()
	.success( function( data ) {
		$scope.jobs = data; 
		//		console.log( "successfully got all jobs ", $scope.jobs); 
	})
	.error( function( data ) {
		console.log( "could not successfully get all jobs"); 
	})

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

		var data = {}; 
		data.message = note.message; 
		data.job_id = note.job === undefined ? "" : note.job._id; 
		console.log(data)
		noteService.createNote( data )
		.success( function( data ) {
			console.log(" note created ", data );
			// window.location.reload();
		})
		.error( function( data ) {
			console.log(" could not create note ", data ); 
		})


	}

	var sendToJobs = function( job ) {
		console.log(" insert into jobs db ", job ); 
		jobService.createJob( job )
		.success( function( data ) {
			//			updateJobsService.addToJobs( data ); 
			window.location.reload(); 
			//			console.log( updateJobsService.getJobs() , " should not be null ")
			//			newJobFactory.setJob( data ); 
			//			console.log( newJobFactory.$get() ," will hopefully return a non null object ")
		})
		.error ( function ( data ) {
			console.log( "you fucked up d")
		})
	}


	$scope.submit = function( formType ) {

		if ( formType === undefined ) {
			$scope.hideModal();
			console.log( "please fill out form "); // turn into an alert / notification	
		}
		else { // only notes contain messages, and messages are required fields
			formType.message !== undefined ? sendToNotes( formType ) : sendToJobs( formType ); 
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
function NavCtrl($scope, toolService) {
	var searchText = ""; 
	console.log( searchText, " should change "); 
	toolService.saveQuery( searchText ); 

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
function JobsCtrl( $scope, $rootScope, $http, jobService ) {
	//	console.log ( " scope.Jobs ", Jobs )
	$scope.jobs = ""; 
	// onload, show all jobs
	jobService.getJobs()
	.success( function( data ) {
		$scope.jobs = data;
		//		console.log ( " new Jobs ", data )
	})
	.error( function( data ) {
		console.log( "Error with getting all jobs: ", data ); 
	})


	//	$scope.createJob = function() {
	//		$http.post( '/api/jobs', $scope.formData )
	//		.success( function( data ) {
	//			$scope.formData = {}; // clear the form so users can enter 
	//			$scope.notes = data; 
	//			console.log( "successfully sent the form data to the notes node api | ", data ); 
	//		})
	//		.error( function( data ) {
	//			console.log( "Error! Something went wrong ... ", data)
	//			console.log( " " )
	//		})
	//	}

}



//////////////// Jobs Controller For Node.js & MondoDB Test ////////////////
function SearchCtrl( $scope, $rootScope, $http, toolService, $location ) {
	var absUrl = $location.$$absUrl;
	var query = absUrl.substr( absUrl.indexOf('?') + 1 );
 
	
	toolService.getTools()
	.success( function( data ) {
		$scope.tools = data; 
		console.log( "got all the tools, check it ", $scope.tools ); 
	})
	.error( function( data ) {
		console.log( "shit there was an error loading tools "); 
	})

	toolService.getToolWithName( query )
	.success( function( data ) {
		$scope.results = data; 
		console.log( $scope.result ); 
	})
	.error( function( data ) {
		console.log( " couldnt get appropriate tool name "); 
	})


}


