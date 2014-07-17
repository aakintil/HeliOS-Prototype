$(document).ready(function () {

	$( '#warning, #warning-overlay' ).hide(); 

	$( '.deletionFeedback' ).hide(); 
	
	
	function switchToStack(stack) {
		localStorage.setItem('currentBackStackName', stack);
	}

	function getCurrentStackName() {
		return localStorage.getItem('currentBackStackName');
	}

	function getCurrentBackStack() {
		var currentBackStackName = getCurrentStackName();
		if (currentBackStackName == null) {
			currentBackStackName = 'jobs';
			localStorage.setItem('currentBackStackName', currentBackStackName);
		}

		var currentBackStack = JSON.parse(localStorage.getItem(currentBackStackName));
		if (currentBackStack == null || currentBackStack == "") {
			currentBackStack = [];
		}
		return currentBackStack;
	}

	function setCurrentBackStack(stack) {
		localStorage.setItem(getCurrentStackName(), JSON.stringify(stack));
	}

	function popFromStack() {
		var stack = getCurrentBackStack();
		var mrsi = stack.pop();
		setCurrentBackStack(stack);
		return mrsi;
	}

	function saveCurrentPagetoCurrentStack() {

		var currentStack = getCurrentBackStack();
		console.log("Saving Current Page to Current Stack: " + document.location.href + " to " + currentStack);
		currentStack.push(document.location.href);
		setCurrentBackStack(currentStack);
	}

	var local = true;

	$(".home-nav-button").click(function (e) {
		// console.log("home pressed");
		// saveCurrentPagetoCurrentStack();

		// switchToStack('home');
		// var popStack = popFromStack();
		// console.log("Should be navigating to: " + popStack);
		// if (popStack != undefined) {
		// 	document.location.href = popStack;
		// } else {
		// 	document.location.href = "http://localhost:3000/index.html";
		// }

		if (local) {
			document.location.href = "http://localhost:3000/index.html";
		} else {
			document.location.href = "http://still-inlet-9779.herokuapp.com/index.html";
		}


	});

	$(".alerts-nav-button").click(function (e) {
		// console.log("alerts pressed");
		// saveCurrentPagetoCurrentStack();

		// switchToStack('alerts');
		// var popStack = popFromStack();
		// if (popStack != undefined) {
		// 	document.location.href = popStack;
		// } else {
		// 	document.location.href = "http://localhost:3000/alerts.html?type=alert";
		// }


		if (local) {
			document.location.href = "http://localhost:3000/alerts.html?type=alert";
		} else {
			document.location.href = "http://still-inlet-9779.herokuapp.com/alerts.html?type=alert";
		}
	});

	$(".add-nav-button").click(function (e) {
		// console.log("add pressed");
		// saveCurrentPagetoCurrentStack();

		// switchToStack('add');
		// var popStack = popFromStack();
		// if (popStack != undefined) {
		// 	document.location.href = popStack;
		// } else {
		// 	document.location.href = "http://localhost:3000/add.html";
		// }

		if (local) {
			document.location.href = "http://localhost:3000/add.html";
		} else {
			document.location.href = "http://still-inlet-9779.herokuapp.com/add.html";
		}
	});

	// $("#search").keypress(function(event) {
	//     if (event.which == 13) {
	//         console.log("search pressed");

	//         saveCurrentPagetoCurrentStack();

	// 		switchToStack('search');
	// 		console.log("search finished");
	//     }
	// });

	$("body").on('click', 'a', function () {
		console.log("clicked a link")
		saveCurrentPagetoCurrentStack();
	});



	//	Collapsable Code

	$( '.collapsable' ).click( function() {
		var list = $( this ).closest( '.item-divider' ).siblings( '.list' ); 
		$( this ).toggleClass( 'rotate90' ); 
		list.slideToggle(); 
	}); 

	//	Expandable Code 
	//	$(".expandable").click( function() {
	//		console.log(" clicked me")
	//		$(this).find(".tool-submenu").slideToggle(); 
	//	});  

	var selectedPeople = [];

	$("#people-search-bar").on('input', function() {

		$("#people-modal .personselection button").each(function() {
			var curId = $(this)[0].id;

			var icon = $(this).children().first();
			if ($.inArray(curId, selectedPeople) != -1) {
				icon.removeClass('ion-ios7-checkmark-outline');
				icon.addClass('ion-ios7-checkmark');
			} else {
				icon.removeClass('ion-ios7-checkmark');
				icon.addClass('ion-ios7-checkmark-outline');
			}
		})
	});

	// Check List Code
	$("#people-modal .list").on('click', '.checklist-item', function() {

		var id = $(this)[0].id;

		var icon = $(this).children().first();
		if (icon.hasClass('ion-ios7-checkmark-outline')) {
			icon.removeClass('ion-ios7-checkmark-outline');
			icon.addClass('ion-ios7-checkmark');
			selectedPeople.push(id);
		} else if(icon.hasClass('ion-ios7-checkmark')) {
			icon.removeClass('ion-ios7-checkmark');
			icon.addClass('ion-ios7-checkmark-outline');
			var index = selectedPeople.indexOf(id);
			if (index > -1) {
				selectedPeople.splice(index, 1);
			}
		}

		if (icon.hasClass('ion-ios7-plus-outline')) {
			icon.removeClass('ion-ios7-plus-outline')
			icon.addClass('ion-ios7-plus');
		} else if(icon.hasClass('ion-ios7-plus')) {
			icon.removeClass('ion-ios7-plus')
			icon.addClass('ion-ios7-plus-outline')
		}

	});

	$(".modal button").click(function(e) {
		console.log("it was pressed");
	});

	// Code for handling adding element inline
	$('input').keyup(function(e){
		if(e.keyCode == 13)
		{
			$(this).trigger("enterKey");
			//			cordova.plugins.Keyboard.close();
		}
	});

	// Hide job and note creation inputs
	$('#addNoteFromJob').hide();
	$('#addJob').hide();

	$('.cancel-button').hide();
	$('.clear-button img').hide();

	// Code for handling search bar results
	$('#search').bind("enterKey", function() {
		var query = $( this ).val(); 
		$(this).val("");
		window.location = "search.html?"+query; 		
	});

	$('#search').keyup(function() {
		if ($('#search').val().length > 0) {
			$( '.clear-button img' ).fadeIn(50);
		} else {
			$('.clear-button img').fadeOut(50);
		}
	});

	$(".note-text-input").focusout(function() {
		console.log("Focus out");
	});

	// Code for handling search bar results
	$('#search').bind("focus", function() {
		$( '#people-modal .clear-button' )
		.add( $( '#tools-modal .clear-button' ) )
		.add( $('.cancel-button') ).fadeIn(50);

		$('#nav-buttons').fadeOut(50);
		console.log("expanded");
		$('#search').addClass('expanded');
	});


	$('.cancel-button').click(function() {
		$("#search").val("");
		$('#search').removeClass('expanded');
		$('.cancel-button').fadeOut(50);
		$('.clear-button').fadeOut(50);
		$('#nav-buttons').fadeIn(50);
	});

	// redirect cancel button on search page
	$('#search-page .cancel-button').click(function() {
		window.location = "/"; 
	});

	$('.clear-button').bind("click", function() {
		$( '.clear-button img' ).fadeOut(50);
		$("#tools-modal #search").add( $("#people-modal #search") ).add( $("#search") ).val(""); 
		$("#search").focus();
	});

	//	$( '#people-modal .clear-button, #tools-modal .clear-button' ).bind( "click", function() {
	//		//		$( '#search' ).val( "" ); 
	//	})





	setTimeout(function() {
		var opaque = $('#complete img')[0].src;
		//		console.log("OQAQUU IS ", opaque);
		// $(".short.home").css("opacity", 1); 
		var status = ""; 

		// also have to send a notification when job is clicked
		// everything greys out except for the title and the checkbox

		//		debug.log( "shoudl have class", ); 
		//		opaque.addClass("completed"); 
		//		console.log("THE INDEX IS " + (opaque.indexOf("check-checked")));
		if ( opaque.indexOf("check-checked") != -1 ) {
			$('#job-page *').addClass("completed");
		}
	}, 1000);


	$('#add-note').click(function(){
		console.log('clicked');
		var element = $('<li class="item" id="addNoteFromJob"><input class="addListItemInput" type="text" placeholder="Write Note" ng-model="note.message" ng-enter="addNote( note )"></li>');
		$("#notes-list").prepend(element);
		$("#notes-list .empty-item").hide();
		$compile( element )($scope);

		setTimeout(function(){
			$("#notes-list .addListItemInput").focus();
		}, 0);

	});

	// Code for adding note/jobs from the page
	$('.add-type .button').click(function() {
		$(this).addClass('active');
		$(this).siblings('.button').removeClass('active');

		if ($(this).hasClass('note')) {
			console.log('top');
			$('#add-job-form').hide();
			$('#add-note-form').show();
		} else {
			console.log('bottom');
			$('#add-job-form').show();
			$('#add-note-form').hide();
		}
	});

	$('#input-job').click(function() {
		$('#add-page').hide();
		$('#job-modal').show();
	});

	$('#input-participants').click(function() {
		$('#add-page').hide();
		$('#people-modal').show();
	});

	$("#job-modal .list").on("click", ".jobselection", function(event) { 
		var id = event.currentTarget.id;
		var title = $("#"+id).children().first()[0].innerText;
		$('#job-modal').hide();
		$('#add-page').show();
		$('#input-job').val(title);
		$('#input-job-hidden').val(id);
		$('#input-job-hidden').hide();
		$('#input-job-hidden').trigger('input');
	});

	$(".back-job").click(function(){
		$('#job-modal').hide();
		$('#add-page').show();
	});

	$(".back-people").click(function(){
		$('#people-modal').hide();
		$('#add-page').show();
	});

	$("#add-tools").click(function() {
		$("#tools-modal").show();
		$('#tools-modal .clear-button img').fadeIn( 50 );	
	});

	$("#add-people").click(function() {
		$("#people-modal").show();
		$('#people-modal .clear-button img').fadeIn( 50 );
	});

	//	$( ".expand" ).click( function() {
	//		alert(" have been clicked ")
	//	});

	// Modal Logic
	// Hide a modal when it is closed
	$(".modal #nav-bar").on('click', '.done-button', function() {

		// Hide the modal
		$($(this)[0].parentNode.parentNode.parentNode).hide();
		$('.modal-background').hide();
	});

	// Modify a check/plus button on click
	$(".modal .list li").on('click', '.icon', function() {
		console.log($(this));
	});

});