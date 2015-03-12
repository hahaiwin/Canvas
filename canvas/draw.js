

var Canvas = {};

Canvas.graph = [];

Canvas.currentGraph = {};

Canvas.cxt = {};

Canvas.clockIsShow = false;
//Canvas.currentShap = '';

Canvas.ShapNum = {};

Canvas.$ = function(id){
	if (/^#/g.test(id)) {
	    return document.getElementById(id.slice(1));
    }else{
    	return document.getElementsByTagName(id);
    }
};

Canvas.require = function(filePath){
	var dom = document.createElement('script');
	dom.type = 'text/javascript';
	dom.src = filePath;

	document.head.appendChild(dom);
}

Canvas.clearCxt = function(){
	var me = this;

	var canvas = me.cxt.canvas;
   	me.cxt.clearRect(0,0, canvas.offsetWidth, canvas.offsetHeight);
   	//Canvas.graph.length = 0;
};

Canvas.clearAll = function(){
	var me = this;

	this.clearCxt();
	me.graph.length = 0;
	this.changNum();
}

Canvas.redraw = function(){
	var me = this;

	this.clearCxt();
	for (var i = 0; i < me.graph.length; i++) {
		me.graph[i].draw();
	};
};

Canvas.changNum = function(){
	var me = this;

	me.ShapNum.value = me.graph.length;
}

Canvas.addEvent = function(el, eventType, eventHandler){
   if(el.addEventListener){
      el.addEventListener(eventType, eventHandler,false);
   } else if(el.attachEvent){
      el.attachEvent('on' + eventType, eventHandler);
   }
 };
 
 //移除事件
Canvas.removeEvent = function(el, eventType, eventHandler){
   if(el.removeEventListener){
      el.removeEventListener(eventType, eventHandler,false);
   } else if(el.detachEvent){
      el.detachEvent('on' + eventType, eventHandler);
   }
 };

Canvas.stopDefault = function(e){
    if(e&&e.preventDefault){
	  e.preventDefault();
	} else {
	  window.event.returnValue = false;
	}
	return false;
 }

Canvas.Point = function(offsetX, offsetY){
	this.x = offsetX;
	this.y = offsetY;
};

Canvas.Line = function(startP, endP){
	this.canvas = Canvas.cxt;
	this.startP = startP? startP: {x:0,y:0};
	this.endP = endP? endP: {x:0,y:0};
	
	this.draw = function(){
		var aLength = arguments.length;
		if (aLength === 1) {
			this.endP = arguments[0];
		} else if (aLength === 2){
			this.startP = arguments[0];
			this.endP = arguments[1];
		} 
        
		this.canvas.beginPath();
		this.canvas.moveTo(this.startP.x, this.startP.y);
		this.canvas.lineTo(this.endP.x, this.endP.y);
		this.canvas.stroke();
	};
};

Canvas.Rectangle = function(startP, endP){
	this.canvas = Canvas.cxt;
	this.startP = startP? startP: {x:0,y:0};
	this.endP = endP? endP: {x:0,y:0};

	this.fill = false;

    this.width = this.endP.x - this.startP.x;
    this.height = this.endP.y - this.startP.y;

    this.lineRect = function(x, y, width, height, clockWise)
    {
    	var c = Canvas.cxt;
    	c.moveTo(x, y);
    	if (clockWise) {
    		c.lineTo(x + width, y);
    		c.lineTo(x + width, y + height);
    		c.lineTo(x, y + height);
    		c.lineTo(x, y);
    	}else{
            c.lineTo(x, y + height);
    		c.lineTo(x + width, y + height);
    		c.lineTo(x + width, y);
    		c.lineTo(x, y);
    	}
    	

    }

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
            this.lineRect(this.startP.x, this.startP.y, this.width, this.height, true);
            this.canvas.closePath();
            this.canvas.fill();
            this.canvas.stroke();

            this.canvas.restore();
		}else{
		    this.canvas.beginPath();
            this.lineRect(this.startP.x, this.startP.y, this.width, this.height, true);
            this.canvas.closePath();
            this.canvas.stroke();
	    }
	};
};

Canvas.onClearBtnClick = function(){
	var me = Canvas;
   	me.clearAll();
};

Canvas.onMouseDown = function(e){
	var me = Canvas,
	canvas = me.cxt.canvas,
	gph,
	fillcbx = Canvas.$('#fillcbx'),
    shapCombox = Canvas.$('#shapsct');
    
	Canvas.currentShap =  shapCombox.value;

	if (!me.currentShap) {
		return;
	};
     
	gph = new Canvas[me.currentShap]();
    
   	me.stopDefault(e);
   
   	gph.startP = new me.Point(e.offsetX, e.offsetY);
   	gph.fill = fillcbx.checked;
   	
   	me.currentGraph = gph;

   	me.addEvent(canvas, 'mousemove', me.onMouseMove);
   	me.addEvent(canvas, 'mouseout', me.onMouseMoveOut);
   	me.addEvent(canvas, 'mouseup', me.onMouseUp);
}

Canvas.onMouseUp = function(e){
	var me = Canvas,
	canvas = me.cxt.canvas,
	gph = me.currentGraph;

	if (!me.currentShap) {
		return;
	};

   	me.stopDefault(e);

   	gph.endP = new me.Point(e.offsetX, e.offsetY);
   	
    me.removeEvent(canvas, 'mousemove', me.onMouseMove);
    me.removeEvent(canvas, 'mouseout', me.onMouseMoveOut);
    me.removeEvent(canvas,'mouseup', me.onMouseUp);

    if (gph.startP.x !== gph.endP.x || gph.startP.y !== gph.endP.y){
   	    me.graph.push(gph);
   	    me.changNum();
    }

    delete me.currentGraph;
    delete me.currentShap;
}

Canvas.onMouseMove = function(e){
	var me = Canvas,
	gph = me.currentGraph;
	
    me.stopDefault(e);

    if (gph.endP.x && gph.endP.y) {
    	me.redraw();
    };
   	gph.endP = new me.Point(e.offsetX, e.offsetY);
   	
    gph.draw();
}

Canvas.onMouseMoveOut = function(e){
	var me = Canvas,
	canvas = me.cxt.canvas,
	gph = me.currentGraph;

   	me.stopDefault(e);

   	gph.endP = new me.Point(e.offsetX, e.offsetY);

    me.removeEvent(canvas, 'mousemove', me.onMouseMove);
    me.removeEvent(canvas, 'mouseup',me.onMouseUp);
    me.removeEvent(canvas, 'mouseout', me.onMouseMoveOut);

    if (gph.startP.x !== gph.endP.x || gph.startP.y !== gph.endP.y){
   	    me.graph.push(gph);
   	    me.changNum();
    }

    delete me.currentGraph;
    delete me.currentShap;
}


Canvas.onComboChange = function(e){
	var me = Canvas,
	combo = this; 
	
	if (!Canvas[combo.value]) {
		Canvas.require(combo.value + '.js');
	};
}

Canvas.onClockBtnClick = function(){
	var me = Canvas,
	    canvas = Canvas.$('#canvasId');
    if (me.clockIsShow) {
    	clearInterval(me.clock.time);
    	Canvas.clearCxt();
    	me.clockIsShow = false;
    	Canvas.addEvent(canvas, 'mousedown', Canvas.onMouseDown); 
    }else{
    	me.clock = new Canvas.Clock();
        me.clock.drawClock();
        me.removeEvent(canvas, 'mousedown', me.onMouseDown);
        me.clockIsShow = true;
    }
}

Canvas.ellipse = function(context, x, y, a, b){
   context.save();
   //选择a、b中的较大者作为arc方法的半径参数
   var r = (a > b) ? a : b; 
   var ratioX = a / r; //横轴缩放比率
   var ratioY = b / r; //纵轴缩放比率
   context.scale(ratioX, ratioY); //进行缩放（均匀压缩）
   //context.beginPath();
   //从椭圆的左端点开始逆时针绘制
   context.moveTo((x + a) / ratioX, y / ratioY);
   context.arc(x / ratioX, y / ratioY, r, 0, 2 * Math.PI);
   context.restore();
};

Canvas.onDownloadBtnClick = function(){
	var canvas = Canvas.$('#canvasId');
	//var a = Canvas.$('#canvasId');
	//Canvas.cxt = canvas.getContext('2d');
	this.download = "hello-world.png";
	this.href = canvas.toDataURL('image/png');
}
   
function main(){
	var canvas = Canvas.$('#canvasId');
	Canvas.cxt = canvas.getContext('2d');
	
	var clearButton = Canvas.$('#clearBtn');
	Canvas.ShapNum = Canvas.$('#shapnumtext');
	var shapCombox = Canvas.$('#shapsct');
	var clockBtn = Canvas.$('#ClockBtn');
	var downloadBtn = Canvas.$('#DownloadBtn');
	
    Canvas.addEvent(shapCombox, 'change', Canvas.onComboChange);
	Canvas.addEvent(clearButton, 'click', Canvas.onClearBtnClick);
	Canvas.addEvent(clockBtn, 'click', Canvas.onClockBtnClick);
    Canvas.addEvent(canvas, 'mousedown', Canvas.onMouseDown); 

     Canvas.addEvent(downloadBtn, 'click', Canvas.onDownloadBtnClick); 
}
