var bob = {
	x:0,
	y:300,
	radius:50,
	moveBob:0
};

var bob2 = {
	x:0,
	y:300,
	radius:50,
	moveBob:0	
};

var anchor = {
	x:300,
	y:30,
	radius:20,
	moveAnchor:0
};

var anchor2 = {
	x:700,
	y:30,
	radius:20,
	moveAnchor:0
};

var pivot = {
	x:0,
	y:0,
	radius:10
};

var pivot2 = {
	x:0,
	y:0,
	radius:10
};

var envi = {
	g:9.8 * 2,
	l:200,
	time:30,
	v:0,
	angle:0
};

var envi2 = {
	g:9.8 * 10,
	l:200,
	time:30,
	v:0,
	angle:0
};

var radius = 200;
var radius2 = 300;

var oangle = 0;
var oangle2 = 0;

var angle = 0;
var angle2 = 0;

var direction = 1;
var direction2 = 1;

var debugSpan = document.getElementById('debugSpan');

function draw(id){
	canvas = document.getElementById(id);
	stageHeight = window.innerHeight-150;
	stageWidth = window.innerWidth;
	if (canvas.getContext){
	  ctx = canvas.getContext('2d');
	  ctx.canvas.width = stageWidth;
	  ctx.canvas.height = stageHeight;
	  canvas.addEventListener('mousemove', mouseMoveEvent, false);
	  canvas.addEventListener('mousedown', mouseDownEvent, false);
	  canvas.addEventListener('mouseup', mouseUpEvent, false);
	  /*drawRectagle({
	  	x:stageWidth/2,
	  	y:stageHeight/2,
	  	length:55,
	  	height:50,
	  	color:"rgb(200,0,0)"
	  });


	  drawCircle({
	  	x:stageWidth/2,
	  	y:400,
	  	radius:50,
	  	color:'yellow'
	  });*/

	  //drawPath();

	  //drawCurve();
	  //game();
	  pendulum(0, radius, 0, radius2);
	}
}

function mouseMoveEvent(event) {
	var x = event.pageX;
	var y = event.pageY; 


	if (bob.moveBob == 1) {
		console.log('move');
		var xa = -x + anchor.x;
		var ya = -y + anchor.y;
		var radians = Math.atan((xa/ya));
		var degrees = degree(radians);
		if (y > pivot.y && (-90 < degrees < 90)) {
			ctx.clearRect(0, 0, stageWidth, stageHeight);
			pendulum(degrees, radius, degrees, radius2);
		}
	}

	if (anchor.moveAnchor == 1) {
		var radians = Math.atan(0);
		var degrees = degree(radians);
		anchor.x = anchor.x;
		anchor.y = y;
		radius = 200 - y + 30;
		if(anchor.y > 30 && anchor.y < 150){			
			ctx.clearRect(0, 0, stageWidth, stageHeight);
			pendulum(degrees, radius, degrees, radius2);
		}
	}

	
}

function mouseDownEvent(event) {
	var x = event.pageX;
	var y = event.pageY;

	if (typeof penint !== 'undefined' && penint != null) {
		clearInterval(penint);
		penint = null;
	}

	var dis = Math.sqrt((bob.x-x)*(bob.x-x) + (bob.y-y)*(bob.y-y));

	var anchorDis = Math.sqrt((anchor.x-x)*(anchor.x-x) + (anchor.y-y)*(anchor.y-y)); 

	if(dis < bob.radius) {
		bob.moveBob = 1;
	}

	if(anchorDis < anchor.radius) {
		anchor.moveAnchor = 1;
	}
}

function mouseUpEvent(event) {
	var x = event.pageX;
	var y = event.pageY;
	
	if(bob.moveBob == 1) {
		bob.moveBob = 0;
		envi.angle = envi2.angle = radians(angle);

		// remove all click listeners before animation begins
		canvas.removeEventListener('mousemove', mouseMoveEvent, false);
	  	canvas.removeEventListener('mousedown', mouseDownEvent, false);
	  	canvas.removeEventListener('mouseup', mouseUpEvent, false);

		penint = setInterval(animatePend,envi.time);
	}

	if(anchor.moveAnchor == 1){
		anchor.moveAnchor = 0;
	}
}

function animatePend() {
	var k = -envi.g/envi.l;
    var timestep_s = envi.time / 100;
    var acceleration = k * Math.sin(envi.angle);
    envi.v += acceleration * timestep_s;
    envi.angle += envi.v * timestep_s;

    var k = -envi2.g/envi2.l;
    var timestep_s = envi2.time / 100;
    var acceleration = k * Math.sin(envi2.angle);
    envi2.v += acceleration * timestep_s;
    envi2.angle += envi2.v * timestep_s;


    ctx.clearRect(0, 0, stageWidth, stageHeight);
	ctx.save();
	drawPendulum(envi.angle, radius, envi2.angle, radius2);
	ctx.restore();
}

function stopAnimation(){
	if (typeof penint !== 'undefined' && penint != null) {
		clearInterval(penint);
		penint = null;
	}
	ctx.clearRect(0, 0, stageWidth, stageHeight);
	oangle = angle = oangle2 = angle2 = 0;
	direction = direction2 = 1;
	bob = {
		x:0,
		y:300,
		radius:50,
		moveBob:0
	}
	bob2 = {
		x:0,
		y:300,
		radius:50,
		moveBob:0
	}
	envi.v = envi2.v = 0;
	envi.angle = envi2.angle2 = 0;
	envi.l = envi2.l = radius;

	pendulum(0,radius, 0, radius2);

	canvas.addEventListener('mousemove', mouseMoveEvent, false);
	canvas.addEventListener('mousedown', mouseDownEvent, false);
	canvas.addEventListener('mouseup', mouseUpEvent, false);
}

function pendulum(theta, radius, theta2, radius2) {
	oangle = -Math.round(theta);
	angle = -Math.round(theta);

	oangle2 = -Math.round(theta2);
	angle2 = -Math.round(theta2);

	if (theta > 0)
		direction = 0;
	else {
		direction = 1;
		oangle = -oangle;
	}

	if(theta2 > 0)
		direction2 = 0;
	else {
		direction2 = 1;
		oangle2 = -oangle2;
	}
	
	stx = 300;
	sty = 30;

	stx2 = 700;
	sty2 = 30;

	thetaR = radians(theta);
	thetaR2 = radians(theta2);

	endx = anchor.x + radius * Math.sin(thetaR);
	endy = anchor.y + radius * Math.cos(thetaR);

	endx2 = anchor2.x + radius2 * Math.sin(thetaR2);
	endy2 = anchor2.y + radius2 * Math.cos(thetaR2);

	bob.x = endx;
	bob.y = endy;

	bob2.x = endx2;
	bob2.y = endy2;

	pivot.x = anchor.x;
	pivot.y = anchor.y;

	pivot2.x = anchor2.x;
	pivot2.y = anchor2.y;


	drawCircle({
	  	x:stx,
	  	y:sty,
	  	radius:20,
	  	color:'yellow'
	});

	drawCircle({
	  	x:stx2,
	  	y:sty2,
	  	radius:20,
	  	color:'yellow'
	});

	ctx.beginPath();
	ctx.strokeStyle = 'red';
	ctx.moveTo(stx, sty);
	ctx.lineTo(anchor.x, anchor.y);
	ctx.stroke();

	ctx.beginPath();
	ctx.strokeStyle = 'red';
	ctx.moveTo(stx2, sty2);
	ctx.lineTo(anchor2.x, anchor2.y);
	ctx.stroke();

	drawCircle({
	  	x:anchor.x,
	  	y:anchor.y,
	  	radius:10,
	  	color:'black'
	});

	drawCircle({
	  	x:anchor2.x,
	  	y:anchor2.y,
	  	radius:10,
	  	color:'black'
	});	

	ctx.beginPath();
	ctx.strokeStyle = 'black';
	ctx.moveTo(anchor.x, anchor.y);
	ctx.lineTo(endx, endy);
	ctx.stroke();

	ctx.beginPath();
	ctx.strokeStyle = 'black';
	ctx.moveTo(anchor2.x, anchor2.y);
	ctx.lineTo(endx2, endy2);
	ctx.stroke();

	drawCircle({
	  	x:endx,
	  	y:endy,
	  	radius:30,
	  	color:'#123456'
	});

	drawCircle({
	  	x:endx2,
	  	y:endy2,
	  	radius:30,
	  	color:'#123456'
	});
}
 
function drawPendulum(theta, radius, theta2, radius2) {
	stx = 300;
	sty = 30;

	stx2 = 700;
	sty2 = 30;

	thetaRy = theta;//radians(theta);
	thetaRy2 = theta2;//radians(theta);

	bob.x = anchor.x + radius * Math.sin(-thetaRy);
	bob.y = anchor.y + radius * Math.cos(-thetaRy);

	bob2.x = anchor2.x + radius2 * Math.sin(-thetaRy2);
	bob2.y = anchor2.y + radius2 * Math.cos(-thetaRy2);

	/*console.log(direction);
	console.log(theta);
	console.log(oangle);

	/*var time = new Date();
	thetaRy = ((thetaRy)/60)*time.getSeconds() + ((thetaRy)/60000)*time.getMilliseconds();
	*/
	/*if (direction == 1 && theta != -oangle) {
		angle++;
	} else if (direction == 1 && theta == -oangle) {
		direction = 0;
	}

	if (direction == 0 && theta != oangle) {
		angle--;
	} else if (direction == 0 && theta == oangle) {
		direction = 1;
	}*/

	// ctx.translate(stx, sty);
	// ctx.rotate(thetaRy);

	// stx = sty = 0;

	endx = anchor.x;
	endy = anchor.y + radius;

	endx2 = anchor2.x;
	endy2 = anchor2.y + radius2;

	drawCircle({
	  	x:stx,
	  	y:sty,
	  	radius:20,
	  	color:'yellow'
	});

	drawCircle({
	  	x:stx2,
	  	y:sty2,
	  	radius:20,
	  	color:'yellow'
	});

	ctx.beginPath();
	ctx.strokeStyle = 'red';
	ctx.moveTo(stx, sty);
	ctx.lineTo(anchor.x, anchor.y);
	ctx.stroke();

	ctx.beginPath();
	ctx.strokeStyle = 'red';
	ctx.moveTo(stx2, sty2);
	ctx.lineTo(anchor2.x, anchor2.y);
	ctx.stroke();	

	drawCircle({
	  	x:anchor.x,
	  	y:anchor.y,
	  	radius:10,
	  	color:'black'
	});

	drawCircle({
	  	x:anchor2.x,
	  	y:anchor2.y,
	  	radius:10,
	  	color:'black'
	});

	ctx.beginPath();
	ctx.strokeStyle = 'black';
	ctx.moveTo(anchor.x, anchor.y);
	ctx.lineTo(bob.x, bob.y);
	ctx.stroke();

	ctx.beginPath();
	ctx.strokeStyle = 'black';
	ctx.moveTo(anchor2.x, anchor2.y);
	ctx.lineTo(bob2.x, bob2.y);
	ctx.stroke();

	drawCircle({
	  	x:bob.x,
	  	y:bob.y,
	  	radius:30,
	  	color:'#123456'
	});

	drawCircle({
	  	x:bob2.x,
	  	y:bob2.y,
	  	radius:30,
	  	color:'#123456'
	});

	debugSpan.innerHTML = 2 * Math.PI * Math.sqrt(radius/envi.g) / 10.0 ;
	
}


function drawRectagle(options) {
	ctx.fillStyle = options.color;
    ctx.fillRect (options.x, options.y, options.length, options.height);
}

function drawCircle(options) {
	ctx.beginPath();
    ctx.arc(options.x, options.y, options.radius, 0,Math.PI*2,true); // Outer circle
    ctx.fillStyle = options.color;
    ctx.fill();
}

function drawArc(options) {
	ctx.beginPath();
	ctx.arc(
		options.x, 
		options.y, 
		options.radius, 
		options.startAngle, 
		options.endAngle,
		options.clockwise
	);
	ctx.fillStyle = options.color;
	ctx.fill();
}

function radians(degree) {
	return (degree*22)/(7*180);
}

function degree(radians) {
	return (radians * 7 * 180)/(22);
}

function drawQuadraticCurveTo(options) {
	ctx.beginPath();
	ctx.moveTo(options.x, options.y);
	ctx.quadraticCurveTo(
		options.stx, 
		options.sty, 
		options.edx, 
		options.edy
	);
	ctx.fill();
}

function drawBezierCurveTo(options) {
	ctx.beginPath();
	ctx.moveTo(options.x, options.y);
	ctx.bezierCurveTo(
		options.stx, 
		options.sty,
		options.st1x, 
		options.st1y, 
		options.edx, 
		options.edy
	);
	ctx.fill();
}

function drawCurve() {
	ctx.beginPath();
    ctx.moveTo(75,25);
    //ctx.lineTo(25,25);
    ctx.quadraticCurveTo(25,25,25,62.5);
    ctx.quadraticCurveTo(25,100,50,100);
    ctx.quadraticCurveTo(50,120,30,125);
    ctx.quadraticCurveTo(60,120,65,100);
    ctx.quadraticCurveTo(125,100,125,62.5);
    ctx.quadraticCurveTo(125,25,75,25);
    ctx.stroke();
}

function roundedRect(x,y,width,height,radius){
  ctx.beginPath();
  ctx.moveTo(x,y+radius);
  ctx.lineTo(x,y+height-radius);
  ctx.quadraticCurveTo(x,y+height,x+radius,y+height);
  ctx.lineTo(x+width-radius,y+height);
  ctx.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);
  ctx.lineTo(x+width,y+radius);
  ctx.quadraticCurveTo(x+width,y,x+width-radius,y);
  ctx.lineTo(x+radius,y);
  ctx.quadraticCurveTo(x,y,x,y+radius);
  ctx.stroke();
}

function drawPath() {
	ctx.beginPath();
    ctx.moveTo(75,75);
    ctx.lineTo(125,75);
    ctx.lineTo(120,50);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.arc(75,75,50,0,Math.PI*2,true); // Outer circle
    ctx.moveTo(110,75);
    ctx.arc(75,75,35,0,Math.PI,false);   // Mouth (clockwise)
    ctx.moveTo(65,65);
    ctx.arc(60,65,5,0,Math.PI*2,true);  // Left eye
    ctx.moveTo(95,65);
    ctx.arc(90,65,5,0,Math.PI*2,true);  // Right eye
    ctx.stroke();
}