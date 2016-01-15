function Fluid(x, y, w, h, c) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.c = c;
	this.fillStyle = "rgba(70, 70, 70, 0.5)";

	this.display = function() {
		ctx.fillStyle = this.fillStyle;
		ctx.fillRect(x, y, w, h);
	};
}