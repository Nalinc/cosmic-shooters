/**************************************************
** NODE.JS REQUIREMENTS
**************************************************/
var express = require('express')
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var Player = require("./Player").Player;	// Player class



app.set('port', (process.env.PORT || 8000))
app.use(express.static(__dirname + '/public/'));

app.get('/', function(request, response) {
  response.render('index.html')
})

/**************************************************
** GAME VARIABLES
**************************************************/
var socket,		// Socket controller
	players;	// Array of connected players


/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
	// Create an empty array to store players
	players = [];

	server.listen(app.get('port'), function() {
	  console.log("Node app is running at localhost:" + app.get('port'))
	})

	io.on('connection',onSocketConnection);

};


/**************************************************
** GAME EVENT HANDLERS
**************************************************/

// New socket connection
function onSocketConnection(client) {
	console.log("New player has connected: "+client.id);

	// Listen for client disconnected
	client.on("disconnect", onClientDisconnect);

	// Listen for new player message
	client.on("new player", onNewPlayer);

	// Listen for move player message
	client.on("move player", onMovePlayer);
};

// Socket client has disconnected
function onClientDisconnect() {
	console.log("Player has disconnected: "+this.id);

	var removePlayer = playerById(this.id);

	// Player not found
	if (!removePlayer) {
		console.log("Player not found: "+this.id);
		return;
	};

	// Remove player from players array
	players.splice(players.indexOf(removePlayer), 1);

	// Broadcast removed player to connected socket clients
	this.broadcast.emit("remove player", {id: this.id});
};

// New player has joined
function onNewPlayer(data) {

	var shiptype = Math.floor(Math.random() * 9) + 0 ;
	// Create a new player
	var newPlayer = new Player(data.x, data.y, data.type);
	newPlayer.id = this.id;

	// Broadcast new player to connected socket clients
	this.broadcast.emit("new player", {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY(), angle: newPlayer.getAngle(), type: newPlayer.getType()});

	// Send existing players to the new player
	var i, existingPlayer;
	for (i = 0; i < players.length; i++) {
		existingPlayer = players[i];
		this.emit("new player", {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY(), angle: existingPlayer.getAngle(), type: existingPlayer.getType()});
	};
		
	// Add new player to the players array
	players.push(newPlayer);
};

// Player has moved
function onMovePlayer(data) {
	// Find player in array
	var movePlayer = playerById(this.id);

	// Player not found
	if (!movePlayer) {
		console.log("Player not found: "+this.id);
		return;
	};

	// Update player position
	movePlayer.setX(data.x);
	movePlayer.setY(data.y);
	movePlayer.setAngle(data.angle);
	movePlayer.setType(data.type);
	// Broadcast updated position to connected socket clients
	this.broadcast.emit("move player", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY(), angle: movePlayer.getAngle(), type: movePlayer.getType(), isFiring: data.isFiring});
};


/**************************************************
** GAME HELPER FUNCTIONS
**************************************************/
// Find player by ID
function playerById(id) {
	var i;
	for (i = 0; i < players.length; i++) {
		if (players[i].id == id)
			return players[i];
	};
	
	return false;
};


/**************************************************
** RUN THE GAME
**************************************************/
init();