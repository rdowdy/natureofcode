function Vector(x, y) {
	this.x = x;
	this.y = y;

	this.add = function(v) {
		this.x = this.x + v.x;
		this.y = this.y + v.y;
	};

	this.sub = function(v) {
		this.x = this.x - v.x;
		this.y = this.y - v.y
	};

	this.mult = function(b) {
		this.x = this.x * b;
		this.y = this.y * b;
	};

	this.div = function(b) {
		this.x = this.x / b;
		this.y = this.y / b;
	};

	this.mag = function(b) {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	};

	this.normalize = function() {
		var m = this.mag();
		if(m != 0) {
			this.div(m);
		}
	};

	this.deepCopy = function() {
		return new Vector(this.x, this.y);
	}

	Vector.random2D = function() {
		var out = new Vector(random0to1(), random0to1());
		out.normalize();
		return out;
	};

	// v1 + v2
	Vector.add = function(v1, v2) {
		var v3 = new Vector(v1.x + v2.x, v1.y + v2.y);
		return v3;
	};

	// v1 - v2
	Vector.sub = function(v1, v2) {
		var v3 = new Vector(v1.x - v2.x, v1.y - v2.y);
		return v3;
	};

	// v1 * n
	Vector.mult = function(v1, n) {
		var v2 = new Vector(v1.x * n, v1.y *  n);
		return v2;
	};

	// v1 / n
	Vector.div = function(v1, n) {
		var v2 = new Vector(v1.x / n, v1.y / n);
		return v2;
	};

};