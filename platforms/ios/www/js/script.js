$(document).ready(function () {

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
			console.log("GETCUR: " + currentBackStack);
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
		console.log("Should be adding current page");
		var currentStack = getCurrentBackStack();
		console.log(currentStack);
		currentStack.push(document.location.href);
		console.log(currentStack);
		setCurrentBackStack(currentStack);
	}

	$(".jobs").click(function (e) {
		saveCurrentPagetoCurrentStack();

		switchToStack('jobs');
		var popStack = popFromStack();
		if (popStack != undefined) {
			document.location.href = popStack;
		} else {
			document.location.href = "http://localhost:8100/index.html";
		}

	});

	$(".notes").click(function (e) {
		saveCurrentPagetoCurrentStack();

		switchToStack('notes');
		var popStack = popFromStack();
		if (popStack != undefined) {
			document.location.href = popStack;
		} else {
			document.location.href = "http://localhost:8100/notes.html";
		}
	});

	$(".alerts").click(function (e) {
		saveCurrentPagetoCurrentStack();

		switchToStack('notes');
		var popStack = popFromStack();
		if (popStack != undefined) {
			document.location.href = popStack;
		} else {
			document.location.href = "http://localhost:8100/alerts.html";
		}
	});

	$("a:not(.nav-bar-buttons > a)").click(function () {
		saveCurrentPagetoCurrentStack();
	});



	//	Collapsable Code

	$(".collapsable").click( function() {
		var list =  $(this).parent().siblings(".list"); 
		list.slideToggle(); 
	}); 

	//	Expandable Code 
	$(".expandable").click( function() {
		$(this).find(".tool-submenu").slideToggle(); 
	}); 

	// Check List Code
	$(".checklist-item").click( function() {

		var icon = $(this).children().first();
		if (icon.hasClass('ion-ios7-checkmark-outline')) {
			icon.removeClass('ion-ios7-checkmark-outline')
			icon.addClass('ion-ios7-checkmark');
		} else if(icon.hasClass('ion-ios7-checkmark')) {
			icon.removeClass('ion-ios7-checkmark')
			icon.addClass('ion-ios7-checkmark-outline')
		}

	});

	$(".checklist-item").click( function() {

		var icon = $(this).children().first();
		if (icon.hasClass('ion-ios7-plus-outline')) {
			icon.removeClass('ion-ios7-plus-outline')
			icon.addClass('ion-ios7-plus');
		} else if(icon.hasClass('ion-ios7-plus')) {
			icon.removeClass('ion-ios7-plus')
			icon.addClass('ion-ios7-plus-outline')
		}

	});
	
	// Code for handling adding element inline
	$('input').keyup(function(e){
		if(e.keyCode == 13)
		{
			$(this).trigger("enterKey");
		}
	});

	$('.addListItemInput').hide();
	
	$('.addListItemText').click(function() {
		$(this).nextAll('.addListItemInput');
		$(this).hide();
		$(this).nextAll('.addListItemInput').show();
		$(this).nextAll('.addListItemInput').focus();
	});
	
	$('.addListItemInput').bind("enterKey", function() {
		$(this).hide();
		$(this).val("");
		$(this).prevAll('.addListItemText').show();
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
		$('#add-modal').show();
	});

	$("#add-modal .list").on("click", ".jobselection", function(event) { 
		var id = event.currentTarget.id;
		var title = $("#"+id).children().first()[0].innerText
		$('#add-modal').hide();
		$('#add-page').show();
		$('#input-job').val(title);
		$('#input-job-hidden').val(id);
		$('#input-job-hidden').hide();
		$('#input-job-hidden').trigger('input');
	});
	
});