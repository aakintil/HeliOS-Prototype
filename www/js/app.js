// Ionic Starter App

//Globals
var fadeSpeed = .5;
var members = [ "Olga K.", "Aderinsola A.", "Adam M.", "Maggie B.", "Lisa D.", "Kirsten Y.", "Christine O.", "Matt S.", "Alex E." ]
var personalNoteId = "111111111111111111111111"; 
// Formats console output nicer
var debug = {
	log : function( prefix, input ) {
		console.log( " " ); 
		console.log( prefix );
		console.log( "--------------------------" ); 
		console.log( input );
		console.log( " " ); 
	}	
}



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
			console.log("yes");
		} else {
			console.log("no");
		}
		if(window.StatusBar) {
			StatusBar.hide();
		}
	});
})



// Gestures code 

angular.module('ionicApp', ['ionic'])

////////////////////////////////////////////////
//////////////////// MISC //////////////////////
////////////////////////////////////////////////
app.controller('gestureCtrl', function($scope, $timeout) {
	$scope.myTitle = 'Template';

	$scope.data = {
		swipe : 0,
		swiperight: 0,
		swipeleft: 0,
		tap : 0,
		doubletap : 0
	};

	$scope.reportEvent = function(event)  {
		console.log('Reporting : ' + event.type);

		$timeout(function() {
			$scope.data[event.type]++;
		})
	}


})

app.directive('detectGestures', function( $ionicGesture ) {
	return {
		restrict :  'A',

		link : function(scope, elem, attrs) {
			var gestureType = attrs.gestureType;

			switch(gestureType) {
				case 'swipe':
					$ionicGesture.on('swipe', scope.reportEvent, elem);
					break;
				case 'swiperight':
					$ionicGesture.on('swiperight', scope.reportEvent, elem);
					break;
				case 'swipeleft':
					$ionicGesture.on('swipeleft', scope.reportEvent, elem);
					break;
				case 'doubletap':
					$ionicGesture.on('doubletap', scope.reportEvent, elem);
					break;
				case 'tap':
					$ionicGesture.on('tap', scope.reportEvent, elem);
					break;
			}

		}
	}
})

// end of gestures



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
				window.history.back();
				// var currentBackStack = localStorage.getItem('currentBackStackName');
				// if (currentBackStack == null) {
				// 	currentBackStack = 'jobs'
				// 	localStorage.setItem('currentBackStackName', currentBackStack);
				// }
				// var curStack = JSON.parse(localStorage.getItem(currentBackStack));
				// if (curStack == null) {
				// 	curStack = new Array();
				// }
				// if (curStack.length > 0) {
				// 	var backpage = curStack[curStack.length-1];
				// 	console.log(backpage);
				// 	curStack.pop();
				// 	localStorage.setItem(currentBackStack, JSON.stringify(curStack));
				// 	window.location = backpage;
				// }
			});
		},
		controller: 'NavCtrl'
	};
})

/*
This directive allows us to pass a function in on an enter key to do what we want.
From: http://ericsaupe.com/angularjs-detect-enter-key-ngenter/
*/
.directive( 'ngEnter', function () {
	return function ( scope, element, attrs ) {
		element.bind("keydown keypress", function ( event ) {
			if( event.which === 13 ) {
				scope.$apply( function () {
					scope.$eval( attrs.ngEnter );
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

	this.getJobWithTitle = function( type, param ) {
		return $http.get( urlBase + '/' + type + '/' + param );
	}

	this.getRecentJobs = function( field ) {
		return $http.get( urlBase + '/m/d/y/' + field );
	}

	this.getRecentlyCompletedJobs = function() {
		return $http.put( urlBase + "/completed" ); 
	}

	this.addTool = function() {
		return $http.put( urlBase + '/' + id );
	}

	this.updateJobWithNote = function( id ) {
		return $http.post( urlBase + '/' + id )
	}

	this.updateJobWithTools = function( type, param, id ) {
		return $http.get( urlBase + '/' + type + '/' + param + '/' + id );
	}

	this.changeJobStatus = function( job ) {
		return $http.put( urlBase + '/' + job.id + '/' + job.status ); 
	}

	this.deleteNote = function( job_id, note_id  ) {
		return $http.delete( urlBase + '/' + job_id + '/' + note_id ); 
	}

	this.updateJobMembers = function(members, id) {
		return $http.put( urlBase + '/members/' + id + '/' + members ); 
	}


	this.changeToolStatus = function( tool, jobid ) {
		//		console.log( "see meee here ", note )
		return $http.put( urlBase + '/' + tool.id + '/' + tool.status + '/' +jobid); 
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
		console.log("creating note");
		return $http.post( urlBase, note, id );
	}

	this.getNoteWithId = function( id ) {
		return $http.get( urlBase + '/' + id );
	};

	this.changeStatus = function( note ) {
		//		console.log( "see meee here ", note )
		return $http.put( urlBase + '/' + note.id + '/' + note.status ); 
	}

	this.deleteNote = function( note_id  ) {
		return $http.delete( urlBase + '/' + note_id ); 
	}

	this.getRecentNotes = function( field ) {
		return $http.get( urlBase + '/m/d/y/' + field)
	}


	// change this to a simple getNote function 
	this.getNoteWithMsg = function( type, param ) {
		return $http.get( urlBase + '/' + type + '/' + param);
	}

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


//////////////// Tool Service ////////////////
app.service('notifications', ['$http', function ($http) {
	this.message = "test"
	this.ctrl = ""; 

	this.show = function( data, url ) {
		var title = data.title; 
		var msg = data.msg; 
		var notice = "";
		console.log( data , "in notifications"); 

		if (data === undefined) {
			notice = "appear error"; 
			$("#notification").addClass( notice ).html("<div> An Error Occurred... </div>"); 
		}
		else {
			// title can be the formType.title
			// formType.job !== undefined ? title = "Note" : title = "Job"; 

			// add the formtype title to the notification page
			notice = "appear success"; 
			$("#notification").addClass( notice ).html("<div>" + title + " " + msg + "</div>");
		}

		setTimeout(function() {
			$("#notification").removeClass( notice ).addClass( "disappear" ); 

			setTimeout( function() {
				if ( url !== undefined ) { window.location = url; }
			}, 300); 

		}, 1500);


	}


}]);


app.service('jobPageService', function() {
	var toolList = [];
});



////////////////////////////////////////////////
///////////// Time From Now Filter /////////////
////////////////////////////////////////////////
app.filter('fromNow', function() {
	return function(date) {
		return moment(date).fromNow();
	}
});




////////////////////////////////////////////////
///////////////// CONTROLLERS //////////////////
////////////////////////////////////////////////

//////////////// Job Controller ////////////////
function JobCtrl( $scope, jobService, noteService, toolService, $location, notifications, $timeout, $compile, jobPageService ) {

	$scope.predicate = '-created';

	$scope.data = {
		swipe : 0,
		swiperight: 0,
		swipeleft: 0,
		tap : 0,
		doubletap : 0
	};

	$scope.reportEvent = function(event)  {
		console.log('Reporting : ' + event);

		if ( event.type === "swipe" ) {
			$scope.deleteNote( event ); 
		}

		$timeout(function() {
			$scope.data[event.type]++;
		})
	}

	$scope.deleteNote = function( event ) {
		console.log( "has been called"); 
		console.log( event ); 
		var el = $( event.currentTarget ); 
		el.addClass('animated fadeOutRight');
		// on animation end display none
		el.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
			$( el ).slideToggle( "slow" ); 
		});

		// need a way to get the id on swipe
		//		noteService.deleteNote( note._id )
		//		.success( function( data ) {
		//
		//		})
		//		.error( function( data ) {
		//
		//		})
	}


	//	debug.log( "hopefully this will change", notifications )
	var absUrl = $location.$$absUrl;
	var jobId = absUrl.substr( absUrl.indexOf('=') + 1);

	$scope.headerType = "home";
	var paramString = absUrl.substring(absUrl.indexOf('?')+1);

	if (paramString) {
		var params = paramString.split('&');

		if (params.length >= 1) {
			var id = params[0].substring(3);
			if (id) {
				jobId = id;
			}
		}

		if (params.length >= 2) {
			var type = params[1].substring(5);
			if (type) {
				$scope.headerType = type;
			}
		}
	}

	$scope.expand = function( event ) {
		if(!$(event.target).hasClass("list-item-button")) {
			$( event.currentTarget ).find( ".tool-submenu" ).slideToggle( "1000" ); 
		}
	}

	//	console.log($scope.headerType);
	//	console.log(jobId);

	// Show the job with the given id
	jobService.getJobWithId( jobId )
	.success( function( data ) {
		$scope.job = data; 
		var date = new Date($scope.job.created);
		var dateString = "";
		dateString += (date.getMonth() + 1) + "/" + date.getDay() + "/" + date.getFullYear().toString().substring(2);
		$scope.job.created = dateString;
		$scope.job_tool_ids = $scope.job.tools;
		jobPageService.toolList = $scope.job.tools;
		console.log("Set it to ", jobPageService.toolList);
		$scope.tools = $scope.job.tools;
		$scope.notes = $scope.job.notes; 
		$scope.complete = $scope.job.status; 
	})
	.error( function( data ) {
		console.log( "Error with getting all jobs 44: ", data._id ); 
	})


	$scope.addNote = function( note ) {
		///////////////////////////////////////////////////////////
		// FOUND BUG //////////////////////////////////////////////
		// ON ENTER THE TEXT DOESN'T CHANGE FROM CANCEL TO ADD NOTE
		// CAUSES DISREPANCY //////////////////////////////////////
		///////////////////////////////////////////////////////////

		// hide DOM Elements 
		$( ".addListItemInput" ).parent().hide();
		$( ".addListItemInput" ).val("");

		// run the rest of the method
		var form = {}; 
		form.note = note; 
		form.id = jobId; 

		// so we don't have to refresh
		// create a dom element but when the user returns to the page, the actual note element will be there
		var domNote = $("<li class='expand item regular-text item-button-right' ng-click='expandNote( $event )'><p class='regular-text'>" + note.message + '</p><button class="button button-clear checklist-item" ng-click="changeStatus(note, $event)"><i class="icon ion-ios7-checkmark-outline medium-icon"></i></button></li>'); 

		if ( $(".insert li:nth-child(2)").length !== 0 )
			$( domNote ).insertBefore( $(".insert li:nth-child(2)") ); 
		else
			$( ".insert" ).append( $( domNote ) ); 

		$compile( domNote )($scope);

		// send data to db
		noteService.createNote( form )
		.success( function( data ) {
			console.log( "all notes from this job successfully created | ", data ); 
			var info = {}; 
			info.title = "Note"; 
			info.msg = "has been successfully created! \n And shared with Olga K."; 
			notifications.show( info )
			//			$scope.notes = $scope.job.notes; 
		})
		.error( function( data ) {
			console.log( "error creating a note on jobs page"); 
		})
	};

	$scope.addTool = function(tool) {
		jobService.addToolToJob(jobId, {name: tool});
	};

	$scope.expandNote = function( event ) {
		console.log(" clicked : ", event);
		console.log($(event.target).hasClass("list-item-button"));
		if(!$(event.target).hasClass("list-item-button")) {
			$(event.currentTarget).find("p.regular-text").toggleClass("expanded-note");
			$(event.currentTarget).find("p.detail-info").toggleClass("hidden");
		}
	}

	$scope.s = "unchecked"; 
	$scope.status = ""; 
	$scope.changeStatus = function( obj, event, jobid ) {

		console.log("THE JOB ID IS " + jobid);

		var el = $(event.currentTarget).parent(); 
		var check = $(event.currentTarget).find("img"); 
		var status = ""; 
		debug.log( "shoudl have class", el); 

		if ( el.hasClass("checked") ) {
			el.removeClass("checked");
			check.attr("src", "img/icons/check-unchecked.svg");
			// check.attr("class", "icon ion-ios7-checkmark-outline list-item-button")
			status = "na"; 
		}
		else {
			el.addClass("checked"); 
			check.attr("src", "img/icons/check-checked.svg");
			// check.attr("class", "icon ion-ios7-checkmark list-item-button")
			status = "checked"; 
		}


		console.log("THE OBJ IS ",obj)
		var data = {
			id: obj._id, 
			status: status
		}
		if (obj.message) {
			noteService.changeStatus( data )
			.success( function( data ) {
				debug.log( " a changed status ", data.status ); 
			})
			.error( function( data ) {
				debug.log( "error chaging note status", data ); 
			})
		} else {

			jobService.changeToolStatus(data, jobid)
			// toolService.changeStatus( data )
			.success( function( data ) {
				debug.log( " a changed status ", data.status ); 
			})
			.error( function( data ) {
				debug.log( "error chaging note status", data ); 
			})
		}
	}

	$scope.changeJobStatus = function( job, event ) {
		var el = $(event.currentTarget).parent(); 
		var opaque = el.parent().siblings(); 
		var check = $(event.currentTarget).find("img"); 
		var status = ""; 

		// also have to send a notification when job is clicked
		// everything greys out except for the title and the checkbox

		//		debug.log( "shoudl have class", ); 
		//		opaque.addClass("completed"); 
		if ( opaque.hasClass("completed") ) {
			opaque.removeClass("completed");
			check.attr("src", "img/icons/check-unchecked.svg")
			status = "na"; 
			console.log("TOP");
		}
		else {
			console.log("BOTTOM");
			opaque.addClass("completed"); 
			check.attr("src", "img/icons/check-checked.svg")
			status = "completed"; 
		}
		//		
		var data = {
			id: job._id, 
			status: status
		}
		//		console.log( " should not throw bloody errors ", data )
		jobService.changeJobStatus( data )
		.success( function( data ) {
			//			debug.log( " a changed status ", data.status ); 
			var info = {}; 
			info.title = data.title; 
			info.msg = data.status === "completed" ? "is marked as complete" : "is still in progress"; 
			notifications.show( info ); 
		})
		.error( function( data ) {
			debug.log( "error chaging note status", data ); 
		})
	}


	// note creation click events 
	$scope.inlineShowInput = function( event ) {
		$( "#addNoteFromJob" ).show(); 
		setTimeout(function(){$( ".addListItemInput" ).focus();}, 0);

	}

	$scope.toggleInlineInput = function( event ) {

		$(".notes .empty-item").hide();

		var text = {
			"+ Add Note" : "Cancel", 
			"Cancel" : "+ Add Note"
		}

		var currText = $( event.currentTarget ).html().trim(); 
		console.log(currText);
		var newText = text[ currText ]; 
		console.log(newText);
		$( event.currentTarget ).html( newText ); 

		if ( currText === "Cancel" ) {
			$( ".addListItemInput" ).val( "" ); 
		}


		$( "#addNoteFromJob" ).toggle(); 
		setTimeout(function(){$( ".addListItemInput" ).focus();}, 0);
	}

}

//////////////// Controller for Modal Logic ////////////////
function ModalCtrl( $scope, jobService, noteService, notifications ) {
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
		debug.log( note )
		data.message = note.message; 
		data.job_id = note.job_id === undefined ? personalNoteId : note.job_id; 
		var url = "job.html?id=" + data.job_id; 

		noteService.createNote( data )
		.success( function( data ) {
			var job = data; 
			console.log(" note created " );
			var info = {}; 
			info.title = ""; 
			info.msg = "Note Successfully Created"; 
			notifications.show( info, url); 
		})
		.error( function( data ) {
			console.log(" could not create note ", data ); 
		})

	}

	var sendToJobs = function( job ) {
		console.log(" insert into jobs db ", job ); 
		jobService.createJob( job )
		.success( function( data ) {
			var url = "job.html?id=" + data._id; 
			console.log( data );

			var info = {}; 
			info.title = ""; 
			info.msg = "Job Successfully Created"; 
			notifications.show( info, url);
		})
		.error ( function ( data ) {
			console.log( "Did not work")
		})
	}


	$scope.submit = function( formType ) {

		if ( formType === undefined ) {
			//			$scope.hideModal();
			console.log( "please fill out form "); // turn into an alert / notification	
		}
		else { // only notes contain messages, and messages are required fields
			formType.message !== undefined ? sendToNotes( formType ) : sendToJobs( formType );
			debug.log( "submit successfully called" ); 
			//			$scope.hideModal(); 
		}

	}

}


//////////////// Navigation Controller ////////////////
function NavCtrl($scope, toolService, $location) {
	var searchText = ""; 
	toolService.saveQuery( searchText ); 

	var absUrl = $location.$$absUrl;
	$scope.headerType = "home";
	var paramString = absUrl.substring(absUrl.indexOf('?')+1);

	if (paramString) {
		var params = paramString.split('&');
		if (params.length >= 2) {
			var type = params[1].substring(5);
			if (type) {
				$scope.headerType = type;
			}
		}
	}

	// $scope.getClass = function(path) { 
	// 	//		we have to do something to account for highlighting the add notes tab
	// 	if (window.location.href.indexOf(path) != -1) {
	// 		return "active"
	// 	} else {
	// 		return ""
	// 	}
	// }

	// $scope.showAddNoteModal = function() {
	// 	console.log("calling show note modal"); 
	// 	$("#hover").fadeIn(fadeSpeed);
	// 	$("#addNoteModal").fadeIn(fadeSpeed);
	// }

	// $scope.showAddJobModal = function() {
	// 	console.log("calling show job modal"); 
	// 	$("#hover").fadeIn(fadeSpeed);
	// 	$("#addJobModal").fadeIn(fadeSpeed);
	// }

	// $scope.showSelectionModal = function() {

	// 	$("#addJobModal").fadeOut(fadeSpeed);
	// 	$("#addNoteModal").fadeOut(fadeSpeed);

	// 	$("#hover").fadeIn(fadeSpeed );
	// 	$("#selectionModal").fadeIn( fadeSpeed ); 
	// }

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
function JobsCtrl( $scope, $rootScope, $http, jobService, notifications ) {
	$scope.mpn = personalNoteId; 
	$scope.jobs = ""; 

	$scope.predicate = '-created';
	// onload, show all jobs
	jobService.getJobs()
	.success( function( data ) {
		$scope.jobs = data;
		//		console.log ( " new Jobs ", data )
	})
	.error( function( data ) {
		console.log( "Error with getting all jobs: ", data ); 
	})

	$scope.query = "";

	$scope.setSearchQuery = function(inputQuery) {
		$scope.query = inputQuery;
	}

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

	// job creation click events 

	// toggle the new job input
	$scope.toggleInlineInput = function() {

		var text = {
			"Add Job" : "Cancel", 
			"Cancel" : "Add Job"
		}
		var currText = $( ".create.job" ).html(); 
		var newText = text[ currText ]; 
		$( ".create.job" ).html( newText ); 

		if ( currText === "Cancel" ) 
			$( "#addJobInput" ).val( "" ); 


		$( "#addJob" ).toggle(); 
		setTimeout( function() { 
			$( "#addJobInput" ).focus(); 
		}, 0);
	}


	$scope.createJob = function( job ) {
		console.log( "got the job ", job ); 
		jobService.createJob( job ) 
		.success( function( data ) {
			console.log( "the new job ", data ); 
			$scope.insertJob( data ); 
			$scope.toggleInlineInput(); 

			// add notification
			var info = {}; 
			info.title = data.title; 
			info.msg = "Job was successfully created"
			var url = "job.html?id=" + data._id; 

			notifications.show( info, url ); 
		}) 
		.error( function( data ) {
			console.log( "error creating new inline job" ); 
		})
	}

	$scope.insertJob = function( job ) {
		var title = job.title; 
		var members = job.members;
		var el = $( '<li class="item item-button-right"><a href="job.html?id=' + job._id + '" ng-click="broadcastJob(job._id)"><div class="big-title"> ' + title + '</div><div class="small-regular-text"> ' + members + ' </div></a></li>' ); 

		if ( $( "ul.list li:nth-child(2)" ).length !== 0  )
			$( el ).insertBefore( $( "ul.list li:nth-child(2)" ) );   
		else
			$( "ul.list" ).append( $( el ) ); 
	}

}


//////////////// Search Controller For Node.js & MondoDB Test ////////////////
function SearchCtrl( $scope, $rootScope, $http, toolService, noteService, jobService, $location ) {
	var absUrl = $location.$$absUrl;
	var query = absUrl.substr( absUrl.indexOf('?') + 1 );

	$('#search').val(query);
	$('#search').trigger('input');

	// search preferences 
	setInterval( function(){ 
		$('.cancel-button').fadeIn( 50 );
		$('.clear-button').fadeIn( 50 );
		$('#nav-buttons').fadeOut( 50 );
		$('#search').addClass('expanded');
	}, 10 );
	

	toolService.getToolWithName( query )
	.success( function( data ) {
		$scope.tools = data; 
	})
	.error( function( data ) {
		console.log( " couldnt get appropriate tool name "); 
	})

	var name = query; 
	var type = "name"
	noteService.getNoteWithMsg( type, name )
	.success( function( data ) {
		$scope.notes = data; 
	})
	.error( function( data ) {
		console.log( " couldnt get appropriate note name "); 
	})

	var name = query; 
	var type = "title"
	jobService.getJobWithTitle( type, name )
	.success( function( data ) {
		$scope.jobs = data; 
	})
	.error( function( data ) {
		console.log( " couldnt get appropriate note name "); 
	})

	$scope.goToJobPage = function( element ) {
		//		console.log( " was called with ", element ); 
		var id = element.job_id || element._id || ""; 
		console.log( " a job id of ", id ); 
		var url = id === "" ? "personal-notes.html" : "job.html?id=" + id + "&type=search"; 
		window.location = url; 
	}

	$scope.expand = function( event ) {
		$( event.currentTarget ).find( ".tool-submenu" ).slideToggle( "1000" ); 

	}

}


//////////////// Tools Controller For Node.js & MondoDB Test ////////////////
function ToolsCtrl( $scope, $rootScope, $http, toolService, jobService, $location, jobPageService ) {
	//	console.log ( " scope.Jobs ", Jobs )

	$scope.query = "";
	$scope.predicate = 'name';
	setTimeout( function(){
		$scope.prevToolList = jobPageService.toolList;
		console.log("tools ctrol got it", $scope.prevToolList[0].name);
	}, 250);

	$scope.setSearchQuery = function(inputQuery) {
		$scope.query = inputQuery;
	}

	toolService.getTools()
	.success( function( data ) {
		$scope.tools = data; 
	})
	.error( function( data ) {
		console.log( "error gathering tools from db " );
	})

	$scope.check = function( event ) {
		$( event.currentTarget ).find( "i" ).toggleClass( "ion-ios7-plus-outline" ); 
		$( event.currentTarget ).find( "i" ).toggleClass( "ion-ios7-plus" ); 
	}

	$scope.updateTool = function( event ) {
		var img = $(event.target).find('img');
		console.log("THE IMAGE IS", img);
		if (img.hasClass("unplused")) {
			console.log("top");
			img.removeClass("unplused");
			img.addClass("plused");
			img.attr('src', "img/icons/plus-plused.svg"); 
		} else {
			console.log("bottom");
			img.removeClass("plused");
			img.addClass("unplused");
			img.attr('src', "img/icons/plus-unplused.svg"); 
		}
	}

	$scope.getToolList = function() {
		console.log("tool list function");
		var toolList = [];
		var absUrl = $location.$$absUrl;
		var job_id = absUrl.substr( absUrl.indexOf('?') + 4 );
		$(".plused").each(function(){
			toolList.push($(this).parent().attr('id'));
		});
		console.log(toolList);
		var x = {}; 
		x.type = "update tools";
		console.log(job_id); 
		x.id = job_id; 
		x.param = toolList; 
		// var tools = toolList.join("+");  
		jobService.updateJobWithTools( "tools" , toolList, job_id ) 
		.success( function( data ) {
			$scope.job_tools = data; 
			console.log( "job with new tools ", job_id ); 
			var url = "job.html?id=" + job_id; 
			window.location = url; 
		})
		.error( function( data ) {
			console.log( "we done goofed up"); 
		})

		$("#tools-modal").hide();
		$(".modal-background").hide();
	}

}

var notes = []; 
function ParticipantsCtrl( $scope, $rootScope, $http, $location, jobService) {
	//	console.log ( " scope.Jobs ", Jobs )

	$scope.query = "";
	var absUrl = $location.$$absUrl;
	var job_id = absUrl.substr( absUrl.indexOf('?') + 4 );

	$scope.people = [
		{
			name: 'Adam M',
			id: '1'
		},
		{
			name: 'Billy H',
			id: '2'
		},
		{
			name: 'Gilbert G',
			id: '3'
		},
		{
			name: 'Johnny P',
			id: '4'
		},
		{
			name: 'Jack C',
			id: '5'
		},
		{
			name: 'Tom D',
			id: '6'
		},
		{
			name: 'Robert N',
			id: '7'
		},
		{
			name: 'Robert H',
			id: '8'
		},
		{
			name: 'Tom C',
			id: '9'
		},
		{
			name: 'George P',
			id: '10'
		},
		{
			name: 'Al C',
			id: '11'
		},
		{
			name: 'Scarlet F',
			id: '12'
		},
		{
			name: 'Kate B',
			id: '13'
		},
		{
			name: 'Cate K',
			id: '14'
		},
		{
			name: 'Olga K',
			id: '15'
		}
	];

	$scope.predicate = 'name';

	$scope.updateTool = function( event ) {
		var img = $(event.target).find('img');
		console.log("THE IMAGE IS", img);
		if (img.hasClass("unplused")) {
			console.log("top");
			img.removeClass("unplused");
			img.addClass("plused");
			img.attr('src', "img/icons/plus-plused.svg"); 
		} else {
			console.log("bottom");
			img.removeClass("plused");
			img.addClass("unplused");
			img.attr('src', "img/icons/plus-unplused.svg"); 
		}
	}

	$scope.saveParticipants = function() {
		console.log("Hi");
		var participants = "";
		$("#people-modal li").each(function() {
			if( $(this).find('button plused').length !=0 ) {
				participants += $(this).find('.title-row').first()[0].innerText;
				participants += ", ";
			}
		});
		participants = participants.substring(0, participants.length-2);
		$('#input-participants').val(participants);
		$('#input-participants').trigger('input');
		$('#people-modal').hide();
		jobService.updateJobMembers(participants, job_id)
		.success(function(){
			console.log("Success");
			var url = "job.html?id=" + job_id; 
			window.location = url; 
		})
		.error(function(){
			console.log("Error");
		});
	}
}

//////////////// News Feed Controller For Node.js & MondoDB Test ////////////////
function ActivityFeedCtrl( $scope, jobService, noteService, toolService, $location ) {
	// NOTE can't use track by $index with orderBy and possibly filter
	$scope.predicate = '-created';


	$scope.feed = [];
	var insert = function( obj, data ) {
		var i = 0; 
		for ( i in data ) {
			obj.push( data[ i ] ); 
		}
	}; 

	// recently created jobs
	jobService.getRecentJobs( "created" ) 
	.success( function( data ) {
		console.log( "successfully collected recent jobs" ); 
	})
	.error( function( data ) {
		console.log("error receiving recent job objects");
	})
	.then( function( data ) {
		insert( $scope.feed, data.data ); 
	})

	// recently created notes
	noteService.getRecentNotes( "created" ) 
	.success( function( data ) {
		console.log( "successfully collected recent notes" ); 
	})
	.error( function( data ) {
		console.log( "error receiving recent note objects" ); 
	})
	.then( function( data ) {
		insert( $scope.feed, data.data ); 
	})

	// recently complete jobs 
	jobService.getRecentlyCompletedJobs()
	.success( function( data ) {
		console.log( "successfully collected recently completed" ); 
	})
	.error( function( data ) {
		console.log( "error receiving recently completed jobs"); 
	})

	////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////// DON'T FORGET TO DO CALLS FOR RECENTLY COMPLETED AND PERSONAL NOTES ////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////
}




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
