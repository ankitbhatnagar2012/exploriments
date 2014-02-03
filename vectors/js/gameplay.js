var current_initial_position = {
	x : canvas.width/2,
	y : canvas.height/2
};
var current_ending_position = {};
var current_number_of_vectors = 0;
var overflowDone = 0;
var movingVector;
var result = 0;

var resultantVector = {};

current_initial_position.x = canvas.width/2;
current_initial_position.y = canvas.height/2;

var allVectors = [];

// gameplay functions
function init(){	

	// register event handlers
	canvas.addEventListener('mousemove', mouseMoveLeft, false);
	canvas.addEventListener('mousedown', mouseDownLeft, false);
	canvas.addEventListener('mouseup', mouseUpLeft, false);
	// canvas.addEventListener('click', mouseClick, false);
        
    canvas.addEventListener('touchmove', touchMoveLeft, false);
    canvas.addEventListener('touchstart', touchStartLeft, false);
    canvas.addEventListener('touchend', touchEndLeft, false);

    drawGrid();

}

function resetSystem(){
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    current_initial_position = {
	x : canvas.width/2,
	y : canvas.height/2
    };
    current_ending_position = {};
    current_number_of_vectors = 0;
    overflowDone = 0;
    
    result = 0;

    resultantVector = {};
    
    allVectors = [];
    
    gameDetails.innerHTML = "";
}

function drawGrid(){

	// draw other integral lines
	
	var i,_x,_y;

	_x = canvas.width/2;
	for(i=1;i<=14;i++){
		// positive
		_x = _x + 25;
		ctx.beginPath();
		ctx.strokeStyle = '#cccccc';
		ctx.moveTo(_x, 0);
		ctx.lineTo(_x, canvas.height);
		ctx.lineWidth = 1;
		ctx.stroke();
	}

	_x = canvas.width/2;
	for(i=1;i<=14;i++){
		// positive
		_x = _x - 25;
		ctx.beginPath();
		ctx.strokeStyle = '#cccccc';
		ctx.moveTo(_x, 0);
		ctx.lineTo(_x, canvas.height);
		ctx.lineWidth = 1;
		ctx.stroke();
	}

	_y = canvas.height/2;
	for(i=1;i<=10;i++){
		// positive
		_y = _y + 25;
		ctx.beginPath();
		ctx.strokeStyle = '#cccccc';
		ctx.moveTo(0, _y);
		ctx.lineTo(canvas.width, _y);
		ctx.lineWidth = 1;
		ctx.stroke();
	}

	_y = canvas.height/2;
	for(i=1;i<=10;i++){
		// positive
		_y = _y - 25;
		ctx.beginPath();
		ctx.strokeStyle = '#cccccc';
		ctx.moveTo(0, _y);
		ctx.lineTo(canvas.width, _y);
		ctx.lineWidth = 1;
		ctx.stroke();
	}

	// draw axes
	ctx.beginPath();
	ctx.strokeStyle = 'black';
	ctx.moveTo(0, canvas.height/2);
	ctx.lineTo(canvas.width, canvas.height/2);
	ctx.lineWidth = 2;
	ctx.stroke();

	// draw axes
	ctx.beginPath();
	ctx.strokeStyle = 'black';
	ctx.moveTo(canvas.width/2, 0);
	ctx.lineTo(canvas.width/2, canvas.height);
	ctx.lineWidth = 2;
	ctx.stroke();

}

function createVector(){

	// configure the vector and add it to the vectors list
	if(current_number_of_vectors >= 4){
		$('#createBtn').hide();
	}

	var tempVector = {};

	tempVector.idx = current_number_of_vectors;
	current_number_of_vectors++;
	
	tempVector.idx = current_number_of_vectors; 

	var i;
	for(i=0;i<allVectors.length;i++){
		current_initial_position.x = allVectors[i].endX;
		current_initial_position.y = allVectors[i].endY;
	}

	tempVector.startX = current_initial_position.x;
	tempVector.startY = current_initial_position.y;

	// calculate the initial ending position here
	if(overflowDone === 0){
		current_ending_position.x = current_initial_position.x + 100;
		current_ending_position.y = current_initial_position.y - 100;
	}

	if(current_initial_position.x >= canvas.width/2 && current_initial_position.y <= canvas.height/2){
		
		// in first quadrant
		if(current_initial_position.y < 100 || current_initial_position.x > canvas.width-100){

			// check first quadrant overflow	
			overflowDone = 1;
			current_ending_position.x = current_initial_position.x - 100;
			current_ending_position.y = current_initial_position.y;

		} 

	} else if(current_initial_position.x <= canvas.width/2 && current_initial_position.y <= canvas.height/2){

		// in second quadrant
		if(current_initial_position.x < 150){

			// check second quadrant overflow
			current_ending_position.x = current_initial_position.x;
			current_ending_position.y = current_initial_position.y + 100;

		} else {

			current_ending_position.x = current_initial_position.x - 100;
			current_ending_position.y = current_initial_position.y;

		}

	} else if(current_initial_position.x <= canvas.width/2 && current_initial_position.y >= canvas.height/2){

		// in third quadrant
		if(current_initial_position.y > canvas.height-150){

			// check third quadrant overflow
			current_ending_position.x = current_initial_position.x + 100;
			current_ending_position.y = current_initial_position.y;

		} else {

			current_ending_position.x = current_initial_position.x;
			current_ending_position.y = current_initial_position.y + 100;

		}

	} else if(current_initial_position.x >= canvas.width/2 && current_initial_position.y >= canvas.height/2){

		// in fourth quadrant
		if(current_initial_position.x > canvas.width-150){

			// check fourth quadrant overflow
			current_ending_position.x = current_initial_position.x;
			current_ending_position.y = current_initial_position.y - 100;

		} else {

			current_ending_position.x = current_initial_position.x + 100;
			current_ending_position.y = current_initial_position.y;

		}

	}
	
	tempVector.endX = current_ending_position.x;
	tempVector.endY = current_ending_position.y;

	tempVector.move = 0; // by default

	// compute the impending angle with this line
	tempVector.angle = degree(computeAngle(
		current_initial_position.x,
		current_initial_position.y,
		current_ending_position.x,
		current_ending_position.y));

	// compute the magnitude of the line
	tempVector.magnitude = getDistance(current_initial_position.x,
		current_initial_position.y,
		current_ending_position.x,
		current_ending_position.y);

	// draw this vector
	ctx.beginPath();

	// assign color to this vector
	switch(current_number_of_vectors){
		case 1:
			tempVector.color = 'blue';
			ctx.strokeStyle = 'blue';
			ctx.fillStyle = 'blue';
			break;
		case 2:
			tempVector.color = 'green';
			ctx.strokeStyle = 'green';
			ctx.fillStyle = 'green';			
			break;
		case 3:
			tempVector.color = 'yellow';
			ctx.strokeStyle = 'yellow';
			ctx.fillStyle = 'yellow';			
			break;
		case 4:
			tempVector.color = 'orange';
			ctx.strokeStyle = 'orange';
			ctx.fillStyle = 'orange';
			break;
		case 5:
			tempVector.color = 'purple';
			ctx.strokeStyle = 'purple';
			ctx.fillStyle = 'purple';
	}

	ctx.moveTo(tempVector.startX, tempVector.startY);
	ctx.lineTo(tempVector.endX, tempVector.endY);
	ctx.lineWidth = 5;
	ctx.stroke();

	// drawing the arrow head
	triangle = getAngle(ctx, 
    	tempVector.startX, 
    	tempVector.startY, 
    	tempVector.angle, 
    	tempVector.magnitude-10);

    end1 = getAngle(ctx,
    	triangle.x,
    	triangle.y,
    	90+tempVector.angle,
    	10);

	end2 = getAngle(ctx,
    	triangle.x,
    	triangle.y,
    	tempVector.angle-90,
    	10);

	ctx.beginPath();
        ctx.moveTo(end1.x,end1.y);
        ctx.lineWidth = 3;
        ctx.lineTo(tempVector.endX,tempVector.endY);
        ctx.lineTo(end2.x,end2.y);
        ctx.fill();

	// add to vectors collection
	allVectors.push(tempVector);

	renderGameDetails();

	// console.log(allVectors);

	// update default configuration for next vector
	current_initial_position.x = current_ending_position.x;
	current_initial_position.y = current_ending_position.y;

}

function renderGameDetails(){ 

	var str = "";
	if(allVectors.length > 0){
		str += '<div class="vectorProp" style="height:20px;margin-top:10px;">';
			str += '<div class="vectorPropLeft" style="height:20px;"></div>';				
			str += '<div class="vectorPropCenter" style="height:20px;">';
				str += '<p class="vectorX"><b>Magnitude</b></p>';
			str += '</div>';
			str += '<div class="vectorPropRight" style="height:20px;">';
				str += '<p class="vectorX"><b>Angle</b></p>';
			str += '</div>';
		str += '</div>';
	}

	var i;
	for(i=0;i<allVectors.length;i++){

		var magnitude = allVectors[i].magnitude;
		magnitude = String(magnitude);
		magnitude = magnitude.substring(0,6);

		var deltaX = allVectors[i].startX;
		deltaX = String(deltaX);
		deltaX = magnitude.substring(0,6);

		var deltaY = allVectors[i].startY;
		deltaY = String(deltaY);
		deltaY = magnitude.substring(0,6);

		var angle = allVectors[i].angle;
		angle = String(angle);
		angle = angle.substring(0,6);

		str += '<div class="vectorProp">';
			str += '<div class="vectorPropLeft" style="background-color:'+allVectors[i].color+'">';
				// str += '<img src="#" class="vectorImage" />';
			str += '</div>';
			str += '<div class="vectorPropCenter">';
				str += '<p class="vectorMagnitude">'+magnitude+'</p>';
				str += '<p class="vectorX">Vx = '+deltaX+'</p>';
				str += '<p class="vectorX">Vy = '+deltaY+'</p>';
			str += '</div>';
			str += '<div class="vectorPropRight">';
				str += '<p class="vectorMagnitude">'+angle+'</p>';
			str += '</div>';
		str += '</div>';
	}                    

	if(result === 1){
            
                var magnitude = resultantVector.magnitude;
		magnitude = String(magnitude);
		magnitude = magnitude.substring(0,6);

		var angle = resultantVector.angle;
		angle = String(angle);
		angle = angle.substring(0,6);
            
		str += '<hr style="border-bottom:3px solid #9c9c9c;">';
		str += '<div class="vectorProp">';
			str += '<div class="vectorPropLeft" style="background-color:red">';
				// str += '<img src="#" class="vectorImage" />';
			str += '</div>';
			str += '<div class="vectorPropCenter">';
				str += '<p class="vectorMagnitude">'+magnitude+'</p>';
				str += '<p class="vectorX">Vx = '+deltaX+'</p>';
				str += '<p class="vectorX">Vy = '+deltaY+'</p>';
			str += '</div>';
			str += '<div class="vectorPropRight">';
				str += '<p class="vectorMagnitude">'+angle+'</p>';
			str += '</div>';
		str += '</div>';
	}

	gameDetails.innerHTML = str;
}

function enableResultVector(){
	result = 1;
	drawSystem();
}

function addVector(){

	// add the vector system and draw the resultant
	var i;
	var vector;
	var lastX,lastY;
	for(i=0;i<allVectors.length;i++){
		lastX = allVectors[i].endX;
		lastY = allVectors[i].endY;		
	}

	// draw resultant vector
	dashedLine(canvas.width/2, 
		canvas.height/2, 
		lastX, 
		lastY, 
		8);

	var angle = degree(computeAngle(canvas.width/2, canvas.height/2, lastX, lastY));
	var magnitude = getDistance(canvas.width/2, canvas.height/2, lastX, lastY);
        
        resultantVector.angle = angle;
        resultantVector.magnitude = magnitude;

	// drawing the arrow head
	triangle = getAngle(ctx, 
    	canvas.width/2, 
    	canvas.height/2, 
    	angle, 
    	magnitude-10);

        end1 = getAngle(ctx,
    	triangle.x,
    	triangle.y,
    	90+angle,
    	10);

	end2 = getAngle(ctx,
    	triangle.x,
    	triangle.y,
    	angle-90,
    	10);

	ctx.beginPath();
        ctx.moveTo(end1.x,end1.y);
        ctx.lineWidth = 3;
        ctx.lineTo(lastX,lastY);
        ctx.lineTo(end2.x,end2.y);
        ctx.fillStyle = 'red';
        ctx.fill();

	renderGameDetails();
}

// touch handlers
function touchMoveLeft(e){
    // touch handler to respond to touch movement
    // e.preventDefault();
    var touch = e.touches[0];
    
    // find touch co-ordinates after removing the offset set by the canvas body
    var x = touch.pageX - getOffsetLeft(canvas);
    var y = touch.pageY - getOffsetTop(canvas);

    var i,j;
	for(i=0;i<allVectors.length;i++){
		
		if(allVectors[i].move === 1){
			
			// change the positions for this vector
			allVectors[i].endX = x;
			allVectors[i].endY = y;
			
			allVectors[i].magnitude = getDistance(allVectors[i].startX,
				allVectors[i].startY,
				x,
				y);
			
			allVectors[i].angle = degree(computeAngle(allVectors[i].startX,
				allVectors[i].startY,
				x,
				y));

			// console.log(allVectors[i].angle);
			// console.log(allVectors[i].startX + " " + allVectors[i].startY + " " + allVectors[i].endX + " " + allVectors[i].endX + " " + allVectors[i].angle + " " + allVectors[i].magnitude + " " + allVectors[i].move);

			// console.log(allVectors[i].angle);

			// propagate forward the change in the system
			for(j=i+1;j<allVectors.length;j++){
				allVectors[j].startX = allVectors[j-1].endX;
				allVectors[j].startY = allVectors[j-1].endY;	
			}

			break;

		}
	}

	drawMobileSystem(e);

	renderGameDetails();	    
    
}

function touchStartLeft(e){
    // touch handler to respond to touch start 
    e.preventDefault();
    var touch = e.touches[0];
    
    // find touch co-ordinates after removing the offset set by the canvas body
    var xCord = touch.pageX - getOffsetLeft(canvas);
    var yCord = touch.pageY - getOffsetTop(canvas);
    
    
    // find which vector has been clicked
    var i,vector,dis;
    for(i=0;i<allVectors.length;i++){

            vector = allVectors[i];

            dis = getDistance(xCord, 
                    yCord, 
                    vector.endX,
                    vector.endY);

            if(dis < 20){
                    // movingVector = vector.idx;
                    allVectors[i].move = 1;
                    break;
            }		

    }
    // set the <i>th vector to move    

}

function touchEndLeft(e){
    // touch handler to respond to touch end
    // e.preventDefault();
    
    // var touch = e.touches[0];
    // var x = touch.pageX - getOffsetLeft(canvas);
    // var y = touch.pageY - getOffsetTop(canvas);
    
    var i;
	for(i=0;i<allVectors.length;i++){
		if(allVectors[i].move === 1){
			// change the positions for this vector
			allVectors[i].move = 0;
			break;
		}
		
	}        
        
        drawSystem();

   
	
}

// mouse handlers
function mouseClick(event){

}

function mouseMoveLeft(event) {

	var bRect = canvas.getBoundingClientRect();
	var x = (event.clientX-bRect.left)*(canvas.width/bRect.width);
	var y = (event.clientY-bRect.top)*(canvas.height/bRect.height);

	var i,j;
	for(i=0;i<allVectors.length;i++){
		
		if(allVectors[i].move === 1){
			
			// change the positions for this vector
			allVectors[i].endX = x;
			allVectors[i].endY = y;
			
			allVectors[i].magnitude = getDistance(allVectors[i].startX,
				allVectors[i].startY,
				x,
				y);
			
			allVectors[i].angle = degree(computeAngle(allVectors[i].startX,
				allVectors[i].startY,
				x,
				y));

			// console.log(allVectors[i].angle);
			// console.log(allVectors[i].startX + " " + allVectors[i].startY + " " + allVectors[i].endX + " " + allVectors[i].endX + " " + allVectors[i].angle + " " + allVectors[i].magnitude + " " + allVectors[i].move);

			// console.log(allVectors[i].angle);

			// propagate forward the change in the system
			for(j=i+1;j<allVectors.length;j++){
				allVectors[j].startX = allVectors[j-1].endX;
				allVectors[j].startY = allVectors[j-1].endY;	
			}

			break;

		}
	}

	drawSystem();

	renderGameDetails();	
	
}

function mouseDownLeft(event) {

	var bRect = canvas.getBoundingClientRect(); // awesome
	var mouseX = (event.clientX-bRect.left)*(canvas.width/bRect.width);
	var mouseY = (event.clientY-bRect.top)*(canvas.height/bRect.height);

	// find which vector has been clicked
	var i,vector,dis;
	for(i=0;i<allVectors.length;i++){
		
		vector = allVectors[i];

		dis = getDistance(mouseX,mouseY,vector.endX,vector.endY);

		if(dis < 10){
			// movingVector = vector.idx;
			allVectors[i].move = 1;
			break;
		}		

	}

	// set the <i>th vector to move

	
}

function mouseUpLeft(event) {

	var bRect = canvas.getBoundingClientRect(); // awesome
	var mouseX = (event.clientX-bRect.left)*(canvas.width/bRect.width);
	var mouseY = (event.clientY-bRect.top)*(canvas.height/bRect.height);

	var i;
	for(i=0;i<allVectors.length;i++){
		if(allVectors[i].move === 1){
			// change the positions for this vector
			allVectors[i].move = 0;
			break;
		}
		
		
	}

	drawSystem();
	
}

function drawMobileSystem(e){

	var touch = e.touches[0];
        var x = touch.pageX - getOffsetLeft(canvas);
        var y = touch.pageY - getOffsetTop(canvas);
        
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawGrid();
	var i,dis;
	for(i=0;i<allVectors.length;i++){
		
		if(allVectors[i].move === 1){
			// plot this graph straight away
			ctx.beginPath();
			ctx.strokeStyle = allVectors[i].color;
			ctx.moveTo(allVectors[i].startX, allVectors[i].startY);    		
    		ctx.lineWidth = 5;
    		ctx.lineTo(x, y);
    		ctx.stroke();

    		// draw drag ball
    		ctx.beginPath();
			ctx.arc(x, 
				y, 
				8, 
				0, 
				Math.PI*2, 
				true);
			ctx.fillStyle = allVectors[i].color;
			ctx.fill();

		} else {

			// draw this vector
			
			ctx.beginPath();
			ctx.strokeStyle = allVectors[i].color;
			ctx.fillStyle = allVectors[i].color;			
			
		    // normalise angle measure
		    angle = allVectors[i].angle % 360;
		    
		    pos = getAngle(ctx, 
		    	allVectors[i].startX, 
		    	allVectors[i].startY, 
		    	angle, 
		    	allVectors[i].magnitude);

		    triangle = getAngle(ctx, 
		    	allVectors[i].startX, 
		    	allVectors[i].startY, 
		    	angle, 
		    	allVectors[i].magnitude-10);

		    end1 = getAngle(ctx,
		    	triangle.x,
		    	triangle.y,
		    	90+angle,
		    	10);

			end2 = getAngle(ctx,
		    	triangle.x,
		    	triangle.y,
		    	angle-90,
		    	10);


		    // update vector positions
			allVectors[i].endX = pos.x;
			allVectors[i].endY = pos.y;
			// magnitude & direction remains constant for all family members		    

		    ctx.moveTo(allVectors[i].startX, allVectors[i].startY);
		    ctx.lineTo(allVectors[i].endX, allVectors[i].endY);
		    ctx.lineWidth = 5;
		    ctx.stroke();

		    // plot the triangle at the end
		    ctx.beginPath();
    		ctx.moveTo(end1.x,end1.y);
    		ctx.lineWidth = 3;
    		ctx.lineTo(allVectors[i].endX,allVectors[i].endY);
    		ctx.lineTo(end2.x,end2.y);
    		ctx.fill();
		    
		}
	}

	if(result === 1){
		addVector();
	}
}

function drawSystem(){

	var bRect = canvas.getBoundingClientRect();
	var x = (event.clientX-bRect.left)*(canvas.width/bRect.width);
	var y = (event.clientY-bRect.top)*(canvas.height/bRect.height);
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawGrid();
	var i,dis;
	for(i=0;i<allVectors.length;i++){
		
		if(allVectors[i].move === 1){
			// plot this graph straight away
			ctx.beginPath();
			ctx.strokeStyle = allVectors[i].color;
			ctx.moveTo(allVectors[i].startX, allVectors[i].startY);    		
    		ctx.lineWidth = 5;
    		ctx.lineTo(x, y);
    		ctx.stroke();

    		// draw drag ball
    		ctx.beginPath();
			ctx.arc(x, 
				y, 
				8, 
				0, 
				Math.PI*2, 
				true);
			ctx.fillStyle = allVectors[i].color;
			ctx.fill();

		} else {

			// draw this vector
			
			ctx.beginPath();
			ctx.strokeStyle = allVectors[i].color;
			ctx.fillStyle = allVectors[i].color;			
			
		    // normalise angle measure
		    angle = allVectors[i].angle % 360;
		    
		    pos = getAngle(ctx, 
		    	allVectors[i].startX, 
		    	allVectors[i].startY, 
		    	angle, 
		    	allVectors[i].magnitude);

		    triangle = getAngle(ctx, 
		    	allVectors[i].startX, 
		    	allVectors[i].startY, 
		    	angle, 
		    	allVectors[i].magnitude-10);

		    end1 = getAngle(ctx,
		    	triangle.x,
		    	triangle.y,
		    	90+angle,
		    	10);

			end2 = getAngle(ctx,
		    	triangle.x,
		    	triangle.y,
		    	angle-90,
		    	10);


		    // update vector positions
			allVectors[i].endX = pos.x;
			allVectors[i].endY = pos.y;
			// magnitude & direction remains constant for all family members		    

		    ctx.moveTo(allVectors[i].startX, allVectors[i].startY);
		    ctx.lineTo(allVectors[i].endX, allVectors[i].endY);
		    ctx.lineWidth = 5;
		    ctx.stroke();

		    // plot the triangle at the end
		    ctx.beginPath();
    		ctx.moveTo(end1.x,end1.y);
    		ctx.lineWidth = 3;
    		ctx.lineTo(allVectors[i].endX,allVectors[i].endY);
    		ctx.lineTo(end2.x,end2.y);
    		ctx.fill();
		    
		}
	}

	if(result === 1){
		addVector();
	}
}

function getTriangle(ctx, x, y, angle, h){
}

function getAngle(ctx, x, y, angle, h) {

	var radians = angle * (Math.PI / 180);
    return { x: x + h * Math.cos(radians), y: y - h * Math.sin(radians) };
    /*
    if(angle >= 0.0 && angle <= 90.0){
    	
    	return { x: x + h * Math.cos(radians), y: y - h * Math.sin(radians) };

    } else if(angle > 90.0 && angle <= 180.0) {
    	
    	return { x: x - h * Math.cos(radians), y: y - h * Math.sin(radians) };

    } else if(angle > 180.0 && angle <= 270.0) {
    	
    	return { x: x - h * Math.cos(radians), y: y + h * Math.sin(radians) };

    } else if(angle > 270.0 && angle <= 360.0 || angle > -90.0 && angle < 0.0){
    	
    	return { x: x + h * Math.cos(radians), y: y + h * Math.sin(radians) };

    } else {
    	
    	return { x: x + h * Math.cos(radians), y: y + h * Math.sin(radians) };

    }
    */
    	
}

// miscellaneous function
function radians(degree) {
	return (degree*22)/(7*180);
}

function degree(radians) {
	return (radians * 7 * 180)/(22);
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

function drawArrow(context, arrow) {
    context.beginPath();
    context.lineWidth = 5;
    context.moveTo(arrow[arrow.length-1][0],arrow[arrow.length-1][1]);
    for(var i=0;i<arrow.length;i++){
        context.lineTo(arrow[i][0],arrow[i][1]);
    }
    context.closePath();
    context.fill();
};

function moveArrow(arrow, x, y) {
 	var rv = [];
    for(var i=0;i<arrow.length;i++){
        rv.push([arrow[i][0]+x, arrow[i][1]+y]);
    }
    return rv;
};

function rotateArrow(arrow,angle) {
    var rv = [];
    for(var i=0; i<arrow.length;i++){
        rv.push([(arrow[i][0] * Math.cos(angle)) - (arrow[i][1] * Math.sin(angle)),
                 (arrow[i][0] * Math.sin(angle)) + (arrow[i][1] * Math.cos(angle))]);
    }
    return rv;
};

function drawLineArrow(context, fromX, fromY, toX, toY, arrow) { 
    context.beginPath();
    context.moveTo(fromX,fromY);
    context.lineTo(toX,toY);
    context.stroke();

    var angle = Math.atan2(toY-fromY, toX-fromX);
    drawArrow(moveArrow(rotateArrow(arrow,angle),toX,toY));
};

function computeAngle(x1,y1,x2,y2){
	
	// line 1 :- canvas.width/2, canvas.height/2 ---> canvas.width, canvas.height/2
	// line 2 :- x1, y1 ---> x2, y2
	var angle1 = Math.atan2(0, canvas.width/2);
    var angle2 = Math.atan2(y2 - y1, x2 - x1);
    return (angle1-angle2);

}

function normaliseCords(){
	
	var axisPosX, axisPosY;

	// need to normalise mouse positions with respect to the new axes
	if(mouseX >= canvas.width/2){
		// first or fourth quadrant
		if(mouseY >= canvas.height/2){
			// fourth quadrant
			axisPosX = mouseX - canvas.width/2;
			axisPosY = -1*(mouseY - canvas.height/2);
			alert(axisPosX + " " + axisPosY);
		} else {
			// first quadrant
			axisPosX = mouseX - canvas.width/2;
			axisPosY = canvas.height/2 - mouseY;
			alert(axisPosX + " " + axisPosY);
		}
	} else {
		// second or third quadrant
		if(mouseY >= canvas.height/2){
			// third quadrant
			axisPosX = -1*(canvas.width/2 - mouseX);
			axisPosY = -1*(mouseY - canvas.height/2);
			alert(axisPosX + " " + axisPosY);
		} else {
			// second quadrant
			axisPosX = -1*(canvas.width/2 - mouseX);
			axisPosY = canvas.height/2 - mouseY
			alert(axisPosX + " " + axisPosY);
		}
	}

}

function getDistance(x1,y1,x2,y2){

	return Math.sqrt( (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1) );

}

function dashedLine(x1, y1, x2, y2, dashLen) {
    if (dashLen == undefined) dashLen = 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'red';

    var dX = x2 - x1;
    var dY = y2 - y1;
    var dashes = Math.floor(Math.sqrt(dX * dX + dY * dY) / dashLen);
    var dashX = dX / dashes;
    var dashY = dY / dashes;

    var q = 0;
    while (q++ < dashes) {
        x1 += dashX;
        y1 += dashY;
        if(q%2 === 0){
        	ctx.moveTo(x1,y1);
        } else {
        	ctx.lineTo(x1,y1);
        }
    }
    
    if(q%2 === 0){
    	ctx.moveTo(x2,y2);
    } else {
    	ctx.lineTo(x2,y2);
    }

    ctx.stroke();
}




