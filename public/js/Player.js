/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(startX, startY) {
	var x = startX,
		y = startY,
		angle = 5,
		id,
		moveAmount = 2;
	
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

	var setX = function(newX) {
		x = newX;
	};

	var setY = function(newY) {
		y = newY;
	};

	var setAngle = function(newAngle) {
		angle = newAngle;
	};

	// Update player position
	var update = function(keys) {
		// Previous position
		var prevX = x,
			prevY = y;

		// Up key takes priority over down
		if (keys.up) {
			y -= moveAmount * Math.cos(angle/180*Math.PI);
			x += moveAmount * Math.sin(angle/180*Math.PI);
		} else if (keys.down) {
			y += moveAmount * Math.cos(angle/180*Math.PI);
			x -= moveAmount * Math.sin(angle/180*Math.PI);
		};

		// Left key takes priority over right
		if (keys.left) {
			angle -= moveAmount;
			if(angle<=0)
				angle = 360;			
			angle -= moveAmount;
		} else if (keys.right) {
			angle += moveAmount;
			if(angle>=360)
				angle = 0;
			angle += moveAmount;
		};

		return (prevX != x || prevY != y) ? true : false;
	};

	// Draw player
	var draw = function(ctx) {
    		ctx.save();
	    	ctx.translate(x+ship.width/2, y+ship.height/2);
			ctx.rotate(Math.PI / 180 * (angle));
			ctx.drawImage(ship,-ship.width/2,-ship.height/2,64,64)
			ctx.restore();
	};

	// Define which variables and methods can be accessed
	return {
		getX: getX,
		getY: getY,
		setX: setX,
		setY: setY,
		getAngle: getAngle,
		setAngle: setAngle, 
		update: update,
		draw: draw,
	}
};