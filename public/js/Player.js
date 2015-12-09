/**************************************************
** GAME PLAYER CLASS
**************************************************/
var particles = [];

/**
 * Creates the Bullet object which the ship fires. The bullets are
 * drawn on the "main" canvas.
 */
 (function(){
	function Bullet(type) {

		this.width = 10;
		this.height = 10;
		this.angle= 5;
		this.alive = false; // Is true if the bullet is currently in use
		this.count = 0;
		this.speed=  3;
		this.isColliding = false;
		this.type=type || 'playerbullet';
		this.collidableWith = (type=='enemybullet')?'player':'enemy';
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
		this.y -= this.speed * Math.cos(this.angle/180*Math.PI);
		this.x += this.speed * Math.sin(this.angle/180*Math.PI);
		if (this.y <= 0 - this.height) {
			return true;
		}
		else {
			ctx.save();
//	    	ctx.translate(localPlayer.x,localPlayer.y);
			ctx.fillStyle = '#ff0000';
			ctx.fillRect(this.x,this.y,5,5); 
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
		this.init = function(type) {
			console.log(type)
			var bullettype = (type=='player')?'playerbullet':'enemybullet';
			for (var i = 0; i < size; i++) {
				// Initalize the bullet object
				var bullet = new Game.Bullet(bullettype); //x,y,width,height,type
				pool[i] = bullet;
			}
		};
		/*
		 * Grabs the last item in the list and initializes it and
		 * pushes it to the front of the array.
		 */
		this.get = function(angle, x, y, speed) {
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
					this.get(angle, x1, y1, speed1);
					this.get(angle, x2, y2, speed2);
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
		this.getPool = function() {
			var obj = [];
			for (var i = 0; i < size; i++) {
				if (pool[i].alive) {
					obj.push(pool[i]);
				}
			}
			return obj;
		}		
	}
	Game.Pool = Pool;
})();

(function(){
/*
 * A single explosion particle
 */
	function Particle (){
		this.scale = 1.0;
		this.x = 0;
		this.y = 0;
		this.radius = 20;
		this.color = "#000";
		this.velocityX = 0;
		this.velocityY = 0;
		this.scaleSpeed = 0.5;

		this.update = function(){
			// shrinking
			this.scale -= this.scaleSpeed * 1000/(1000*60);

			if (this.scale <= 0)
			{
				this.scale = 0;
			}
			// moving away from explosion center
			this.x += this.velocityX * 1000/(1000*60);
			this.y += this.velocityY * 1000/(1000*60);
		};

		this.draw = function(context2D)
		{
			// translating the 2D context to the particle coordinates
			context2D.save();
			context2D.translate(this.x, this.y);
			context2D.scale(this.scale, this.scale);

			// drawing a filled circle in the particle's local space
			context2D.beginPath();
			context2D.arc(0, 0, this.radius, 0, Math.PI*2, true);
			context2D.closePath();

			context2D.fillStyle = this.color;
			context2D.fill();

			context2D.restore();
		};
	}	
	Game.Particle = Particle;
})();

(function(){
	/*
	 * Advanced Explosion effect
	 * Each particle has a different size, move speed and scale speed.
	 * 
	 * Parameters:
	 * 	x, y - explosion center
	 * 	color - particles' color
	 */
	function randomFloat (min, max){
		return min + Math.random()*(max-min);
	}
	Game.randomFloat = randomFloat;

	function createExplosion(x, y, color){
		var minSize = 10;
		var maxSize = 30;
		var count = 10;
		var minSpeed = 60.0;
		var maxSpeed = 200.0;
		var minScaleSpeed = 1.0;
		var maxScaleSpeed = 4.0;

		for (var angle=0; angle<360; angle += Math.round(360/count))
		{
			var particle = new Game.Particle();

			particle.x = x;
			particle.y = y;

			particle.radius = Game.randomFloat(minSize, maxSize);

			particle.color = color;

			particle.scaleSpeed = Game.randomFloat(minScaleSpeed, maxScaleSpeed);

			var speed = Game.randomFloat(minSpeed, maxSpeed);

			particle.velocityX = speed * Math.cos(angle * Math.PI / 180.0);
			particle.velocityY = speed * Math.sin(angle * Math.PI / 180.0);

			particles.push(particle);
		}
	}	
	Game.createExplosion = createExplosion;
})();


// wrapper for "class" Player
(function(){
	function Player(x, y, orientation, shiptype, type){
		// (x, y) = center of object
		// ATTENTION:
		// it represents the player position on the world(room), not the canvas position
		this.x = x;
		this.y = y;
		this.ship = new Image();
		this.shipType= shiptype;
		this.bulletPool = new Game.Pool(30);
		this.bulletPool.init(type);
		this.fireRate = 15;
		this.counter = 0;
		this.isFiring = false;
		this.fireTap = false;
		this.isColliding = false;
		this.type= type;
		this.collidableWith = (type=='player')?'enemybullet':'playerbullet'

		this.angle = this.orientation || 1;
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

		this.getShipType = function() {
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

		this.setShipType = function(newType) {
			this.shipType = newType;
		};

		this.fire = function(xcord, ycord, direction) {
			console.log('fire fire')
			this.bulletPool.get(direction, xcord, ycord , 3);
//			this.bulletPool.getTwo(direction, xcord-20, ycord , 3, xcord+20, ycord, 3);			
		};
		this.moveForward = function(){
			if(this.y <= 34)
				this.y = 35;
			else
				this.y -= this.	moveAmount * Math.cos(this.angle/180*Math.PI);					
			if(this.x<=34)
				this.x= 35;
			else
				this.x += this.	moveAmount * Math.sin(this.angle/180*Math.PI);			
		};

		this.moveBackward = function(){
			if(this.y <= 34)
				this.y = 35;
			else
				this.y += this.	moveAmount * Math.cos(this.angle/180*Math.PI);
			if(this.x<=34)
				this.x= 35;
			else
				this.x -= this.	moveAmount * Math.sin(this.angle/180*Math.PI);
		};

		this.rotateRight = function(){
			this.angle += this.	moveAmount;
			if(this.angle>=360)
				this.angle = 0;
			this.angle += this.	moveAmount;			
		};

		this.rotateLeft = function(){
			this.angle -= this.	moveAmount;
			if(this.angle<=0)
				this.angle = 360;			
			this.angle -= this.	moveAmount;
		}


	}
	
	Player.prototype.update = function(step, worldWidth, worldHeight){
			var prevX = this.x,
				prevY = this.y,
				prevAngle = this.angle;
			this.isFiring = false;
				
			this.counter++;
			// Up key takes priority over down
			if (keys.up ||  motionDetect.x < -5 || motionDetect.x > 5)
				this.moveForward();
			else if (keys.down)
				this.moveBackward();

			// Left key takes priority over right
			if (keys.left ||  motionDetect.y < -2)
				this.rotateLeft();
			else if (keys.right || motionDetect.y > 2)
				this.rotateRight();

			if ((keys.space || this.fireTap) && this.counter >= this.fireRate) {
				console.log('fire');
				this.fire(this.x-camera.xView, this.y-camera.yView, this.angle);
				this.counter = 0;
				this.isFiring = true;
			}
			if(this.isColliding){
//				alert('player collision')
			}
			return (prevX != this.x || prevY != this.y || prevAngle != this.angle || this.isFiring) ? true : false;
	}
	
	Player.prototype.draw = function(context, xView, yView){		
		// draw a simple rectangle shape as our player model

		context.save();
    	context.translate((this.x-32) - xView+32, (this.y-32) - yView+32);
		context.rotate(Math.PI / 180 * (this.angle));
//		context.fillStyle = 'red'
//		context.fillRect(-this.ship.width/2,-this.ship.height/2,64,64)
		context.drawImage(this.ship,-32,-32,64,64);
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


