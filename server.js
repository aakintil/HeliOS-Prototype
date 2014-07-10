// Configure our application
// Connect to our database
// Create our Mongoose models
// Define routes for our RESTful API
// Define routes for our frontend Angular application
// Set the app to listen on a port so we can view it in our browser

// server.js

//////////////// Set Up ////////////////
var express  = require('express');
var app      = express(); 								// create our app w/ express
var mongoose = require('mongoose'); 					// mongoose for mongodb
var Schema = mongoose.Schema; 


/////////////////////////////////////////////////////
////////////////// CONFIGURATION ////////////////////
/////////////////////////////////////////////////////

//mongoose.connect('mongodb://node:node@mongo.onmodulus.net:27017/uwO3mypu'); 	// connect to mongoDB database on modulus.io


/// ~~~~~~~UN COMMENENETNT!!!!!!!! ???/////
var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/helios-test';
mongoose.connect(mongoUri);
//mongoose.connect( 'mongodb://localhost/helios-test' ); 


app.configure(function() {
	app.use(express.static(__dirname + '/www')); 		// set the static files location for index.html
	app.use(express.logger('dev')); 						// log every request to the console
	app.use(express.bodyParser()); 							// pull information from html in POST
});






////////////////////////////////////////////////
///////////////// RESTFUL API //////////////////
////////////////////////////////////////////////
// have to create get, post, and delete models for Jobs, Alerts, Tools, and Member/Participants


// Schemas will work for the associations with other collections
// READ TMRW
// http://mongoosejs.com/docs/populate.html


// Notes Model 
var Note = mongoose.model( 'Note', {
	message : { type: String }, 
	status : String,
//	status : { type: String, default: 'unchecked' }, 
	creator : String, 
	job_id : String 
	//	{ type: Schema.Types.ObjectId, ref: 'Job' }
})

// Job Model 
var Job = mongoose.model( 'Job', {
	title : String, 
	members : { type: String }, 
	created : { type: Date, default: Date.now }, 
	creator : String, 
	tools : [{ type: Schema.ObjectId, ref: 'Tool' }], 
	notes : [{ type: Schema.ObjectId, ref: 'Note' }], //[ { type: Schema.Types.ObjectId, ref: 'Note' } ], 
	status : String
})


// Tool Model 
var Tool = mongoose.model( 'Tool', {
	name : String,
	current_location : String, 
	home_location : String, 
	replacement_for : String, 
	status : String
})





//////////////////////////////////////////////
////////////////// ROUTES ////////////////////
//////////////////////////////////////////////


////// TOOLS //////

// Get ALL Tools
app.get( '/api/tools', function ( req, res ) {
	Tool.find( function( err, tools ) {
		// if there is an error, send the error notification 
		if ( err ) { res.send( err ); console.log("Error finding / getting appropriate tool  |  line 42 : server.js") }; 
		res.json( tools ) // return all notes in the JSON format
	})
}); 

// Get Tool With Name 
app.get( '/api/tools/:name', function ( req, res ) {
	console.log( "======== CALLED THE RIGHT METHOD =======")

	console.log( "hopefully the name ", req.params.name ); 
	var n = "^" + req.params.name; 
	var name = new RegExp( n, "i" ); 
	var query = { 'name' : name };

	Tool.find( query, function( err, item ) {
		console.log( "i am in the find one query function ", item );
		res.json( item );
	});
}); 



////// NOTES //////

// Get ALL Notes
app.get( '/api/notes', function ( req, res ) {
	// use mongoose to get all notes in the database
	Note.find( function( err, notes ) {
		// if there is an error, send the error notification 
		if ( err ) { res.send( err ); console.log("Error finding / getting appropriate note  |  line 42 : server.js") }; 
		res.json( notes ) // return all notes in the JSON format
	})
}); 




app.get('/api/notes/:type/:name', function( req, res  ) {
	console.log( "======== CALLED THE WROOOOOONG METHOD =======")
	console.log( " the job ", req.params );

	var n = "^" + req.params.name; 
	var name = new RegExp( n, "i" ); 
	var query = req.params.type === "name" ? { 'message' : name } : { '_id' : name };

	Note.find( query, function( err, item ) {
		console.log( "i am in the find one query function ", item );
		res.json( item );
	});
});



app.put( '/api/notes/:id/:status', function( req, res ) {
	console.log( "------- SEE MEEE ------- ");
//	console.log( req.params );
	var query = { _id : req.params.id }; 
	var s = req.params.status; 
	var status = s === "na" ? "" : s;
	console.log( status , " hopefully will be null ")
	Note.findOne( query, function( err, note ) {
		if ( err ) { console.log( " couldn't find the job ") }; 
		note.status = status; 
		note.save(); 
		res.json( note ); 
	})
})



// Create a Note
app.post( '/api/notes', function( req, res ) {
	console.log(" ===== IN THE NOTES POST CALL ===== ", req.body ); 
	console.log(" =================" );

	var msg = req.body.note === undefined ? req.body.message : req.body.note.message;
	var j_id = req.body.id || req.body.job_id; 

	// find the appropriate job
	var query = { '_id' : j_id };

	Note.create({ 
		message : msg,
		creator : "You",
		job_id : j_id,
		done : false
	}, function( err, note ) {
		if ( err ) { res.send( err ); console.log("Error creating / inserting appropriate note  |  line 162 : server.js") }; 
		note.save(); 

		// find the right job and attach note id to it and populate
		Job.findOne( query, function( err, job ) {
			if ( err ) { console.log( " couldn't find the job ") }; 
			job.notes.push( note._id );
			job.save(); 
		}).populate("notes").exec( function( err, job ) {
			if ( err ) { console.log( "you don goofed : couldn't populate notes ") }; 
			console.log( " the new note should be in here ======= \n", job )
			//			console.log( " the old note ", job.notes )
			res.json( job )
		});
	})
}); 


// Delete a Note 
// think about making this "HIDE" ... which if we do, an api call won't be necessary 
app.delete( '/api/notes/:note_id', function( req, res ) {
	Note.remove({
		_id : req.params.note_id
	}, function( err, note ) {
		if ( err ) { res.send( err ); console.log("Error deleting appropriate note |  line 77 : server.js") }

		Note.find( function( err, notes ) {
			if ( err ) { res.send( err ); console.log("Error finding / getting appropriate note |  line 80 : server.js") }

			res.json( notes ) // return all notes in the JSON format after we create another
		})

	})
})

//////////////////////////////// END OF NOTE ROUTES ////////////////////////////////




// change the status of a job
app.put( '/api/jobs/:id/:status', function( req, res ) {
	console.log( "------- SEE MEEE ------- ");
//	console.log( req.params );
	var query = { _id : req.params.id }; 
	var s = req.params.status; 
	var status = s === "na" ? "" : s;
	console.log( status , " hopefully will be null ")
	Job.findOne( query, function( err, job ) {
		if ( err ) { console.log( " couldn't find the job ") }; 
		job.status = status; 
		job.save(); 
		res.json( job ); 
	})
})



// Get Job With Id 
app.get('/api/jobs/:id', function( req, res ) {
	//	res.send('jobs should have an id ' + req.params.id);
	var query = { '_id' : req.params.id };

	Job.findOne( query ).populate("tools").populate("notes").exec( function( err, job ) {
		if ( err ) { console.log( "you don goofed ") }; 
//		console.log( "LOOK AT MEEEEE ", job );
		res.json( job )
	});
});


app.post('/api/jobs/:type/:param', function( req, res  ) {
	console.log( "======== CALLING THE INSERT TOOL INTO JOB METHOD =======")
	console.log( " the job ", req.params );

	// var n = "^" + req.params.name; 
	// var name = new RegExp( n ); 
	// var query = req.params.type === "name" ? { 'message' : name } : { '_id' : name };

	// Note.find( query, function( err, item ) {
	// 	console.log( "i am in the find one query function ", item );
	// 	res.json( item );
	// });
});



// Get ALL Jobs
app.get( '/api/jobs', function ( req, res ) {

	// use mongoose to get all jobs in the database
	Job.find( function( err, jobs ) {

		// if there is an error, send the error notification 
		if ( err ) { res.send( err ); console.log("Error finding / getting appropriate job  |  line 117 : server.js") }; 

		res.json( jobs ) // return all notes in the JSON format
	})
}); 


// getJob with title, and ...
app.get('/api/jobs/:type/:title', function( req, res  ) {
	console.log( "======== CALLED THE WROOOOOONG METHOD =======")
	console.log( " the job ", req.params );
	var n = "^" + req.params.title; 
	var name = new RegExp( n, "i" ); 
	var query = req.params.type === "title" ? { 'title' : name } : { '_id' : name };

	Job.find( query, function( err, item ) {
		console.log( "i am in the find one query function ", item );
		res.json( item );
	});

});


app.get( '/api/jobs/:type/:title/:id', function( req, res ) {
	console.log( "======== CALLED THE METHOD TO UPDATE JOBS WITH TOOLS =======")
	// console.log( " the job ", req.params );
	var query = { '_id' : req.params.id }; 
	var new_tools = req.params.title; 
	var new_tools_array = new_tools.split(",");
	// console.log( query, " , please be in here")

	Job.findOne( query, function( err, job ) {
		console.log( "the tools ", typeof job.tools );
		// job.tools.push( tools ); 
		console.log(new_tools_array);
		//		job.update( { tools : new_tools_array }, function() { console.log("updated job") } ); 
		var i = 0; 
		for ( var i in new_tools_array ) {
			var id = mongoose.Types.ObjectId( new_tools_array[ i ] ); 
			job.tools.push( id ); 
		}

		job.save(); 
		res.json( job );
	});
}); 




// Add a note to a job // UPDATE
app.post( '/api/jobs/:id', function( req, res ) {
	console.log(" ===== IN THE JOB UPDATE CALL ====")
	//	console.log( req.body , " note id ")
	console.log( req.params , " the params ")
	console.log(" =====================")
	//	var query = { '_id' : req.params.id };
	//	Job.findById( query, function ( err, job ){
	//		job.notes    = req.body.content;
	//		todo.updated_at = Date.now();
	//		job.save( function ( err, job, count ){
	//			res.redirect( '/' );
	//		});
	//	});
})




// Create a Job
// old create job
//app.post( '/api/jobs', function( req, res ) {
//	////////////////// SET THIS UP ////////////////// 
//	console.log( " ===== MADE APPROPRIATE SERVER CALL ===== ")
//	console.log( " ")
//	console.log( req.body )
//	Job.create({ 
//		title: req.body.title,
//		members: req.body.members || "",
//		creator: "You", // have to change this to member_id or something like that, 
//		notes: req.body.note || "",
//		done : false
//	}, function( err, job ) {
//		if ( err ) { res.send( err ); console.log("Error creating / inserting appropriate job  |  line 133 : server.js ", err) }; 
//
//		Job.find( function( err, jobs ) {
//			if ( err ) { res.send( err ); console.log("Error finding / getting appropriate job AFTER CREATING one |  line 136 : server.js") };
//			res.json( jobs ) // return all notes in the JSON format after we create another
//		})
//	})
//}); 

app.post( '/api/jobs', function( req, res ) {
	var msg = req.body.note || "" ;
	var m = req.body.members || ""; 
	var members = m === "" ? "You" : "You, " + m; 
	id = []; 
	console.log( req.body , " Look Here " );

	if ( msg.length === 0 ) {
		//		then we don't have to create a note
		Job.create({ 
			title: req.body.title,
			members: members,
			creator: "You", // have to change this to member_id or something like that, 
			done : false
		}, function( err, job ) {
			if ( err ) { res.send( err ); console.log("Error creating / inserting appropriate job  |  line 133 : server.js ", err) }; 

			res.json( job ); 
			//			Job.find( function( err, jobs ) {
			//				if ( err ) { res.send( err ); console.log("Error finding appropriate job | server.js") };
			//				res.json( job ) // return all jobs (might change to a singular job if we want to go to that job page)
			//			})

		})
	}
	else {

		Note.create({ 
			message : msg,
			creator : "You",
			done : false
		}, function( err, note ) {
			if ( err ) { res.send( err ); console.log("Error creating / inserting appropriate note  |  line 162 : server.js") }; 

			//			var query = { _id : job._id }; 
			Job.create({ 
				title: req.body.title,
				members: members,
				creator: "You", // have to change this to member_id or something like that, 
				done : false
			}, function( err, job ) {
				if ( err ) { res.send( err ); console.log("Error creating / inserting appropriate job  |  line 133 : server.js ", err) }; 

				console.log( "  " ); 

				console.log( "  " ); 
				if ( job.notes === undefined)
					job.notes = note._id; 
				else
					job.notes.push( note._id ); 

				job.save( function( err, i ) {
					if ( err ) { console.log (" common ")}
					//					console.log( " after save ", i._id , " |  ", job._id, " |  ", "53bca47cffd0360000000002" ); 

					query = { "notes" : note._id }; 
					Job.findOne( query, function( err, job ) {
						if ( err ) { res.send( err ); console.log("Error finding appropriate job | server.js") };
						//						console.log( "========== \n", job ); 
						res.json( job ) // return all jobs (might change to a singular job if we want to go to that job page)
					}).populate("notes").exec( function( err, job ) {
						if ( err ) { console.log( "you don goofed : couldn't populate notes ") }; 

						Job.find( function( err, jobs ) { 
							if ( err ) { console.log( "you don goofed : couldn't populate notes ") }; 
							//							res.json( jobs ); 
						})
						//						res.json( job )
					});
				}); 

			})

		}); 

	}					
})



//		else {
// create the note
//			Note.create({ 
//				message : msg,
//				creator : "You",
//				done : false
//			}, function( err, note ) {
//				if ( err ) { res.send( err ); console.log("Error creating / inserting appropriate note  |  line 162 : server.js") }; 
//
//				var query = { _id : job._id }; 
//				Job.findOne( query, function( err, job ) {
//					if ( err ) { console.log( " couldn't find the job ") }; 
//					job.notes.push( note._id );
//					job.save(); 
//				}).populate("notes").exec( function( err, job ) {
//					if ( err ) { console.log( "you don goofed : couldn't populate notes ") }; 
//					console.log( " the new note ", job ); 
//					//			console.log( " the old note ", job.notes )
////					res.json( job )
//				});
//			})




//		}


// Delete a Job 
// think about making this "HIDE" ... which if we do, an api call won't be necessary 
app.delete( '/api/notes/:job_id', function( req, res ) {

	Job.remove({
		_id : req.params.job_id
	}, function( err, job ) {
		if ( err ) { res.send( err ); console.log("Error deleting appropriate job |  line 149 : server.js") }

		Note.find( function( err, jobs ) {
			if ( err ) { res.send( err ); console.log("Error finding / getting appropriate job |  line 152 : server.js") }

			res.json( jobs ) // return all notes in the JSON format after we create another
		})

	})
})



//////////////////////////////// END OF JOB ROUTES ////////////////////////////////










app.get( '*', function( req, res ) {
	res.sendfile( 'www/index.html')
})



var port = Number(process.env.PORT || 3000);
app.listen(port, function() {
	console.log("Listening on " + port);
});


// UNCOMMMENENENENT //
// listen (start app with node server.js) ======================================
//app.listen(3000, "localhost");
//console.log( "commonnn   ", app.get('port') );
//console.log("App listening on port 3000");