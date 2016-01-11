/* Non-uniform random number distributions */
var gaussian_z0 = null;

function gaussian() {
	if(gaussian_z0 != null) {
		ret = gaussian_z0;
		gaussian_z0 = null;
		return ret;
	} else {
		var u1 = Math.random();
		var u2 = Math.random();

		var r = Math.sqrt(-2 * Math.log(u1));
		var theta = 2 * Math.PI * u2;

		z0 = r * Math.cos(theta);
		var z1 = r * Math.sin(theta);

		return z1;
	}
}