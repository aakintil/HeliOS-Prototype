// JOBS	
var j1 = {
	title: "Replace Faulty Bolts",
	members: [ "Olga K.", "You" ],
	created: Date.now(),
	creator: "Olga K."
}

var j2 = {
	title: "Install Arcjet Manifolds",
	members: [ "Lisa D.", "You" ], 
	created: Date.now(), 
	creator: "Maggie M."
}

var j3 = {
	title: "Clean you Workplace",
	members: [ "You" ], 
	created: Date.now(),
	creator: "Adam M."
}

var j4 = {
	title: "", 
	members: [], 
	created: Date.now(), 
	creator:
}

	var j5 = {
	title: "", 
	members: [], 
	created: Date.now(), 
	creator:
}

var j6 = {
	title: "", 
	members: [], 
	created: Date.now(), 
	creator:
}

	var j7 = {
	title: "", 
	members: [], 
	created: Date.now(), 
	creator:
}

var j8 = {
	title: "", 
	members: [], 
	created: Date.now(), 
	creator:
}

	var j9 = {
	title: "", 
	members: [], 
	created: Date.now(), 
	creator:
}

var j10 = {
	title: "Clean Up Oil Spill" , 
	members: [], 
	created: Date.now(), 
	creator:
}

	//	+id: ObjectId("53bc97aa2c84000000000001")
	// super important! 
	var mpn = {
	_id: ObjectId("111111111111111111111111"),
	title: "My Personal Notes", 
	members: [], 
	created: Date.now(), 
	creator: "You"
}




// TOOLS
var list = [
	{
		name: "Clamp C8",
		current_location: "Mercury-1"
	},
	{
		name: "Screwdriver 42",
		current_location: "Mercury-2"
	},
	{
		name: "1/4 Inch Wrench",
		current_location: "Saturn-2"
	},
	{
		name: "Socket Set",
		current_location: "Venus-2"
	},
	{
		name: "Torque Wrench B93",
		current_location: "Pluto"
	},
	{
		name: "Torque Wrench A77",
		current_location: "Saturn-4"
	}
];

for ( var i in list) {
	db.tools.insert( list[ i ] ); 
}

// NOTES



// PEOPLE
var creators = [ "Olga K.", "Aderinsola A.", "Adam M.", "Maggie B.", "Lisa D.", "Kirsten Y.", "Christine O.", "Matt S.", "Alex E."]

var tz = {
	name: "Torque Wrench Z8", 
	current_location: "Saturn 3", 
	home_location: "Saturn 3", 
}

var tz9 = {
	name: "Torque Wrench Z9", 
	current_location: "Copy Room", 
	home_location: "Printer Room", 
	replacement_for: "Torque Wrench Z8"
}

var s67 = {
	name: "Screwdriver T67", 
	current_location: "Mercury 4", 
	home_location: "Venus 3", 
}

var s93 = {
	name: "Screwdriver T93", 
	current_location: "Saturn 4", 
	home_location: "Saturn 3", 	
}

