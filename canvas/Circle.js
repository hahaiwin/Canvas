Canvas.Circle = function(startP, endP){
	this.canvas = Canvas.cxt;
	this.startP = startP? startP: {x:0,y:0};
	this.endP = endP? endP: {x:0,y:0};

    this.width = this.endP.x - this.startP.x;
    this.height = this.endP.y - this.startP.y;
    this.fill = false;


	this.draw = function(){
		var aLength = arguments.length;
		if (aLength === 1) {
			this.endP = arguments[0];
		} else if (aLength === 2){
			this.startP = arguments[0];
			this.endP = arguments[1];
		} 

        this.radius = Math.round(Math.sqrt((Math.pow((this.endP.x - this.startP.x), 2) + Math.pow((this.endP.y - this.startP.y), 2)))/2);
        this.center = new Canvas.Point(Math.round((this.endP.x + this.startP.x)/2), Math.round((this.endP.y + this.startP.y)/2));

		this.canvas.beginPath();
		this.canvas.arc(this.center.x, this.center.y, this.radius, 0, Math.PI*2, true);
		this.canvas.closePath();
		if (this.fill) {
			this.canvas.save();
			this.canvas.fillStyle = '#ccc';
			this.canvas.fill();
			this.canvas.restore();
		};
		this.canvas.stroke();
	};
};