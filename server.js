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
	message : String, 
	status : String, 
	creator : String, 
	job : { type: Schema.Types.ObjectId, ref: 'Job' }
})

// Job Model 
var Job = mongoose.model( 'Job', {
	title : String, 
	members : String, 
	created : { type: Date, default: Date.now }, 
	creator : String, 
	tools : [ { type: Schema.Types.ObjectId, ref: 'Tool' } ], 
	note : [ { type: Schema.Types.ObjectId, ref: 'Note' } ]
})


// Tool Model 
var Tool = mongoose.model( 'Tool', {
	current_location : String, 
	home_location : String
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

// Create a Note
app.post( '/api/notes', function( req, res ) {

	// create a todo, information comes from AJAX request from Angular 
	////////////////// SET THIS UP ////////////////// 

	Note.create({ 
		text : req.body.text,
		done : false
	}, function( err, note ) {
		if ( err ) { res.send( err ); console.log("Error creating / inserting appropriate note  |  line 57 : server.js") }; 

		Note.find( function( err, notes ) {
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


//// JOBS //////
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

// Create a Note
app.post( '/api/jobs', function( req, res ) {

	// create a todo, information comes from AJAX request from Angular 
	////////////////// SET THIS UP ////////////////// 

	Job.create({ 
		title: req.body.title,
		members: req.body.members,
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


// Delete a Note 
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