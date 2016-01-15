// information about window and cursor
var width, height, center;
var mouseX, mouseY;

// canvas and context
var canvas, ctx;

// environment
var movers;
var air;
var liquid;
var wind;
var gravity;

// framerate
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

	// initialize mouse position 
	// in case its used immediately
	mouseX = center.x;
	mouseY = center.y;

	// keep track of mouse position
	document.addEventListener("mousemove", onMouseMove, false);

	// create movers
	movers = [];

	// initialize movers
	for(var i = 1; i <= 5; i++) {
		movers[i - 1] = new Mover(randomMintoMax(20, 45), i * 120, 50);
	}

	// wind, gravity, liquid
	liquid = new Fluid(0, height/2, width, height/2, 2.35);
	air = new Fluid(0, 0, width, height/2, .06);
	air.fillStyle = "rgba(255, 255, 255, 0)";

	// redraw at 1000 fps
	setInterval(update, 1000/fps);
};

function update() {
	ctx.clearRect(0, 0, width, height);
	for(var i = 0; i < movers.length; i++) {

		wind = new Vector(0.0, 0);
		gravity = new Vector(0, .24 * movers[i].mass);

		if(movers[i].isInside(liquid)) {
			movers[i].drag(liquid);
		} else {
			movers[i].drag(air);
		}

		movers[i].applyForce(wind);
		movers[i].applyForce(gravity);

		movers[i].update();
		movers[i].checkEdges();
		movers[i].display();
	}
	
	air.display();
	liquid.display();
};

function Mover(m, x, y) {
	this.location = new Vector(x, y);
	this.velocity = new Vector(0, 0);
	this.acceleration = new Vector(0, 0);
	this.mass = m;

	this.update = function() {
		this.velocity.add(this.acceleration);
		this.location.add(this.velocity);
		this.acceleration.mult(0);
	};

	this.display = function() {
		ctx.fillStyle = "rgb(200, 0, 0)";
		ctx.beginPath();
		ctx.arc(this.location.x, this.location.y, this.mass, 0, 2 * Math.PI, false);
		ctx.fill();
		ctx.lineWidth = 3;
		ctx.strokeStyle = "rgb(100, 100, 100)";
		ctx.stroke();
	};

	this.checkEdges = function() {
		if(this.location.x > width) {
			this.location.x = width;
			this.velocity.x *= -1;
		} else if(this.location.x < 0) {
			this.location.x = 0;
			this.velocity.x *= -1;
		}

		if (this.location.y > height) {
			this.location.y = height;
			this.velocity.y *= -1;
		}
	};

	// net force = mass * accceleration
	// or 
	// acceleration = net force / mass
	// for now, mass = 1
	this.applyForce = function(force) {
		var f = Vector.div(force, this.mass);
		this.acceleration.add(f);
	};

	// check if inside a certain fluid
	this.isInside = function(fluid) {
		if(	this.location.x > fluid.x &&
			this.location.x < fluid.x + fluid.w &&
			this.location.y > fluid.y &&
			this.location.y < fluid.y + fluid.h) {
			return true;
		} else {
			return false;
		}
	};

	this.drag = function(fluid) {
		var speed = this.velocity.mag();
		var dragMag = fluid.c * speed * speed;

		var drag = this.velocity.deepCopy();
		drag.mult(-1);
		drag.normalize();
		drag.mult(dragMag);

		this.applyForce(drag);
	};
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