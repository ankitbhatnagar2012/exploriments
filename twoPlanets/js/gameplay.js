// list of pendulum variables
pendulum1.length = 300;
pendulum1.time = 30;
pendulum1.v = 0;
pendulum1.angle = 0;

pendulum2.length = 300;
pendulum2.time = 30;
pendulum2.v = 0;
pendulum2.angle = 0;

// list of bodies
var pivot1 = {};
pivot1.x = canvasLeft.width/2;
pivot1.y = canvasLeft.height/2 - 150;
pivot1.radius = 18;

var anchor1 = {};
anchor1.x = canvasLeft.width/2;
anchor1.y = canvasLeft.height/2 - 150;
anchor1.radius = 10;
anchor1.move = 0;

var bob1 = {};
bob1.x = anchor1.x;
bob1.y = anchor1.y + pendulum1.length;
bob1.radius = 30;
bob1.move = 0;

var pivot2 = {};
pivot2.x = canvasRight.width/2;
pivot2.y = canvasRight.height/2 - 150;
pivot2.radius = 18;

var anchor2 = {};
anchor2.x = canvasRight.width/2;
anchor2.y = canvasRight.height/2 - 150;
anchor2.radius = 10;
anchor2.move = 0;

var bob2 = {};
bob2.x = anchor2.x;
bob2.y = anchor2.y + pendulum2.length;
bob2.radius = 30;
bob2.move = 0;

// list of environment variables
var oangle1 = 0;
var oangle2 = 0;

var angle1 = 0;
var angle2 = 0;

var direction1 = 1;
var direction2 = 1;

var seconds = 0;
var interval = null;

var oscillations1 = 0;
var oscillations2 = 0;

var flag1 = 0;
var flag2 = 0;

var initialBob1 = {};
var initialBob2 = {};

// gameplay functions
function init(){	

	// register event handlers
	canvasLeft.addEventListener('mousemove', mouseMoveLeft, false);
	canvasLeft.addEventListener('mousedown', mouseDownLeft, false);
	canvasLeft.addEventListener('mouseup', mouseUpLeft, false);
        
        canvasLeft.addEventListener('touchmove', touchMoveLeft, false);
        canvasLeft.addEventListener('touchstart', touchStartLeft, false);
        canvasLeft.addEventListener('touchend', touchEndLeft, false);
        
        canvasRight.addEventListener('mousemove', mouseMoveRight, false);
        canvasRight.addEventListener('mousedown',mouseDownRight, false);
        canvasRight.addEventListener('mouseup', mouseUpRight, false);
        
        canvasRight.addEventListener('touchmove', touchMoveRight, false);
        canvasRight.addEventListener('touchstart', touchStartRight, false);
        canvasRight.addEventListener('touchend', touchEndRight, false);

	pendulum(0, 0);

}

// all touch handling functions
function touchMoveRight(e){
    
    // touch handler to respond to touch movement
    // e.preventDefault();
    var touch = e.touches[0];
    
    // find touch co-ordinates after removing the offset set by the canvas body
    var x = touch.pageX - getOffsetLeft(canvasRight);
    var y = touch.pageY - getOffsetTop(canvasRight);

    if (bob2.move === 1) {
            console.log('bob2 moving');
            var xa = -x + anchor2.x;
            var ya = -y + anchor2.y;
            var radians = Math.atan((xa/ya));
            var degrees = degree(radians);
            if (y > pivot2.y && (-30 < degrees < 30)) {
                    ctxLeft.clearRect(0, 0, canvasLeft.width, canvasLeft.height);
                    ctxRight.clearRect(0, 0, canvasRight.width, canvasRight.height);
                    pendulum(degrees, degrees);
            }
    }
    
    if (anchor2.move === 1) {
            var radians = Math.atan(0);
            var degrees = degree(radians);
            anchor2.x = anchor2.x;
            anchor2.y = y;
            pendulum2.length = 300-(y-(canvasRight.height/2)+150);
            if( anchor2.y > ((canvasRight.height/2)-150) 
                    && 
                    anchor2.y < ((canvasRight.height/2)-150+300-100) ){			
                    ctxRight.clearRect(0, 0, canvasRight.width, canvasRight.height);
                    pendulum(degrees, degrees);
            }
    }
    
}

function touchStartRight(e){
    
    // touch handler to respond to touch start 
    e.preventDefault();
    var touch = e.touches[0];
    
    // find touch co-ordinates after removing the offset set by the canvas body
    var xCord = touch.pageX - getOffsetLeft(canvasRight);
    var yCord = touch.pageY - getOffsetTop(canvasRight);
    
    if (typeof rightPendulumSequence !== 'undefined' && rightPendulumSequence !== null) {
        clearInterval(rightPendulumSequence);
        rightPendulumSequence = null;
    }
    
    var dis = Math.sqrt((bob2.x-xCord)*(bob2.x-xCord) + (bob2.y-yCord)*(bob2.y-yCord));
    
    var anchorDis = Math.sqrt((anchor2.x-xCord)*(anchor2.x-xCord) + (anchor2.y-yCord)*(anchor2.y-yCord));

    if(dis < bob2.radius) {
         bob2.move = 1;
    }   
	
    if(anchorDis < anchor2.radius) {
         anchor2.move = 1;
    }    
    
}

function touchEndRight(e){
    
    if(bob2.move === 1) {
        
            bob2.move = 0;
            pendulum1.angle = radians(angle1);
            pendulum2.angle = radians(angle2);

            // remove all listeners before animation begins
            canvasLeft.removeEventListener('touchmove', touchMoveLeft, false);
            canvasLeft.removeEventListener('touchstart', touchStartLeft, false);
            canvasLeft.removeEventListener('touchend', touchEndLeft, false);
            
            canvasRight.removeEventListener('touchmove', touchMoveRight, false);
            canvasRight.removeEventListener('touchstart', touchStartRight, false);
            canvasRight.removeEventListener('touchend', touchEndLeft, false);

            initialBob1.x = bob1.x;
            initialBob1.y = bob1.y;

            initialBob2.x = bob2.x;
            initialBob2.y = bob2.y;

            gameStats();
            
            inMotion = 1;

            rightPendulumSequence = setInterval(animateLeftPendulum, pendulum2.time);
    }
    
    if(anchor2.move === 1){
            anchor2.move = 0;
    }    
    
}

function touchMoveLeft(e){
    // touch handler to respond to touch movement
    // e.preventDefault();
    var touch = e.touches[0];
    
    // find touch co-ordinates after removing the offset set by the canvas body
    var x = touch.pageX - getOffsetLeft(canvasLeft);
    var y = touch.pageY - getOffsetTop(canvasLeft);

    if (bob1.move === 1) {
            console.log('bob1 moving');
            var xa = -x + anchor1.x;
            var ya = -y + anchor1.y;
            var radians = Math.atan((xa/ya));
            var degrees = degree(radians);
            if (y > pivot1.y && (-30 < degrees < 30)) {
                    ctxLeft.clearRect(0, 0, canvasLeft.width, canvasLeft.height);
                    ctxRight.clearRect(0, 0, canvasRight.width, canvasRight.height);
                    pendulum(degrees, degrees);
            }
    }
    
    if (anchor1.move === 1) {
            var radians = Math.atan(0);
            var degrees = degree(radians);
            anchor1.x = anchor1.x;
            anchor1.y = y;
            pendulum1.length = 300-(y-(canvasLeft.height/2)+150);
            if( anchor1.y > ((canvasLeft.height/2)-150) && anchor1.y < ((canvasLeft.height/2)-150+300-100) ){			
                    ctxLeft.clearRect(0, 0, canvasLeft.width, canvasLeft.height);
                    pendulum(degrees, degrees);
            }
    }
    
}

function touchStartLeft(e){
    // touch handler to respond to touch start 
    e.preventDefault();
    var touch = e.touches[0];
    
    // find touch co-ordinates after removing the offset set by the canvas body
    var xCord = touch.pageX - getOffsetLeft(canvasLeft);
    var yCord = touch.pageY - getOffsetTop(canvasLeft);
    
    if (typeof leftPendulumSequence !== 'undefined' && leftPendulumSequence !== null) {
        clearInterval(leftPendulumSequence);
        leftPendulumSequence = null;
    }
    
    var dis = Math.sqrt((bob1.x-xCord)*(bob1.x-xCord) + (bob1.y-yCord)*(bob1.y-yCord));
    
    var anchorDis = Math.sqrt((anchor1.x-xCord)*(anchor1.x-xCord) + (anchor1.y-yCord)*(anchor1.y-yCord));

    if(dis < bob1.radius) {
         bob1.move = 1;
    }   
	
    if(anchorDis < anchor1.radius) {
            anchor1.move = 1;
    }
    
}

function touchEndLeft(e){
    // touch handler to respond to touch end
    // e.preventDefault();
    
    // var touch = e.touches[0];
    // var x = touch.pageX - getOffsetLeft(canvasLeft);
    // var y = touch.pageY - getOffsetTop(canvasLeft);
    
    if(bob1.move === 1) {
        
            bob1.move = 0;
            pendulum1.angle = radians(angle1);
            pendulum2.angle = radians(angle2);

            // remove all listeners before animation begins
            canvasLeft.removeEventListener('touchmove', touchMoveLeft, false);
            canvasLeft.removeEventListener('touchstart', touchStartLeft, false);
            canvasLeft.removeEventListener('touchend', touchEndLeft, false);
            
            canvasRight.removeEventListener('touchmove', touchMoveRight, false);
            canvasRight.removeEventListener('touchstart', touchStartRight, false);
            canvasRight.removeEventListener('touchend', touchEndLeft, false);

            initialBob1.x = bob1.x;
            initialBob1.y = bob1.y;

            initialBob2.x = bob2.x;
            initialBob2.y = bob2.y;

            gameStats();
            
            inMotion = 1;

            leftPendulumSequence = setInterval(animateLeftPendulum, pendulum1.time);
    }
    
    if(anchor1.move === 1){
            anchor1.move = 0;
    }
	
}

function getOffsetLeft(elem){
    // utility to compute how much offset does the elem body have with
    // respect to the document body
    var offsetLeft = 0;
    do{
      if ( !isNaN( elem.offsetLeft ) ){
          offsetLeft += elem.offsetLeft;
      }
    } while( elem === elem.offsetParent );
    return offsetLeft;
    
}

function getOffsetTop(elem){
    // utility to compute how much offset does the elem body have with
    // respect to the document body
    var offsetTop = 0;
    do{
        if( !isNaN( elem.offsetTop )){
            offsetTop += elem.offsetTop;
        }
    } while( elem === elem.offsetParent );
    return offsetTop;
}

// pendulum functions
function pendulum(theta1, theta2){

	// initialise all angles
	oangle1 = -Math.round(theta1);
	angle1 = -Math.round(theta1);

	oangle2 = -Math.round(theta2);
	angle2 = -Math.round(theta2);

	if (theta1 > 0)
		direction1 = 0;
	else {
		direction1 = 1;
		oangle1 = -oangle1;
	}

	if(theta2 > 0)
		direction2 = 0;
	else {
		direction2 = 1;
		oangle2 = -oangle2;
	}	
	
	thetaR1 = radians(theta1);
	thetaR2 = radians(theta2);

	bob1.x = anchor1.x + pendulum1.length * Math.sin(thetaR1);
	bob1.y = anchor1.y + pendulum1.length * Math.cos(thetaR1);

	bob2.x = anchor2.x + pendulum2.length * Math.sin(thetaR2);
	bob2.y = anchor2.y + pendulum2.length * Math.cos(thetaR2);
	
	// draw pivots
	ctxLeft.beginPath();
	ctxLeft.arc(pivot1.x, pivot1.y, pivot1.radius, 0, Math.PI*2, true);
	ctxLeft.fillStyle = '#9c9c9c';
	ctxLeft.fill();

	ctxRight.beginPath();
	ctxRight.arc(pivot2.x, pivot2.y, pivot2.radius, 0, Math.PI*2, true);
	ctxRight.fillStyle = '#9c9c9c';
	ctxRight.fill();

	// draw pivot-anchor line
	ctxLeft.beginPath();
	ctxLeft.strokeStyle = 'red';
	ctxLeft.moveTo(pivot1.x, pivot1.y);
	ctxLeft.lineTo(anchor1.x, anchor1.y);
	ctxLeft.stroke();

	ctxRight.beginPath();
	ctxRight.strokeStyle = 'red';
	ctxRight.moveTo(pivot2.x, pivot2.y);
	ctxRight.lineTo(anchor2.x, anchor2.y);
	ctxRight.stroke();

	// draw anchors
	ctxLeft.beginPath();
	ctxLeft.arc(anchor1.x, anchor1.y, anchor1.radius, 0, Math.PI*2, true);
	ctxLeft.fillStyle = '#000';
	ctxLeft.fill();

	ctxRight.beginPath();
	ctxRight.arc(anchor2.x, anchor2.y, anchor2.radius, 0, Math.PI*2, true);
	ctxRight.fillStyle = '#000';
	ctxRight.fill();

	// draw strings
	ctxLeft.beginPath();
	ctxLeft.strokeStyle = 'black';
	ctxLeft.moveTo(anchor1.x, anchor1.y);
	ctxLeft.lineTo(bob1.x, bob1.y);
	ctxLeft.stroke();

	ctxRight.beginPath();
	ctxRight.strokeStyle = 'black';
	ctxRight.moveTo(anchor2.x, anchor2.y);
	ctxRight.lineTo(bob2.x, bob2.y);
	ctxRight.stroke();

	// draw bobs
	ctxLeft.beginPath();
	ctxLeft.arc(bob1.x, bob1.y, bob1.radius, 0, Math.PI*2, true);
	ctxLeft.fillStyle = 'red';
	ctxLeft.fill();

	ctxRight.beginPath();
	ctxRight.arc(bob2.x, bob2.y, bob2.radius, 0, Math.PI*2, true);
	ctxRight.fillStyle = 'red';
	ctxRight.fill();

}

function drawPendulum(theta1, theta2) {
	
	thetaRy1 = theta1;
	thetaRy2 = theta2;

	bob1.x = anchor1.x + pendulum1.length * Math.sin(-thetaRy1);
	bob1.y = anchor1.y + pendulum1.length * Math.cos(-thetaRy1);

	bob2.x = anchor2.x + pendulum2.length * Math.sin(-thetaRy2);
	bob2.y = anchor2.y + pendulum2.length * Math.cos(-thetaRy2);
	
	// draw pivots
	ctxLeft.beginPath();
	ctxLeft.arc(pivot1.x, pivot1.y, pivot1.radius, 0, Math.PI*2, true);
	ctxLeft.fillStyle = '#9c9c9c';
	ctxLeft.fill();

	ctxRight.beginPath();
	ctxRight.arc(pivot2.x, pivot2.y, pivot2.radius, 0, Math.PI*2, true);
	ctxRight.fillStyle = '#9c9c9c';
	ctxRight.fill();

	// draw pivot-anchor line
	ctxLeft.beginPath();
	ctxLeft.strokeStyle = 'red';
	ctxLeft.moveTo(pivot1.x, pivot1.y);
	ctxLeft.lineTo(anchor1.x, anchor1.y);
	ctxLeft.stroke();

	ctxRight.beginPath();
	ctxRight.strokeStyle = 'red';
	ctxRight.moveTo(pivot2.x, pivot2.y);
	ctxRight.lineTo(anchor2.x, anchor2.y);
	ctxRight.stroke();	

	// draw anchors
	ctxLeft.beginPath();
	ctxLeft.arc(anchor1.x, anchor1.y, anchor1.radius, 0, Math.PI*2, true);
	ctxLeft.fillStyle = '#000';
	ctxLeft.fill();

	ctxRight.beginPath();
	ctxRight.arc(anchor2.x, anchor2.y, anchor2.radius, 0, Math.PI*2, true);
	ctxRight.fillStyle = '#000';
	ctxRight.fill();

	// draw strings
	ctxLeft.beginPath();
	ctxLeft.strokeStyle = 'black';
	ctxLeft.moveTo(anchor1.x, anchor1.y);
	ctxLeft.lineTo(bob1.x, bob1.y);
	ctxLeft.stroke();

	ctxRight.beginPath();
	ctxRight.strokeStyle = 'black';
	ctxRight.moveTo(anchor2.x, anchor2.y);
	ctxRight.lineTo(bob2.x, bob2.y);
	ctxRight.stroke();	

	// draw bobs
	ctxLeft.beginPath();
	ctxLeft.arc(bob1.x, bob1.y, bob1.radius, 0, Math.PI*2, true);
	ctxLeft.fillStyle = 'red';
	ctxLeft.fill();

	ctxRight.beginPath();
	ctxRight.arc(bob2.x, bob2.y, bob2.radius, 0, Math.PI*2, true);
	ctxRight.fillStyle = 'red';
	ctxRight.fill();

	// account for oscillations
	
	if(initialBob1.x > canvasLeft.width/2){
		// oscillation began from right
		if(bob1.x < canvasLeft.width/2 && flag1 === 0) flag1 = 1;
		if(bob1.x > canvasLeft.width/2 && flag1 === 1) { oscillations1++; flag1 = 0; }
	} else if(initialBob1.x < canvasLeft.width/2){
		// oscillation began from left
		if(bob1.x > canvasLeft.width/2 && flag1 === 0) flag1 = 1;
		if(bob1.x < canvasLeft.width/2 && flag1 === 1) { oscillations1++; flag1 = 0; }
	}

	if(initialBob2.x > canvasRight.width/2){
		// oscillation began from right
		if(bob2.x < canvasRight.width/2 && flag2 === 0) flag2 = 1;
		if(bob2.x > canvasRight.width/2 && flag2 === 1) { oscillations2++; flag2 = 0; }
	} else if(initialBob2.x < canvasRight.width/2){
		// oscillation began from left
		if(bob2.x > canvasRight.width/2 && flag2 === 0) flag2 = 1;
		if(bob2.x < canvasRight.width/2 && flag2 === 1) { oscillations2++; flag2 = 0; }
	}	
	
	var str1 = "Number of oscillations: " + Math.round(oscillations1) + "<br>Time elapsed: " + seconds + " sec";
        $('#gameStats1').html(str1);
        var str2 = "Number of oscillations: " + oscillations2 + "<br>Time elapsed: " + seconds + " sec";
        $('#gameStats2').html(str2);
}

function animateLeftPendulum() {

    var k = -pendulum1.g / pendulum1.length;
    var timestep_s = pendulum1.time / 100;
    var acceleration = k * Math.sin(pendulum1.angle);
    pendulum1.v += acceleration * timestep_s;
    pendulum1.angle += pendulum1.v * timestep_s;

    k = -pendulum2.g / pendulum2.length;
    timestep_s = pendulum2.time / 100;
    acceleration = k * Math.sin(pendulum2.angle);
    pendulum2.v += acceleration * timestep_s;
    pendulum2.angle += pendulum2.v * timestep_s;

    ctxLeft.clearRect(0, 0, canvasLeft.width, canvasLeft.height);
    ctxRight.clearRect(0, 0, canvasRight.width, canvasRight.height);
    ctxLeft.save();
    ctxRight.save();
    drawPendulum(pendulum1.angle, pendulum2.angle);
    ctxLeft.restore();
    ctxRight.restore();

}

function stopAnimation(){

	if (typeof leftPendulumSequence !== 'undefined' && leftPendulumSequence !== null) {
		clearInterval(leftPendulumSequence);
		leftPendulumSequence = null;
	}
        
        if (typeof rightPendulumSequence !== 'undefined' && rightPendulumSequence !== null) {
		clearInterval(rightPendulumSequence);
		rightPendulumSequence = null;
	}

	ctxLeft.clearRect(0, 0, canvasLeft.width, canvasLeft.height);
	ctxRight.clearRect(0, 0, canvasRight.width, canvasRight.height);
	oangle1 = angle1 = oangle2 = angle2 = 0;
	direction1 = direction2 = 1;
	
	pendulum1.v = pendulum2.v = 0;
	pendulum1.angle = pendulum2.angle = 0;
	pendulum1.length = pendulum2.length = 300;
	pendulum1.time = pendulum2.time = 30;
        
        pivot1.x = canvasLeft.width/2;
	pivot1.y = canvasLeft.height/2 - 150;
	pivot1.radius = 18;
        
        anchor1.x = canvasLeft.width/2;
	anchor1.y = canvasLeft.height/2 - 150;
	anchor1.radius = 10;
	anchor1.move = 0;

	bob1.x = anchor1.x;
	bob1.y = anchor1.y + pendulum1.length;
	bob1.radius = 30;
	bob1.move = 0;

	pivot2.x = canvasRight.width/2;
	pivot2.y = canvasRight.height/2 - 150;
	pivot2.radius = 18;

	anchor2.x = canvasRight.width/2;
	anchor2.y = canvasRight.height/2 - 150;
	anchor2.radius = 10;
	anchor2.move = 0;

	bob2.x = anchor2.x;
	bob2.y = anchor2.y + pendulum2.length;
	bob2.radius = 30;
	bob2.move = 0;

	pendulum(0, 0);
        
        inMotion = 0;

	oscillations1 = oscillations2 = 0;
	seconds = 0;
	flag1 = flag2 = 0;
	clearInterval(interval);

	var str = "Number of oscillations: " + oscillations1 + "<br>Time elapsed: 0 sec";
   	$('#gameStats1').html(str);
   	$('#gameStats2').html(str);

        // adding all click handlers again
	canvasLeft.addEventListener('mousemove', mouseMoveLeft, false);
	canvasLeft.addEventListener('mousedown', mouseDownLeft, false);
	canvasLeft.addEventListener('mouseup', mouseUpLeft, false);
        
        canvasRight.addEventListener('mousemove', mouseMoveRight, false);
        canvasRight.addEventListener('mousedown', mouseDownRight, false);
        canvasRight.addEventListener('mouseup', mouseUpRight, false);
        
        // adding all touch handlers again
        canvasLeft.addEventListener('touchmove', touchMoveLeft, false);
	canvasLeft.addEventListener('touchstart', touchStartLeft, false);
	canvasLeft.addEventListener('touchend', touchEndLeft, false);
        
        canvasRight.addEventListener('touchmove', touchMoveRight, false);
        canvasRight.addEventListener('touchstart', touchStartRight, false);
        canvasRight.addEventListener('touchend', touchEndRight, false);


}

// event handlers
function mouseMoveRight(event){
        
        var bRect = canvasRight.getBoundingClientRect();
	var x = (event.clientX-bRect.left)*(canvasRight.width/bRect.width);
	var y = (event.clientY-bRect.top)*(canvasRight.height/bRect.height);

	if (bob2.move === 1) {
		console.log('bob2 moving');
		var xa = -x + anchor2.x;
		var ya = -y + anchor2.y;
		var radians = Math.atan((xa/ya));
		var degrees = degree(radians);
		if (y > pivot2.y && (-30 < degrees < 30)) {
			ctxLeft.clearRect(0, 0, canvasLeft.width, canvasLeft.height);
			ctxRight.clearRect(0, 0, canvasRight.width, canvasRight.height);
			pendulum(degrees, degrees);
		}
	}

	if (anchor2.move === 1) {
		var radians = Math.atan(0);
		var degrees = degree(radians);
		anchor2.x = anchor2.x;
		anchor2.y = y;
		pendulum2.length = 300-(y-(canvasRight.height/2)+150);
		if( anchor2.y > ((canvasRight.height/2)-150) 
                        && 
                        anchor2.y < ((canvasRight.height/2)-150+300-100) ){
                    
			ctxRight.clearRect(0, 0, canvasRight.width, canvasRight.height);
			pendulum(degrees, degrees);
                        
		}
	}       
        
}

function mouseDownRight(event){
        
        var bRect = canvasRight.getBoundingClientRect(); // awesome
	var mouseX = (event.clientX-bRect.left)*(canvasRight.width/bRect.width);
	var mouseY = (event.clientY-bRect.top)*(canvasRight.height/bRect.height);

	if (typeof rightPendulumSequence !== 'undefined' && rightPendulumSequence !== null) {
		clearInterval(rightPendulumSequence);
		rightPendulumSequence = null;
	}

	var dis = Math.sqrt((bob2.x-mouseX)*(bob2.x-mouseX) + (bob2.y-mouseY)*(bob2.y-mouseY));

	var anchorDis = Math.sqrt((anchor2.x-mouseX)*(anchor2.x-mouseX) + (anchor2.y-mouseY)*(anchor2.y-mouseY)); 

	if(dis < bob2.radius) {
		bob2.move = 1;
	}

	if(anchorDis < anchor2.radius) {
		anchor2.move = 1;
	}        
        
}

function mouseUpRight(event){
        
        var x = event.pageX;
	var y = event.pageY;
	
	if(bob2.move == 1) {
		bob2.move = 0;
		pendulum1.angle = radians(angle1);
		pendulum2.angle = radians(angle2);

		// remove all click listeners before animation begins
		canvasLeft.removeEventListener('mousemove', mouseMoveLeft, false);
	  	canvasLeft.removeEventListener('mousedown', mouseDownLeft, false);
	  	canvasLeft.removeEventListener('mouseup', mouseUpLeft, false);
                
                canvasRight.removeEventListener('mousemove', mouseMoveRight, false);
	  	canvasRight.removeEventListener('mousedown', mouseDownRight, false);
	  	canvasRight.removeEventListener('mouseup', mouseUpRight, false);

	  	initialBob1.x = bob1.x;
	  	initialBob1.y = bob1.y;

	  	initialBob2.x = bob2.x;
	  	initialBob2.y = bob2.y;

	  	gameStats();
                
                inMotion = 1;

		rightPendulumSequence = setInterval(animateLeftPendulum, pendulum2.time);
	}

	if(anchor2.move === 1){
		anchor2.move = 0;
	}
        
}

function mouseMoveLeft(event) {

	var bRect = canvasLeft.getBoundingClientRect();
	var x = (event.clientX-bRect.left)*(canvasLeft.width/bRect.width);
	var y = (event.clientY-bRect.top)*(canvasLeft.height/bRect.height);

	if (bob1.move === 1) {
		console.log('bob1 moving');
		var xa = -x + anchor1.x;
		var ya = -y + anchor1.y;
		var radians = Math.atan((xa/ya));
		var degrees = degree(radians);
		if (y > pivot1.y && (-30 < degrees < 30)) {
			ctxLeft.clearRect(0, 0, canvasLeft.width, canvasLeft.height);
			ctxRight.clearRect(0, 0, canvasRight.width, canvasRight.height);
			pendulum(degrees, degrees);
		}
	}

	if (anchor1.move === 1) {
		var radians = Math.atan(0);
		var degrees = degree(radians);
		anchor1.x = anchor1.x;
		anchor1.y = y;
		pendulum1.length = 300-(y-(canvasLeft.height/2)+150);
		if( anchor1.y > ((canvasLeft.height/2)-150) && anchor1.y < ((canvasLeft.height/2)-150+300-100) ){			
			ctxLeft.clearRect(0, 0, canvasLeft.width, canvasLeft.height);
			pendulum(degrees, degrees);
		}
	}
	
}

function mouseDownLeft(event) {

	var bRect = canvasLeft.getBoundingClientRect(); // awesome
	var mouseX = (event.clientX-bRect.left)*(canvasLeft.width/bRect.width);
	var mouseY = (event.clientY-bRect.top)*(canvasLeft.height/bRect.height);

	if (typeof leftPendulumSequence !== 'undefined' && leftPendulumSequence !== null) {
		clearInterval(leftPendulumSequence);
		leftPendulumSequence = null;
	}

	var dis = Math.sqrt((bob1.x-mouseX)*(bob1.x-mouseX) + (bob1.y-mouseY)*(bob1.y-mouseY));

	var anchorDis = Math.sqrt((anchor1.x-mouseX)*(anchor1.x-mouseX) + (anchor1.y-mouseY)*(anchor1.y-mouseY)); 

	if(dis < bob1.radius) {
		bob1.move = 1;
	}

	if(anchorDis < anchor1.radius) {
		anchor1.move = 1;
	}
}

function mouseUpLeft(event) {

	var x = event.pageX;
	var y = event.pageY;
	
	if(bob1.move == 1) {
		bob1.move = 0;
		pendulum1.angle = radians(angle1);
		pendulum2.angle = radians(angle2);

		// remove all click listeners before animation begins
		canvasLeft.removeEventListener('mousemove', mouseMoveLeft, false);
	  	canvasLeft.removeEventListener('mousedown', mouseDownLeft, false);
	  	canvasLeft.removeEventListener('mouseup', mouseUpLeft, false);

	  	initialBob1.x = bob1.x;
	  	initialBob1.y = bob1.y;

	  	initialBob2.x = bob2.x;
	  	initialBob2.y = bob2.y;

	  	gameStats();
                
                inMotion = 1;

		leftPendulumSequence = setInterval(animateLeftPendulum, pendulum1.time);
	}

	if(anchor1.move === 1){
		anchor1.move = 0;
	}
}

// miscellaneous function
function radians(degree) {
	return (degree*22)/(7*180);
}

function degree(radians) {
	return (radians * 7 * 180)/(22);
}

function gameStats(){
	seconds = 0;
	interval = setInterval(function(){
    	seconds++;
    }, 1000);
}




