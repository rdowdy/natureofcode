var canvas, ctx, width, height, walker;

function init() {
	canvas = document.getElementById("test");
	ctx = canvas.getContext("2d");

	width = canvas.width;
	height = canvas.height;

	walker = new Walker();

	setInterval(update, 1000/1000);
}

function update() {
	walker.step();
	walker.display();
}

function Walker() {
	this.x = width / 2;
	this.y = height / 2;

	this.display = function() {
		ctx.fillStyle = "rgb(200, 0, 0)";
		ctx.fillRect(this.x,this.y,1,1);
	}

	this.step = function() {
		var stepx = Math.floor((Math.random() * 3) - 1);
		var stepy = Math.floor((Math.random() * 3) - 1);

		this.x += stepx;
		this.y += stepy;

		// stay inside the canvas
		this.x = this.x % width;
		this.y = this.y % height;
	}
}
