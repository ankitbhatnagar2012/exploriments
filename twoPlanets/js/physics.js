function  Physics (canvasid) {
	// body...
}

Physics.prototype.stage = function(options) {
	// body...
	this.canvasid = options.canvas;
	this.canvas = document.getElementById(options.canvas);
	this.ctx = this.canvas.getContext('2d');
};

