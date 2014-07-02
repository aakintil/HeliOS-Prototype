// Configure our application
// Connect to our database
// Create our Mongoose models
// Define routes for our RESTful API
// Define routes for our frontend Angular application
// Set the app to listen on a port so we can view it in our browser

// server.js

// =============== Set Up ==================
var express  = require('express');
var app      = express(); 								// create our app w/ express
var mongoose = require('mongoose'); 					// mongoose for mongodb

// configuration =================

//mongoose.connect('mongodb://node:node@mongo.onmodulus.net:27017/uwO3mypu'); 	// connect to mongoDB database on modulus.io
mongoose.connect( 'mongodb://localhost/HeliOS' ); 

app.configure(function() {
	app.use(express.static(__dirname + '/www')); 		// set the static files location /public/img will be /img for users
	app.use(express.logger('dev')); 						// log every request to the console
	app.use(express.bodyParser()); 							// pull information from html in POST
});






// =============== RESTful API ================

// Notes Model 
var Note = mongoose.model( 'Note', {
	text : String 
})


// == Routes ==


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
	// ===== SET THIS UP ===== 

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





app.get( '*', function( req, res ) {
	res.sendfile( 'www/index.html')
})


// listen (start app with node server.js) ======================================
app.listen(3000, "localhost");
//console.log( "commonnn   ", app.get('port') );
console.log("App listening on port 3000");