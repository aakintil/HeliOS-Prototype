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


// configuration =================

//mongoose.connect('mongodb://node:node@mongo.onmodulus.net:27017/uwO3mypu'); 	// connect to mongoDB database on modulus.io
mongoose.connect( 'mongodb://localhost/helios-test' ); 


app.configure(function() {
	app.use(express.static(__dirname + '/www')); 		// set the static files location for index.html
	app.use(express.logger('dev')); 						// log every request to the console
	app.use(express.bodyParser()); 							// pull information from html in POST
});






//////////////// RESTful API ////////////////
// have to create get, post, and delete models for Jobs, Alerts, Tools, and Member/Participants


// Schemas will work for the associations with other collections
// READ TMRW
// http://mongoosejs.com/docs/populate.html


// Notes Model 
var Note = mongoose.model( 'Note', {
	message : { type: String }, 
	status : String, 
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
	tools : [ { type: Schema.Types.ObjectId, ref: 'Tool' } ], 
	notes : { type: String }, //[ { type: Schema.Types.ObjectId, ref: 'Note' } ], 
	status : String
})


// Tool Model 
var Tool = mongoose.model( 'Tool', {
	current_location : String, 
	home_location : String, 
	replacement_for : String, 
	status : String
})





//////////////// ROUTES ////////////////


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




app.get('/api/notes/:id', function( req, res, id ) {
	console.log( " the job ", jobs );
	//	var d = {
	//		t : "title"
	//	}
	//	res.json( d )
	//	console.log( "======== CALLED THE WROOOOOONG METHOD =======")
	//	console.log('jobs should have an id ' + req.params.id);
	//	var query = { '_id' : req.params.id };

	Note.findOne( query, function( err, item ) {
		console.log( "i am in the find one query function ", item );
		res.json( item );
	});

});



// Create a Note
app.post( '/api/notes', function( req, res ) {
	console.log(" ===== IN THE NOTES POST CALL ===== ", req.body ); 
	console.log(" =================" );

	var msg = req.body.note === undefined ? req.body.message : req.body.note.message;
	var j_id = req.body.id || req.body.job_id; 


	Note.create({ 
		message : msg,
		creator : "Admin",
		job_id : j_id,
		done : false
	}, function( err, note ) {
		if ( err ) { res.send( err ); console.log("Error creating / inserting appropriate note  |  line 57 : server.js") }; 
		console.log( note._id , " SHOULD HAVE THE NOTE ID"); 
		//		res.json( note ); 
		Note.find( { job_id : req.body.id }, function( err, notes ) {
			if ( err ) { res.send( err ); console.log("Error finding / getting appropriate note AFTER CREATING one |  line 60 : server.js") };
			res.json( notes ) // return all notes in the JSON format after we create another
		})
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









// Get Job With Id 
app.get('/api/jobs/:id', function( req, res ) {
	//	res.send('jobs should have an id ' + req.params.id);
	var query = { '_id' : req.params.id };

	Job.findOne( query, function( err, item ) {
		console.log( "i am in the find one query function ", item );
		res.json( item );
	});

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



// Get Job With Id 
app.post('/api/jobs', function( req, res ) {
	//	res.send('jobs should have an id ' + req.params.id);
	var query = { '_id' : req.params.id };

	Job.findOne( query, function( err, item ) {
		console.log( "i am in the find one query function ", item );
		res.json( item );
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
app.post( '/api/jobs', function( req, res ) {
	////////////////// SET THIS UP ////////////////// 

	Job.create({ 
		title: req.body.title,
		members: req.body.members || "",
		created: Date.now,
		creator: "Admin", // have to change this to member_id or something like that
		done : false
	}, function( err, job ) {
		if ( err ) { res.send( err ); console.log("Error creating / inserting appropriate job  |  line 133 : server.js") }; 

		Job.find( function( err, jobs ) {
			if ( err ) { res.send( err ); console.log("Error finding / getting appropriate job AFTER CREATING one |  line 136 : server.js") };
			res.json( jobs ) // return all notes in the JSON format after we create another
		})
	})
}); 


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


// listen (start app with node server.js) ======================================
app.listen(3000, "localhost");
//console.log( "commonnn   ", app.get('port') );
console.log("App listening on port 3000");