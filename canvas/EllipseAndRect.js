Canvas.EllipseAndRect = function(){
	Canvas.Rectangle.call(this);

	this.draw = function(){
		var aLength = arguments.length;
		if (aLength === 1) {
			this.endP = arguments[0];
		} else if (aLength === 2){
			this.startP = arguments[0];
			this.endP = arguments[1];
		} 

		this.width = this.endP.x - this.startP.x;
        this.height = this.endP.y - this.startP.y;

		this.canvas.beginPath();
		if (this.fill) {
			this.canvas.save();
			this.canvas.fillStyle = '#ccc';
			this.canvas.beginPath();
			Canvas.ellipse(this.canvas, (this.startP.x + this.endP.x)/2, (this.startP.y + this.endP.y)/2, this.width/2 ,this.height/2);
            this.lineRect(this.startP.x, this.startP.y, this.width, this.height, false);
            this.canvas.closePath();
            this.canvas.fill();
            this.canvas.stroke();
            this.canvas.restore();
		}else{
		    this.canvas.beginPath();
		    Canvas.ellipse(this.canvas, (this.startP.x + this.endP.x)/2, (this.startP.y + this.endP.y)/2, this.width/2 ,this.height/2);
            this.lineRect(this.startP.x, this.startP.y, this.width, this.height, true);
            this.canvas.closePath();
            this.canvas.stroke();
	    }
	};
}