import { hexs, dots, hasLibs} from './logics.js';

var radius = 20;
var subx = 44;
var suby = 25;
var bg_color = "black";
var line_color = "white";
var dotImgs = [];
var hexImgs = [];
var lastK = -1;
var lastM = -1;//last dot drawn in the canvas onmouse


Session.set('imageLoadCheck', 0);
hexImgs[0] = new Image();
hexImgs[0].src = "/hexblack.png";
hexImgs[0].onload = ()=> {
  Session.set('imageLoadCheck', Session.get('imageLoadCheck') + 1);
};

hexImgs[1] = new Image();
hexImgs[1].src = "/hexblue.png";
hexImgs[1].onload = ()=> {
  Session.set('imageLoadCheck', Session.get('imageLoadCheck') + 1);
};

hexImgs[2] = new Image();
hexImgs[2].src = "/hexred.png";
hexImgs[2].onload = ()=> {
  Session.set('imageLoadCheck', Session.get('imageLoadCheck') + 1);
};

dotImgs[1] = new Image();
dotImgs[1].src = "/bluesh.png";
dotImgs[1].onload = ()=> {
  Session.set('imageLoadCheck', Session.get('imageLoadCheck') + 1);
};

dotImgs[2] = new Image();
dotImgs[2].src = "/redsh.png";
dotImgs[2].onload = ()=> {
  Session.set('imageLoadCheck', Session.get('imageLoadCheck') + 1);
};


var Hexagon = function (xCntr, yCntr) {
    this.xCntr = xCntr; // hex x center
    this.yCntr = yCntr; // jex y center
    this.value = 0;
};

var Dot = function (xCntr, yCntr) {
    this.xCntr = xCntr; // x center of the dot
    this.yCntr = yCntr; // y center of the dot
    this.owner = 0;
};

var decimalToHex = function(y, x) {
    y = y.toString(16);
    x = x.toString(16);
    var hex = "#00" + "00".substr(0, 2 - y.length) + y + "00".substr(0, 2 - x.length) + x;
    return hex;
};

export const zoomFirst = function(){
	if($(window).width() < 545 || $(window).height() < 545)
		return true;
};

export const canvasResizer = (canvas, canvas2, maskCanvas, canvasW, canvasH)=>{
	var divWidth = document.getElementById('canvasCol').clientWidth;
	var winHeight = $(window).height() - 56;
	var coAdjuster;
	var canvasHolder = document.getElementById('canvasHolder');

	if(window.getComputedStyle(canvasHolder).getPropertyValue('z-index') == 1 && divWidth < winHeight * 11 / 10){
		
		var height = divWidth * 10 / 11;
		document.getElementById('canvasHolder').style.height = height.toString() + "px";
		document.getElementById('canvasHolder').style.width = divWidth.toString() + "px";
		canvas.style.height = height.toString() + "px";
	    canvas.style.width = divWidth.toString() + "px";
	    canvas2.style.height = height.toString() + "px";
	    canvas2.style.width = divWidth.toString() + "px";
	    maskCanvas.style.height = height.toString() + "px";
	    maskCanvas.style.width = divWidth.toString() + "px";
	    coAdjuster = canvasW / divWidth;
	}
	else{
		var canvasXAdjuster, canvasYAdjuster;
		if(winHeight * 11 / 10 < divWidth){
			canvasXAdjuster = winHeight * 11 / 10;
			canvasYAdjuster = winHeight;
			coAdjuster = canvasH / winHeight;
		}
		else{
			canvasXAdjuster = divWidth;
			canvasYAdjuster = divWidth * 10 / 11;
			coAdjuster = canvasW / divWidth;
		}

		document.getElementById('canvasHolder').style.height = canvasYAdjuster.toString() + "px";
		document.getElementById('canvasHolder').style.width = canvasXAdjuster.toString() + "px";
		canvas.style.height = canvasYAdjuster.toString() + "px";
	    canvas.style.width = canvasXAdjuster.toString() + "px";
	    canvas2.style.height = canvasYAdjuster.toString() + "px";
	    canvas2.style.width = canvasXAdjuster.toString() + "px";
	    maskCanvas.style.height = canvasYAdjuster.toString() + "px";
	    maskCanvas.style.width = canvasXAdjuster.toString() + "px";
	}
	return coAdjuster;
};

var hexPainter = (hex, owner, ctx2)=>{
	ctx2.globalAlpha = 1;
	ctx2.drawImage(hexImgs[0], hex.xCntr - subx + Math.floor(subx / 22), hex.yCntr + Math.floor(suby / 2), subx * 2 - 4, suby * 3 + 1);
	if(owner !== 0){
		var color = (owner > 0) ? 1 : 2;
		ctx2.globalAlpha = 0.4;
		ctx2.drawImage(hexImgs[color], hex.xCntr - subx + Math.floor(subx / 22), hex.yCntr + Math.floor(suby / 2), subx * 2 - 4, suby * 3 + 1);
	}

};

export const boardPainter = (ctx, ctx2, hexsPaint, dotsPaint, hexsData, dotsData, lastMove, variation)=>{
	var i, j;

	for(i = 0; i < dots.length; i++){
		for(j = 0; j < dots[0].length; j++){
			var tempOwner = dotsData[i][j];
			if(tempOwner !== undefined){
  				if(tempOwner !== dotsPaint[i][j].owner){
  					if(tempOwner === 0){
  						drawArc(dotsPaint[i][j].xCntr, dotsPaint[i][j].yCntr, ctx);
  					}
	  				else{
	  					ctx.drawImage(dotImgs[tempOwner], dotsPaint[i][j].xCntr - radius, dotsPaint[i][j].yCntr - radius, radius * 2, radius * 2);
	  				}
	  				dotsPaint.owner = tempOwner;

	  			}
      		}
		}
	}
	if(lastMove.exists){
		var y = lastMove.y;
		var x = lastMove.x;
		ctx.beginPath();
        ctx.arc(dotsPaint[y][x].xCntr, dotsPaint[y][x].yCntr, radius / 2, 0, 2*Math.PI, false);
        ctx.lineWidth = 3;
        ctx.strokeStyle = line_color;
        ctx.fillStyle = line_color;
        ctx.fill();

        dotsPaint[y][x].owner = 100;
	}
	if(variation){
		var blackX = parseInt(variation[1].charAt(0), 36);
		var blackY = parseInt(variation[1].charAt(1), 36);
		var paintDot = dotsPaint[blackY][blackX];
		paintDot.owner = 200;
		ctx.beginPath();
        ctx.arc(paintDot.xCntr, paintDot.yCntr, radius / 2, 0, 2*Math.PI, false);
        ctx.lineWidth = 3;
        ctx.strokeStyle = bg_color;
        ctx.fillStyle = bg_color;
        ctx.stroke();
        ctx.fill();
	}

	for(i=0; i<hexs.length; i++){
		for(j=0; j<hexs[0].length; j++){
			var hex = hexsPaint[i][j];
			if(hex && hex.value !== hexsData[i][j]){
				if((hexsData[i][j] > 0 && hex.value < 1) || (hexsData[i][j] < 0 && hex.value > -1) || hexsData[i][j] === 0){
					hexPainter(hex, hexsData[i][j], ctx2);
				}
				hex.value = hexsData[i][j];
			}
		}
	}
};

var drawArc = (x, y, ctx)=>{
	ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2*Math.PI, false);
    ctx.lineWidth = 2;
    ctx.strokeStyle = line_color;
    ctx.fillStyle = bg_color;
    ctx.stroke();
    ctx.fill();
};

//canvas mouse move
export const CMM = (event, ctx, pixelContext, coAdjuster, dotsData, dotsPaint, player)=>{
	
	var imageData = pixelContext.getImageData(coAdjuster * event.offsetX, coAdjuster * event.offsetY, 1, 1).data;
    var k = imageData[1] -1;
	var m = imageData[2] -1;
	if((k !== lastK || m !== lastM) && (imageData[3] === 255 || imageData[3] === 0)){

		if(lastK > -1 && lastM > -1 && dotsData[lastK][lastM] === 0){
			drawArc(dotsPaint[lastK][lastM].xCntr, dotsPaint[lastK][lastM].yCntr, ctx);
        }

		lastK = k;
		lastM = m;
    	if(k > -1){ 
			if(dotsData[k][m] === 0 && hasLibs(k, m, player, dotsData)){
				ctx.drawImage(dotImgs[player], dotsPaint[k][m].xCntr - radius, dotsPaint[k][m].yCntr - radius, radius * 2, radius * 2);
		    } 
		} 
	}
};

var cleanCCM = (ctx, dotsData, dotsPaint)=>{
	if(lastK > -1 && dotsData[lastK][lastM] === 0){
		drawArc(dotsPaint[lastK][lastM].xCntr, dotsPaint[lastK][lastM].yCntr, ctx);

    	lastK = -1;
    	lastM = -1;
    }
};

export const zoomIn = function(event, instance){

	cleanCCM(instance.ctx, instance.dotsData, instance.dotsPaint);
	var zoomX = instance.coAdjuster * event.offsetX;
	var zoomY = instance.coAdjuster * event.offsetY;

	if(zoomX - (instance.canvasW/4) < 0){
		zoomX = 0;
	}
	else if(zoomX + (instance.canvasW/4) > instance.canvasW){
		zoomX = (instance.canvasW/2);
	}
	else{
		zoomX -= (instance.canvasW/4);
	}

	if(zoomY - (instance.canvasH/4) < 0){
		zoomY = 0;
	}
	else if(zoomY + (instance.canvasH/4) > instance.canvasH){
		zoomY = (instance.canvasH/2);
	}
	else{
		zoomY -= (instance.canvasH/4);
	}

	instance.imageSave = instance.ctx.getImageData(0, 0, instance.canvasW, instance.canvasH);
	instance.imageSave2 = instance.ctx2.getImageData(0, 0, instance.canvasW, instance.canvasH);
	instance.dataSave = instance.pixelContext.getImageData(0, 0, instance.canvasW, instance.canvasH);

	var imageToZoom = instance.ctx.getImageData(zoomX, zoomY, (instance.canvasW/2), (instance.canvasH/2));
	var imageToZoom2 = instance.ctx2.getImageData(zoomX, zoomY, (instance.canvasW/2), (instance.canvasH/2));
	var dataToZoom = instance.pixelContext.getImageData(zoomX, zoomY, (instance.canvasW/2), (instance.canvasH/2));

	var tempCanvas = $("<canvas>")
	    .attr("width", imageToZoom.width)
	    .attr("height", imageToZoom.height)[0];

	tempCanvas.getContext("2d").putImageData(imageToZoom, 0, 0);
	instance.ctx.clearRect(0, 0, instance.canvasW, instance.canvasH);
	instance.ctx.scale(2, 2);
	instance.ctx.drawImage(tempCanvas, 0, 0);

	tempCanvas.getContext("2d").putImageData(imageToZoom2, 0, 0);
	instance.ctx2.clearRect(0, 0, instance.canvasW, instance.canvasH);
	instance.ctx2.scale(2, 2);
	instance.ctx2.drawImage(tempCanvas, 0, 0);

	tempCanvas.getContext("2d").putImageData(dataToZoom, 0, 0);
	instance.pixelContext.clearRect(0, 0, instance.canvasW, instance.canvasH);
	instance.pixelContext.scale(2, 2);
	instance.pixelContext.drawImage(tempCanvas, 0, 0);

	instance.isZoomed = true;
	instance.ctx.scale(0.5, 0.5);
	instance.ctx2.scale(0.5, 0.5);
	instance.pixelContext.scale(0.5, 0.5);
};

export const zoomOut = function(instance){
	instance.ctx.clearRect(0, 0, instance.canvasW, instance.canvasH);
    instance.ctx.putImageData(instance.imageSave, 0, 0);
    instance.ctx2.clearRect(0, 0, instance.canvasW, instance.canvasH);
    instance.ctx2.putImageData(instance.imageSave2, 0, 0);
    instance.pixelContext.clearRect(0, 0, instance.canvasW, instance.canvasH);
    instance.pixelContext.putImageData(instance.dataSave, 0, 0);
    instance.isZoomed = false;
}

export const boardRenderer = (canvas, ctx, ctx2, pixelContext, hexsPaint, dotsPaint)=>{
    
    ctx2.fillStyle = bg_color;
    ctx2.fillRect(0, 0, canvas.width, canvas.height);

    

    var i, j;
    var x = subx; //istead of 112
    var y = suby*2; //instead of 50

    //default boardRenderer.subx is 44, default boardRenderer.suby is 25
    for(i = 0; i < hexs.length; i++){
    	hexsPaint[i] = [];
        for(j = 0; j < hexs[0].length; j++){
            x = x + subx;
            if(hexs[i][j] === 1)
                continue;
            ctx.beginPath();
            ctx.moveTo(x,y);
            ctx.lineTo(x-subx,y+suby);
            ctx.lineTo(x-subx,y+suby*3);
            ctx.lineTo(x,y+suby*4);
            ctx.lineTo(x+subx,y+suby*3);
            ctx.lineTo(x+subx,y+suby);
            ctx.closePath();
            ctx.lineWidth = 3;
            ctx.strokeStyle = line_color;
            ctx.stroke();
            hexsPaint[i][j] = new Hexagon(x, y);
        }
        x = subx;

        y += suby*3;
    }

    x = 0;
    y = suby*2;

    for(i = 0; i < dots.length; i++){
    	dotsPaint[i] = [];
        for(j = 0; j < dots[0].length; j++) {
            x = x + subx;
            if(dots[i][j] === 1)
                continue;
            ctx.beginPath();
		    ctx.arc(x, y, radius, 0, 2*Math.PI, false);
		    ctx.lineWidth = 3;
		    ctx.strokeStyle = line_color;
		    ctx.fillStyle = bg_color;
		    ctx.stroke();
		    ctx.fill();
            dotsPaint[i][j] = new Dot(x, y);
            // creates mask
            pixelContext.beginPath();
            pixelContext.arc(x, y, radius*1.1, 0, 2*Math.PI, false);
            pixelContext.lineWidth = 3;
            pixelContext.strokeStyle = line_color;
            pixelContext.fillStyle = decimalToHex(i+1, j+1);
            pixelContext.fill();
        }
        x = 0;
        if (i % 2 === 0){
            y += suby;
        }
        else{
            y += suby * 2;
        }
    }
};