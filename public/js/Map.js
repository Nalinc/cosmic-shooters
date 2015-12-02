// wrapper for our game "classes", "methods" and "objects"
window.Game = {};
window.	motionDetect= {};

// wrapper for "class" Rectangle
(function(){
	function Rectangle(left, top, width, height){
		this.left = left || 0;
		this.top = top || 0;
	    this.width = width || 0;
		this.height = height || 0;
		this.right = this.left + this.width;
		this.bottom = this.top + this.height;
	}

	Rectangle.prototype.set = function(left, top, /*optional*/width, /*optional*/height){
		this.left = left;
	    this.top = top;
	    this.width = width || this.width;
	    this.height = height || this.height
	    this.right = (this.left + this.width);
	    this.bottom = (this.top + this.height);
	}

	Rectangle.prototype.within = function(r) {
		return (r.left <= this.left && 
				r.right >= this.right &&
				r.top <= this.top && 
				r.bottom >= this.bottom);
	}		

	Rectangle.prototype.overlaps = function(r) {
		return (this.left < r.right && 
				r.left < this.right && 
				this.top < r.bottom &&
				r.top < this.bottom);
	}

// add "class" Rectangle to our Game object
Game.Rectangle = Rectangle;

})();


// wrapper for "class" Map
(function(){
	function Map(width, height){
		// map dimensions
		this.width = width;
		this.height = height;
		
		// map texture
		this.image = null;
	}

	// generate an example of a large map
	Map.prototype.generate = function(){
		var ctx = document.createElement("canvas").getContext("2d");		
		ctx.canvas.width = this.width;
		ctx.canvas.height = this.height;		
		
		var rows = ~~(this.width/44) + 1;
		var columns = ~~(this.height/44) + 1;

	    var ptrn = ctx.createPattern(bgimg, 'repeat'); // Create a pattern with this image, and set it to "repeat".
	    ctx.fillStyle = ptrn;
		var color = "red";				
		ctx.save();			
//		ctx.fillStyle = "red";		    
		for (var x = 0, i = 0; i < rows; x+=44, i++) {
			ctx.beginPath();			
			for (var y = 0, j=0; j < columns; y+=44, j++) {            
			    ctx.fillRect(x,y,40,40);		
			}
	//		color = '#454545'//(color == "red" ? "blue" : "red");
		//	ctx.fillStyle = color;
		//	ctx.fill();
			ctx.closePath();			
		}		
		ctx.restore();	
		
		// store the generate map as this image texture
		this.image = new Image();
		this.image.src = ctx.canvas.toDataURL("image/png");					
		
		// clear context
		ctx = null;
	}

	// draw the map adjusted to camera
	Map.prototype.draw = function(context, xView, yView){					
		// easiest way: draw the entire map changing only the destination coordinate in canvas
		// canvas will cull the image by itself (no performance gaps -> in hardware accelerated environments, at least)
		//context.drawImage(this.image, 0, 0, this.image.width, this.image.height, -xView, -yView, this.image.width, this.image.height);
		
		// didactic way:
		
		var sx, sy, dx, dy;
	    var sWidth, sHeight, dWidth, dHeight;
		
		// offset point to crop the image
		sx = xView;
		sy = yView;
		
		// dimensions of cropped image			
		sWidth =  context.canvas.width;
		sHeight = context.canvas.height;

		// if cropped image is smaller than canvas we need to change the source dimensions
		if(this.image.width - sx < sWidth){
			sWidth = this.image.width - sx;
		}
		if(this.image.height - sy < sHeight){
			sHeight = this.image.height - sy; 
		}
		
		// location on canvas to draw the croped image
		dx = 0;
		dy = 0;
		// match destination with source to not scale the image
		dWidth = sWidth;
		dHeight = sHeight;									
		
		context.drawImage(this.image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);			
	}

// add "class" Map to our Game object
Game.Map = Map;
})();
