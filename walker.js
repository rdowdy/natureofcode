var width, height;
var mouseX, mouseY;

var walkerCanvas, walkerCtx
var walker;

var fps = 30;

var t = 0;

var TOTAL_RANDOM = 0;
var TEND_RIGHT = 1;
var TEND_MOUSE = 2;
var GAUSSIAN_WALK = 3;
var MONTE_CARLO = 4;
var PERLIN = 5;
var _2DPERLIN = 6;

/* Initialization and Update functions */
function initWalker() {
	walkerCtx.clearRect(0, 0, width, height);
	// get walkerCanvas context
	walkerCanvas = document.getElementById("canvas");
	walkerCtx = walkerCanvas.getContext("2d");

	// store height and width of canvas
	width = walkerCanvas.width;
	height = walkerCanvas.height;
	// keep track of mouse position
	document.addEventListener("mousemove", onMouseMove, false);

	// instantiate the walker
	walker = new Walker(PERLIN);

	// redraw at 1000 fps
	setInterval(update, 1000/fps);
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

// visualize 2-d perlin noise
function draw2DPerlin() {
	walkerCtx.clearRect(0, 0, width, height);
	noise.seed(Math.random());

	var red, green, blue;
	var xoff, yoff;
	//var id = walkerCtx.createImageData(1,1);
	//var d = id.data;

	xoff = 0.0;
	for (var x = 0; x < width; x++) {
		yoff = 0.0;
		for(var y = 0; y < height; y++) {
			red = Math.floor(map(noise.simplex2(xoff, yoff, t), 0, 1, 150, 255));
			green = Math.floor(map(noise.simplex2(xoff, yoff, t), 0, 1, 150, 255));
			blue = Math.floor(map(noise.simplex2(xoff, yoff, t), 0, 1, 150, 255));

			walkerCtx.fillStyle = 'rgba(' + red + ',' + green + ',' + blue + ',0.65)';
			walkerCtx.fillRect(x, y, 1, 1);

			//d[0] = red;
			//d[1] = green;
			//d[2] = blue;
			//d[3] = 1;
			//walkerCtx.putImageData(id, x, y);

			yoff += 0.005;
		}
		xoff += 0.005;
	}

	t += .006;

}

/* Walker class declaration and definition */
function Walker(tendency) {
	// walker class will take a step in some direction
	// based on some probability or pure randomness

	this.x = width / 2;
	this.y = height / 2;
	this.location = new Vector(width / 2, height / 2);
	this.tx = 0;
	this.ty = 10000;
	this.tendency = tendency || TOTAL_RANDOM;

	noise.seed(Math.random());

	this.display = function() {
		var radius;
		walkerCtx.fillStyle = "rgb(200, 0, 0)";
		if(this.tendency != PERLIN) {
			radius = 2;
		} else {
			radius = 8;
		}

		walkerCtx.fillStyle = "rgba(200, 0, 0, 0.2)";
		walkerCtx.beginPath();
		walkerCtx.arc(this.location.x, this.location.y, radius, 0, 2 * Math.PI, false);
		walkerCtx.fill();

	}

	this.step = function() {
		switch(this.tendency) {
			case TOTAL_RANDOM:
				totalRandom(this, false);
				break;
			case TEND_RIGHT:
				tendRight(this);
				break;
			case TEND_MOUSE:
				tendMouse(this);
				break;
			case GAUSSIAN_WALK:
				totalRandom(this, true);
				break;
			case MONTE_CARLO:
				monteCarloWalk(this);
				break;
			case PERLIN:
				perlinWalk(this);
				break;
			default:
				totalRandom(this);
		}
		this.location.x = ((this.location.x % width) + width) % width;
		this.location.y = ((this.location.y % height) + height) % height;
	}
}

/* Step generators */
function totalRandom(w, useGaussian) {
	var stepx = Math.floor((Math.random() * 3) - 1);
	var stepy = Math.floor((Math.random() * 3) - 1);
	var gauss = gaussian();

	var stepVector = new Vector(stepx, stepy);
	var gaussVector = new Vector(gauss, gauss);

	w.location.add(stepVector);

	if(useGaussian) {
		w.location.add(gaussVector);
	}
}

// TODO: change function name to variableStepSize
//		and determine stepsize by montecarlo or perlin noise
function monteCarloWalk(w) {
	//var stepsize = montecarlo("linear");
	var stepsize = map(noise.simplex2(w.tx, 1), 0, 1, 0, 6);
	w.tx += .008;

	var stepx = Math.random() * (2 * stepsize) - stepsize;
	var stepy = Math.random() * (2 * stepsize) - stepsize;
	var stepVector = new Vector(stepx, stepy);

	w.location.add(stepVector);
}

function perlinWalk(w) {
	var x = map(noise.simplex2(w.tx, 1), 0, 1, 0, width);
	var y = map(noise.simplex2(w.ty, 1), 0, 1, 0, height);
	var locationVector = new Vector(x, y);

	w.location = locationVector;

	w.tx += .008;
	w.ty += .008;
}

function tendRight(w) {
	var r = Math.random();

	if(r < 0.2) {
		w.location.x -= 1;
	} else if(r < 0.4) {
		w.location.y += 1;
	} else if(r < 0.6) {
		w.location.y -= 1;
	} else {
		w.location.x += 1;
	}
}

function tendMouse(w) {
	var r = Math.random();

	if(r < 0.5) {
		totalRandom(w);
	} else {
		if(mouseX > w.location.x) {
			w.location.x += 1;
		} else if(mouseX < w.location.x) {
			w.location.x -= 1;
		}

		if(mouseY > w.location.y) {
			w.location.y += 1;
		} else if(mouseY < w.location.y) {
			w.location.y -= 1;
		}
	}
}

// mouse move handler
function onMouseMove(event) {
	mouseX = event.clientX;
	mouseY = event.clientY;
}