/**************************************************
** GAME PLAYER CLASS
**************************************************/
/*(function(){

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
		var update = function(keys,  worldWidth, worldHeight) {
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
		var draw = function(ctx, xView, yView) {
	    		ctx.save();
		    	ctx.translate(x+ship.width/2, y+ship.height/2);
				ctx.rotate(Math.PI / 180 * (angle));
				ctx.drawImage(ship,-ship.width/2,-ship.height/2,64,64)
				ctx.restore();

//			ctx.save();		
//			ctx.fillStyle = "red";
//			// before draw we need to convert player world's position to canvas position			
//			ctx.fillRect((this.x-this.width/2) - xView, (this.y-this.height/2) - yView, this.width, this.height);
//			ctx.restore();
//
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

// add "class" Player to our Game object
Game.Player = Player;

})();

*/

// wrapper for "class" Player
(function(){
	function Player(x, y, orientation, type){
		// (x, y) = center of object
		// ATTENTION:
		// it represents the player position on the world(room), not the canvas position
		this.x = x;
		this.y = y;
		this.ship = new Image();
		this.shipType= type;
		this.angle = this.orientation || 5;
		this.id=''
		this.moveAmount = 2;
		
		var shipArray= ['A','B','C','D','E','F','G','H','I','J'];
		console.log(this.shipType)
		this.ship.src="images/"+shipArray[this.shipType]+".png";
		// move speed in pixels per second
		this.speed = 200;		
		
		// render properties
		this.width = 50;
		this.height = 50;

		// Getters and setters
		this.getX = function() {
			return this.x;
		};

		this.getY = function() {
			return this.y;
		};

		this.getAngle = function() {
			return this.angle;
		};

		this.getType = function() {
			return this.shipType;
		};		

		this.setX = function(newX) {
			this.x = newX;
		};

		this.setY = function(newY) {
			this.y = newY;
		};

		this.setAngle = function(newAngle) {
			this.angle = newAngle;
		};	

		this.setType = function(newType) {
			this.shipType = newType;
		};	

	}
	
	Player.prototype.update = function(step, worldWidth, worldHeight){
			var prevX = this.x,
				prevY = this.y;

			// Up key takes priority over down
			if (keys.up) {
				this.y -= this.	moveAmount * Math.cos(this.angle/180*Math.PI);
				this.x += this.	moveAmount * Math.sin(this.angle/180*Math.PI);
			} else if (keys.down) {
				this.y += this.	moveAmount * Math.cos(this.angle/180*Math.PI);
				this.x -= this.	moveAmount * Math.sin(this.angle/180*Math.PI);
			};

			// Left key takes priority over right
			if (keys.left) {
				this.angle -= this.	moveAmount;
				if(this.angle<=0)
					this.angle = 360;			
				this.angle -= this.	moveAmount;
			} else if (keys.right) {
				this.angle += this.	moveAmount;
				if(this.angle>=360)
					this.angle = 0;
				this.angle += this.	moveAmount;
			};

			return (prevX != this.x || prevY != this.y) ? true : false;
	}
	
	Player.prototype.draw = function(context, xView, yView){		
		// draw a simple rectangle shape as our player model

		context.save();
    	context.translate((this.x-this.width/2) - xView+this.ship.width/2, (this.y-this.height/2) - yView+this.ship.height/2);
		context.rotate(Math.PI / 180 * (this.angle));
		context.drawImage(this.ship,-this.ship.width/2,-this.ship.height/2,64,64);
		context.restore();

/*
		context.save();
		context.fillStyle = "white";
		// before draw we need to convert player world's position to canvas position			
		context.fillRect((this.x-this.width/2) - xView, (this.y-this.height/2) - yView, this.width, this.height);
		context.restore();			*/
	}
	
	// add "class" Player to our Game object
	Game.Player = Player;
	
})();