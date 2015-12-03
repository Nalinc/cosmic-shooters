/**************************************************
** GAME VARIABLES
**************************************************/
var canvas,			// Canvas DOM element
	bgimg,
	room,
	camera,
	ctx,			// Canvas rendering context
	keys,			// Keyboard input
	localPlayer,	// Local player
	bullet,
	quadTree,
	remotePlayers,	// Remote players
	socket;			// Socket connection


/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
	// Declare the canvas and rendering context
	canvas = document.getElementById("gameCanvas");
	ctx = canvas.getContext("2d");

	// Maximise the canvas
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	var shipTypes= ['A','B','C','D','E','F','G','H','I','J']
	//ship=document.createElement("img");
	//ship.src="images/A.png";
//	ship.src="ships/"+shipTypes[remotePlayers.length]+".png";

	bgimg = new Image();
	bgimg.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAADMCAMAAAAI/LzAAAAAyVBMVEUAAAAxMTEhISEQEBAVFRUICAgtLS0cHBwEBAQkJCQnJyc4ODhXV1cpKSkgICAMDAxGRkZMTEw8PDxAQEAZGRloaGjHx8dhYWGHh4d0dHRbW1s5OTlsbGzW1tYQEAWXl5cdHQp+fn6mpqYxMTghIQuYmJi4uLhbAAB+AABHAAA2AAAuAACMjIwgAABCAAAZAABYWB1NTRpFRRdjYyF5eSg7OxT8/PwvLxCsrKxUVBw+PhWPjzrAwMDi4uIoKA1oAACOAACxAABmZjjxfKCEAAAEY0lEQVR4Ae3d21fbuBbH8a8s+eL4HjsEaLhAgdOew5mhlDZtp+1c/v8/al6mQxckwU58kRV93vOglWRZ3vppbxqK6UsxZbPLGTu6oS9lzoj5DubIJJYpJgJzhB7bERUDOcjpWuywWf6VTSqJOfKYWr7fMxAVU1cYUcvVF16WKNoX+AxCugwhTtmSytDNdcSWnIo9E9CAYo2AXQQB7RCK+k5YzfdYQ1BDmjAKBa2TOebIBDV5Id2oBH1TsWCkrAO68EDXXFYQdOGcrgmXIVWHF5LhLO9pUXV9phjO1ZIWBaETYFmbeRjE54kInfmCJlw68A1rZH+3IEIPfocVgdLulFurIsU5o1HEbDaLGVLhUZ+fMGK+h27iAnPMY/bO58+0QBQ84yTobJpijuuCRqwZ1t5IhV2MZVnWYAqHoYQuLTvL6UIY8KLUpR+lYCdOgD4qiWnOHxjUhw88cUZPSknLlkueOKQnUcZz1rRkBKrEpYbZES24o1uTWUpv3tEtt3LRUl6yh3y6keh0avjphJ04aERM7c9xpfAYvXjB9pnf6JZxiviJla0N6p+esso0H8l3O+eR/OueRhZzzFGUmGhKe1yXR0Ixak6IZSwhWelAsRslaOLPN2zmZttnIVP+dXNM9/74nRUWDj94xxmNBCl6ufX4ocozGnEnjJPlYJAESwtpTBumaCGgoS9X9G5KR+6/07t80EhWFtGhIEIXy00X8aOQJqKQYT1suul5e0wTt3NGQWCQCp3IAnMkn1jBsiZhb9cGLZliDumzjrikjgOBZtQJz6gcjWQRIzVhRL6yWciIFIyTUFh15Eae2zkpO0kc9JFl7A3LkhGW9RLvdQ/5q4nfT+Dr9W9PViPZ3qRQrJK5rCfrdEB1qeW1oDWXHwt2NElZQQp6t7hwMVIZYQ6ZMS5lgTmOj7B6OTrPPPQVSBp5dVPjKWCMKGFXjsIcKqNdC/6RqbZiFRWD83JaMmcnmSMxhjqO0FweUZOb+GjODdBD5mMO6WCNiwh5kQyooebHf/0/nbmd8SJPsguR8ZO3/2FvzbaKgUYuQyhuACA0qaJ9zJj87xd0FFZbLeatLTsNGNQQAuC/aMoPX5gvPLng0dERwBsA6aMdsWCzycV48mZZQr8UbZoyKIFl6e3hnHqSnM2Wp/RAVbSguGWzuyXtUDespxSjEuQMY55hKCV4Rjm1h5aedTMbPac1k5K6DlnD8Vhl+Z46pozB6RXNWB8xyCU1OJJazuboIhCs4Wf13gBEijYkjZywbzyBOcKQ4Xy449H1nFE7PeeRV9GlIsIcFzHWaAlJ7wIfc7gJ/bsMaOw9mlrQ3D3de3eHeZzQoCaPntB1B3hxiDmUojvlAT1IA8yRBIzZ7BJzuJKaSjrnxWbMpsYqp9Q3wyABqyhJDy6PaCDcdm5MKfRvdhq3ONHnaMGwPNpTvmIwluPVn3/mObzskOGEgp+d7Zrr5ow9842WvUowx+GcdoS04GJhUOewSDB2fwMOKSl0ZnXlcAAAAABJRU5ErkJggg==';
	// Initialise keyboard controls
	keys = new Keys();

	gyro.startTracking(function(o) {
		if(o.x==null){
			motionDetect.x=0;
			motionDetect.y=0;
		}
		else
			motionDetect = o;
	});

	quadTree = new QuadTree({x:0,y:0,width:canvas.width,height:canvas.height});

	// setup an object that represents the room
	room = {
		width: 5000,
		height: 3000,
		map: new Game.Map(5000, 3000)
	};
	
	// generate a large image texture for the room
	room.map.generate();


	// Calculate a random start position for the local player
	// The minus 5 (half a player size) stops the player being
	// placed right on the egde of the screen
	var startX = Math.round(Math.random()*(canvas.width/2)),
		startY = Math.round(Math.random()*(canvas.height/2));

	var shiptype = Math.floor(Math.random() * 9) + 0 ;
	// Initialise the local player
	localPlayer = new Game.Player(startX, startY, null, shiptype,'player');

	// setup the magic camera !!!
	camera = new Game.Camera(0, 0, canvas.width, canvas.height, room.width, room.height);		
	camera.follow(localPlayer, canvas.width/2, canvas.height/2);

	// Initialise socket connection
	socket = io.connect('http://localhost:8000');

	// Initialise remote players array
	remotePlayers = [];

	// Start listening for events
	setEventHandlers();
};


/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function() {
	// Keyboard
	window.addEventListener("keydown", onKeydown, false);
	window.addEventListener("keyup", onKeyup, false);

	var el = document.getElementById("gameCanvas");
	el.addEventListener("touchstart", function(){
		localPlayer.fireTap = true;
	}, false);
	el.addEventListener("touchend", function(){
		localPlayer.fireTap = false;
	}, false);	

	// Window resize
	window.addEventListener("resize", onResize, false);

	// Socket connection successful
	socket.on("connect", onSocketConnected);

	// Socket disconnection
	socket.on("disconnect", onSocketDisconnect);

	// New player message received
	socket.on("new player", onNewPlayer);

	// Player move message received
	socket.on("move player", onMovePlayer);

	// Player removed message received
	socket.on("remove player", onRemovePlayer);
};

// Keyboard key down
function onKeydown(e) {
	if (localPlayer) {
		keys.onKeyDown(e);
	};
};

// Keyboard key up
function onKeyup(e) {
	if (localPlayer) {
		keys.onKeyUp(e);
	};
};

// Browser window resize
function onResize(e) {
	// Maximise the canvas
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
};

// Socket connected
function onSocketConnected() {
	console.log("Connected to socket server");

	// Send local player data to the game server
	socket.emit("new player", {x: localPlayer.getX(), y: localPlayer.getY(), angle: localPlayer.getAngle(), type: localPlayer.getShipType()});
};

// Socket disconnected
function onSocketDisconnect() {
	console.log("Disconnected from socket server");
};

// New player
function onNewPlayer(data) {
	console.log("New player connected: "+data.id);
	// Initialise the new player
	console.log(data.type);
	var newPlayer = new Game.Player(data.x, data.y, data.angle, data.type,'enemy');
	newPlayer.id = data.id;

	// Add new player to the remote players array
	remotePlayers.push(newPlayer);
};

// Move player
function onMovePlayer(data) {
	var movePlayer = playerById(data.id);
	console.log(movePlayer)
	// Player not found
	if (!movePlayer) {
		console.log("Player not found: "+data.id);
		return;
	};
	// Update player position
	movePlayer.setX(data.x);
	movePlayer.setY(data.y);
	movePlayer.setAngle(data.angle);
	movePlayer.setShipType(data.type);

	if(data.isFiring){
		movePlayer.fire(movePlayer.getX()-camera.xView,movePlayer.getY()-camera.yView,movePlayer.getAngle());
	}
};

// Remove player
function onRemovePlayer(data) {
	var removePlayer = playerById(data.id);

	// Player not found
	if (!removePlayer) {
		console.log("Player not found: "+data.id);
		return;
	};

	// Remove player from array
	remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
};


function detectCollision() {
	var objects = [];
	quadTree.getAllObjects(objects);

	for (var x = 0, len = objects.length; x < len; x++) {
		quadTree.findObjects(obj = [], objects[x]);

		for (y = 0, length = obj.length; y < length; y++) {

			// DETECT COLLISION ALGORITHM
			if (objects[x].collidableWith === obj[y].type &&
				(objects[x].x < obj[y].x + obj[y].width &&
			     objects[x].x + objects[x].width > obj[y].x &&
				 objects[x].y < obj[y].y + obj[y].height &&
				 objects[x].y + objects[x].height > obj[y].y))
			{
				objects[x].isColliding = true;
				objects[x].alive = false;
				obj[y].alive = false;
				obj[y].isColliding = true;
			}
		}
	}
};

/**************************************************
** GAME ANIMATION LOOP
**************************************************/
function animate() {
	update();
	draw();

	// Request a new animation frame using Paul Irish's shim
	window.requestAnimFrame(animate);
};


/**************************************************
** GAME UPDATE
**************************************************/
function update() {
	// Update local player and check for change
	if (localPlayer.update(keys, room.width, room.height)) {
		camera.update();
		// Send local player data to the game server
		socket.emit("move player", {x: localPlayer.getX(), y: localPlayer.getY(), angle: localPlayer.getAngle(), type: localPlayer.getShipType(), isFiring: localPlayer.isFiring});
	};
};


/**************************************************
** GAME DRAW
**************************************************/
function draw() {

	// Insert objects into quadtree
	quadTree.clear();
	quadTree.insert(localPlayer);
	quadTree.insert(localPlayer.bulletPool.getPool());
	quadTree.insert(remotePlayers);


	// Wipe the canvas clean
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// redraw all objects
	room.map.draw(ctx, camera.xView, camera.yView);		

	// Draw the local player
	if(!localPlayer.isColliding)
		localPlayer.draw(ctx, camera.xView, camera.yView);

	localPlayer.bulletPool.animate(ctx,camera.xView, camera.yView);
    ctx.restore();

	// Draw the remote players
	var i;
	for (i = 0; i < remotePlayers.length; i++) {
		quadTree.insert(remotePlayers[i].bulletPool.getPool());
		if(!remotePlayers[i].isColliding)
			remotePlayers[i].draw(ctx,camera.xView, camera.yView);
			remotePlayers[i].bulletPool.animate(ctx,camera.xView, camera.yView);
	};
	detectCollision();

};


/**************************************************
** GAME HELPER FUNCTIONS
**************************************************/
// Find player by ID
function playerById(id) {
	var i;
	for (i = 0; i < remotePlayers.length; i++) {
		if (remotePlayers[i].id == id)
			return remotePlayers[i];
	};
	
	return false;
};