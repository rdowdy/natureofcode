/* Non-uniform random number distributions */
var gaussian_z0 = null;

// generates a random number
// according to a normal distribution 
function gaussian() {
	if(gaussian_z0 != null) {
		ret = gaussian_z0;
		gaussian_z0 = null;
		return ret;
	} else {
		var u1 = random();
		var u2 = random();

		var r = Math.sqrt(-2 * Math.log(u1));
		var theta = 2 * Math.PI * u2;

		z0 = r * Math.cos(theta);
		var z1 = r * Math.sin(theta);

		return z1;
	}
};

// generates a random number
// using a custom distribution
// options:
// LINEAR: P(x) = x
// EXPONENTIAL: P(x) = x^2
// defaults to linear
function montecarlo(option) {
	var r1, r2, probability;

	while(true) {
		r1 = random();
		probability;

		switch(option.toLowerCase()) {
			case "linear":
				probability = r1;
				break;
			case "exponential":
				probability = Math.pow(r1, 2);
				break;
			default:
				probability = r1;
		}

		r2 = random();

		if(r2 < probability) {
			return r1;
		}
	}
};

// map a number from one range to another range
function map(x, in_min, in_max, out_min, out_max) {
	return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

// returns a random number between 0 and 1
// TODO_LONGTERM: implement different random number generators
function random() {
	return Math.random();
};