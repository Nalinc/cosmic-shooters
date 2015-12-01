/**************************************************
** GAME PLAYER CLASS
**************************************************/

/**
 * Creates the Bullet object which the ship fires. The bullets are
 * drawn on the "main" canvas.
 */
 (function(){
	function Bullet() {

		this.width = 10;
		this.height = 10;
		this.angle= 5;
		this.alive = false; // Is true if the bullet is currently in use
		this.fire = new Image();
		this.fire.src="images/bullet.png";
		this.count = 0;
		this.speed=  3;
	}
	/*
	 * Sets the bullet values
	 */
	Bullet.prototype.spawn = function(x, y, angle, speed) {
		this.x = x;
		this.y = y;
		this.angle = angle;
		this.speed = speed;
		this.alive = true;
	};
	/*
	 * Uses a "drity rectangle" to erase the bullet and moves it.
	 * Returns true if the bullet moved off the screen, indicating that
	 * the bullet is ready to be cleared by the pool, otherwise draws
	 * the bullet.
	 */
	Bullet.prototype.draw = function(ctx, xView, yView) {
		ctx.clearRect(this.x, this.y, this.width, this.height);
//		this.y -= this.speed;
		this.y += this.speed * Math.cos(this.angle/180*Math.PI);
		this.x += this.speed * Math.sin(this.angle/180*Math.PI);
		if (this.y <= 0 - this.height) {
			return true;
		}
		else {
			ctx.save();
			ctx.drawImage(this.fire,this.x,this.y);
			ctx.restore();
//			ctx.drawImage(this.fire, localPlayer.x, localPlayer.y);
		}
	};
	/*
	 * Resets the bullet values
	 */
	Bullet.prototype.clear = function() {
		this.x = 0;
		this.y = 0;
		this.speed = 0;
		this.alive = false;
	};
	
	Game.Bullet = Bullet;

})();


/**
 * Custom Pool object. Holds Bullet objects to be managed to prevent
 * garbage collection.
 */
(function(){
	function Pool(maxSize) {
		var size = maxSize; // Max bullets allowed in the pool
		var pool = [];
		/*
		 * Populates the pool array with Bullet objects
		 */
		this.init = function() {
			for (var i = 0; i < size; i++) {
				// Initalize the bullet object
				var bullet = new Game.Bullet(0,0, 10, 10); //x,y,width,height
				pool[i] = bullet;
			}
		};
		/*
		 * Grabs the last item in the list and initializes it and
		 * pushes it to the front of the array.
		 */
		this.get = function(x, y, angle, speed) {
			if(!pool[size - 1].alive) {
				pool[size - 1].spawn(x, y, angle, speed);
				pool.unshift(pool.pop());
			}
		};
		/*
		 * Used for the ship to be able to get two bullets at once. If
		 * only the get() function is used twice, the ship is able to
		 * fire and only have 1 bullet spawn instead of 2.
		 */
		this.getTwo = function(angle, x1, y1, speed1, x2, y2, speed2) {
			if(!pool[size - 1].alive &&
			   !pool[size - 2].alive) {
					this.get(x1, y1, angle, speed1);
					this.get(x2, y2, angle, speed2);
				 }
		};
		/*
		 * Draws any in use Bullets. If a bullet goes off the screen,
		 * clears it and pushes it to the front of the array.
		 */
		this.animate = function(ctx, xView, yView) {
			for (var i = 0; i < size; i++) {
				// Only draw until we find a bullet that is not alive
				if (pool[i].alive) {
					if (pool[i].draw(ctx, xView, yView)) {
						pool[i].clear();
						pool.push((pool.splice(i,1))[0]);
					}
				}
				else
					break;
			}
		};
	}
	Game.Pool = Pool;
})();

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
		this.bulletPool = new Game.Pool(30);
		this.bulletPool.init();
		var fireRate = 15;
		var counter = 0;

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

		this.fire = function() {
			this.bulletPool.get(this.angle, 100, 100, 3);
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

			if (keys.space) {
				console.log('fire');
				this.fire();
				counter = 0;
			}

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


