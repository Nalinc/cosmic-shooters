/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(nickname, startX, startY, type) {
	var nick = nickname,
		x = startX,
		y = startY,
		angle = 5,
		shipType = type,
		id;

	// Getters and setters
	var getX = function() {
		return x;
	};

	var getY = function() {
		return y;
	};

	var getAngle = function() {
		return angle;
	};
	
	var getType = function() {
		return shipType;
	};

	var getNick = function() {
		return nick;
	};

	var setX = function(newX) {
		x = newX;
	};

	var setY = function(newY) {
		y = newY;
	};

	var setAngle = function(newAngle) {
		angle = newAngle;
	};

	var setType = function(newType) {
		shipType = newType;
	};	

	// Define which variables and methods can be accessed
	return {
		getX: getX,
		getY: getY,
		getAngle: getAngle,
		getType: getType,
		getNick: getNick,
		setX: setX,
		setY: setY,
		setAngle: setAngle,
		setType: setType,
		id: id
	}
};

// Export the Player class so you can use it in
// other files by using require("Player").Player
exports.Player = Player;