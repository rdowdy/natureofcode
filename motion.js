var width, height, center;
var mouseX, mouseY;

var canvas, ctx;
var movers;

var fps = 60;

/* Initialization and Update functions */
function initVector() {
	// get canvas context
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");

	// store height and width of canvas
	width = canvas.width;
	height = canvas.height;
	center = new Vector(width/2, height/2);
	mouseX = center.x;
	mouseY = center.y;
	// keep track of mouse position
	document.addEventListener("mousemove", onMouseMove, false);

	// create movers
	movers = [];

	// initialize
	for(var i = 0; i < 20; i++) {
		movers[i] = new Mover();
	}

	// redraw at 1000 fps
	setInterval(update, 1000/fps);
};

function update() {
	ctx.clearRect(0, 0, width, height);
	for(var i = 0; i < movers.length; i++) {
		movers[i].update();
		movers[i].checkEdges();
		movers[i].display();
	}
};

function Mover() {
	this.location = new Vector(random0toMax(width), random0toMax(height));
	this.velocity = new Vector(0, 0);
	this.acceleration = new Vector(-.001, 0.01);
	this.topspeed = 10;

	this.update = function() {
		
		/*// using random acceleration 
		this.acceleration = Vector.random2D();
		// scale accel to range of [-2, 2]
		this.acceleration.mult(randomMintoMax(-2, 2));*/
		var mouse = new Vector(mouseX, mouseY);
		var x = Vector.sub(mouse, this.location);
		x.normalize();
		x.mult(0.8);
		this.acceleration = x;

		this.velocity.add(this.acceleration);
		this.limit(this.topspeed);
		this.location.add(this.velocity);
	};

	this.display = function() {
		ctx.fillStyle = "rgb(200, 0, 0)";
		ctx.beginPath();
		ctx.arc(this.location.x, this.location.y, 20, 0, 2 * Math.PI, false);
		ctx.fill();
		ctx.lineWidth = 3;
		ctx.strokeStyle = "rgb(100, 100, 100)";
		ctx.stroke();
	};

	this.checkEdges = function() {
		if(this.location.x > width) {
			this.location.x = 0;
		} else if(this.location.x < 0) {
			this.location.x = width;
		}

		if(this.location.y > height) {
			this.location.y = 0;
		} else if (this.location.y < 0) {
			this.location.y = height;
		}
	};

	this.limit = function(limit) {
		if(this.velocity.mag() > limit) {
			this.velocity.normalize();
			this.velocity.mult(limit);
		}
	}
};

function drawVector() {
	ctx.clearRect(0, 0, height * 2, width * 2);
	var mouse = new Vector(mouseX, mouseY);

	mouse.sub(center);

	mouse.normalize();
	mouse.mult(50);

	/* 
	// Display magnitude
	ctx.fillStyle = "(0, 0, 0)";
	var m = mouse.mag();
	ctx.fillRect(0, 0, m, 10);*/

	ctx.save();
	ctx.translate(center.x, center.y);
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(mouse.x, mouse.y);
	ctx.stroke();
	ctx.restore();
}