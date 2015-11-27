var transMatrix = [1,0,0,1,0,0];
var rotMatrix  = [0,60,60];	
var upBtn = document.getElementById('arrow-up');
var downBtn = document.getElementById('arrow-down');
var leftBtn = document.getElementById('arrow-left');
var rightBtn = document.getElementById('arrow-right');
var mapMatrix = document.getElementById("obj");

upBtn.addEventListener("click", function(){
	pan(0,-10);
});

downBtn.addEventListener("click", function(){
	pan(0,10);
});

leftBtn.addEventListener("click", function(){
	rot(-10,0,-10)
//	pan(-10,0);
});

rightBtn.addEventListener("click", function(evt){

	rot(10,0,10);
//	pan(10,0);
});



function pan(dx, dy){
  transMatrix[4] += dx;
  transMatrix[5] += dy;
            
  newMatrix = "matrix(" +  transMatrix.join(' ') + ")" + " rotate("+rotMatrix.join(' ') + ")";
  mapMatrix.setAttribute("transform", newMatrix);
}

function rot(dx, dy, deg){

  transMatrix[4] += dx;
  transMatrix[5] += dy;
  rotMatrix[0] += deg;

  newMatrix = "matrix(" +  transMatrix.join(' ') + ")" + " rotate("+rotMatrix.join(' ') + ")" ;
//	newMatrix = "translate(100, 100) rotate(45 60 60)";
//	newMatrix = "matrix(" +  transMatrix.join(' ') + ")";
//	newMatrix = "rotate(45 50 50)";
	mapMatrix.setAttribute("transform", newMatrix);
//	transform="translate(30) rotate(45 50 50)"
}

(function(){


})();
