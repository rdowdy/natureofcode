var width, height;
var mouseX, mouseY;

var walkerCanvas, walkerCtx
var walker;

var TOTAL_RANDOM = 0;
var TEND_RIGHT = 1;
var TEND_MOUSE = 2;

/* Initialization and Update functions */
function init() {
	// get walkerCanvas context
	walkerCanvas = document.getElementById("walkerCanvas");
	walkerCtx = walkerCanvas.getContext("2d");

	// store height and width of canvas
	width = walkerCanvas.width;
	height = walkerCanvas.height;
	// keep track of mouse position
	document.addEventListener("mousemove", onMouseMove, false);

	// instantiate the walker
	walker = new Walker(TOTAL_RANDOM);

	// redraw at 1000 fps
	setInterval(drawGaussian, 1000/5);
}

// take a step and then display it
function update() {
	walker.step();
	walker.display();
}

// draw a gaussian distribution
function drawGaussian() {
	var num = gaussian();
	var sd = 60;
	var mean = 320;

	var x = sd * num + mean;

	walkerCtx.fillStyle = "rgba(0, 100, 0, 0.1)";
	walkerCtx.fillRect(x, 90, 16, 16);
}

/* Walker class declaration and definition */
function Walker(tendency) {
	// walker class will take a step in some direction
	// based on some probability or pure randomness

	this.x = width / 2;
	this.y = height / 2;
	this.tendency = tendency || TOTAL_RANDOM;

	this.display = function() {
		walkerCtx.fillStyle = "rgb(200, 0, 0)";
		walkerCtx.fillRect(this.x,this.y,1,1);
	}

	this.step = function() {
		switch(this.tendency) {
			case TOTAL_RANDOM:
				totalRandom(this);
				break;
			case TEND_RIGHT:
				tendRight(this);
				break;
			case TEND_MOUSE:
				tendMouse(this);
				break;
			default:
				totalRandom(this);
		}
		this.x %= width;
		this.y %= height;
	}
}

/* Step generators */
function totalRandom(w) {
	var stepx = Math.floor((Math.random() * 3) - 1);
	var stepy = Math.floor((Math.random() * 3) - 1);

	w.x += stepx;
	w.y += stepy;
}

function tendRight(w) {
	var r = Math.random();

	if(r < 0.2) {
		w.x -= 1;
	} else if(r < 0.4) {
		w.y += 1;
	} else if(r < 0.6) {
		w.y -= 1;
	} else {
		w.x += 1;
	}
}

function tendMouse(w) {
	var r = Math.random();

	if(r < 0.5) {
		totalRandom(w);
	} else {
		if(mouseX > w.x) {
			w.x += 1;
		} else if(mouseX < w.x) {
			w.x -= 1;
		}

		if(mouseY > w.y) {
			w.y += 1;
		} else if(mouseY < w.y) {
			w.y -= 1;
		}
	}
}

// mouse move handler
function onMouseMove(event) {
	mouseX = event.clientX;
	mouseY = event.clientY;
}