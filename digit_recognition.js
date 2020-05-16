//-------------------
// GLOBAL variables
//-------------------
let model;

var canvasSize           	= 150;
var canvasStrokeStyle		= "white";
var canvasLineJoin			= "round";
var canvasLineWidth       	= 5;
var canvasBackgroundColor 	= "black";
var canvasId              	= "canvas";

var clickX = new Array();
var clickY = new Array();
var clickD = new Array();
var drawing;

//---------------
// Create canvas
//---------------
var canvasBox = document.getElementById('canvas_box');
var canvas    = document.createElement("canvas");

canvas.setAttribute("width", canvasSize);
canvas.setAttribute("height", canvasSize);
canvas.setAttribute("id", canvasId);
canvas.style.backgroundColor = canvasBackgroundColor;
canvasBox.appendChild(canvas);
if(typeof G_vmlCanvasManager != 'undefined') {
  canvas = G_vmlCanvasManager.initElement(canvas);
}

ctx = canvas.getContext("2d");


//---------------------
// MOUSE DOWN function
//---------------------
$("#canvas").mousedown(function(e) {
	var rect = canvas.getBoundingClientRect();
	var mouseX = e.clientX- rect.left;;
	var mouseY = e.clientY- rect.top;
	drawing = true;
	addUserGesture(mouseX, mouseY);
	drawOnCanvas();
});

//-----------------------
// TOUCH START function
//-----------------------
canvas.addEventListener("touchstart", function (e) {
	if (e.target == canvas) {
    	e.preventDefault();
  	}

	var rect = canvas.getBoundingClientRect();
	var touch = e.touches[0];

	var mouseX = touch.clientX - rect.left;
	var mouseY = touch.clientY - rect.top;

	drawing = true;
	addUserGesture(mouseX, mouseY);
	drawOnCanvas();

}, false);

//---------------------
// MOUSE MOVE function
//---------------------
$("#canvas").mousemove(function(e) {
	if(drawing) {
		var rect = canvas.getBoundingClientRect();
		var mouseX = e.clientX- rect.left;;
		var mouseY = e.clientY- rect.top;
		addUserGesture(mouseX, mouseY, true);
		drawOnCanvas();
	}
});

//---------------------
// TOUCH MOVE function
//---------------------
canvas.addEventListener("touchmove", function (e) {
	if (e.target == canvas) {
    	e.preventDefault();
  	}
	if(drawing) {
		var rect = canvas.getBoundingClientRect();
		var touch = e.touches[0];

		var mouseX = touch.clientX - rect.left;
		var mouseY = touch.clientY - rect.top;

		addUserGesture(mouseX, mouseY, true);
		drawOnCanvas();
	}
}, false);

//-------------------
// MOUSE UP function
//-------------------
$("#canvas").mouseup(function(e) {
	drawing = false;
});

//---------------------
// TOUCH END function
//---------------------
canvas.addEventListener("touchend", function (e) {
	if (e.target == canvas) {
    	e.preventDefault();
  	}
	drawing = false;
}, false);

//----------------------
// MOUSE LEAVE function
//----------------------
$("#canvas").mouseleave(function(e) {
	drawing = false;
});

//-----------------------
// TOUCH LEAVE function
//-----------------------
canvas.addEventListener("touchleave", function (e) {
	if (e.target == canvas) {
    	e.preventDefault();
  	}
	drawing = false;
}, false);

//--------------------
// ADD CLICK function
//--------------------
function addUserGesture(x, y, dragging) {
	clickX.push(x);
	clickY.push(y);
	clickD.push(dragging);
}

//-------------------
// RE DRAW function
//-------------------
function drawOnCanvas() {
	var size = $("#slider").val();
	ctx.clearRect(0, 0, size, size);

	ctx.strokeStyle = canvasStrokeStyle;
	ctx.lineJoin    = canvasLineJoin;
	ctx.lineWidth   = canvasLineWidth;

	for (var i = 0; i < clickX.length; i++) {
		ctx.beginPath();
		if(clickD[i] && i) {
			ctx.moveTo(clickX[i-1], clickY[i-1]);
		} else {
			ctx.moveTo(clickX[i]-1, clickY[i]);
		}
		ctx.lineTo(clickX[i], clickY[i]);
		ctx.closePath();
		ctx.stroke();
	}
}

//------------------------
// CLEAR CANVAS function
//------------------------
$("#clear-button").click(async function () {
	var size = $("#slider").val();
    ctx.clearRect(0, 0, size, size);
	clickX = new Array();
	clickY = new Array();
	clickD = new Array();
	$(".prediction-text").empty();
	$(".percentage-text").empty();
	$("#result_box").hide();
	$("#helperText").show();
});

//-------------------------------------
// loader for cnn model
//-------------------------------------
async function loadModel() {
  console.log("model loading..");

  // clear the model variable
  model = undefined;
  
  // load the model using a HTTPS request (where you have stored your model files)
  model = await tf.loadLayersModel("models/handwritingRecognitionModel.json");
  console.log(model.summary);
  
  $('#preloader').hide();    
  $("#helperText").show();
  $('#predict-button').prop('disabled', false);
}
		
loadModel();

//-----------------------------------------------
// preprocess the canvas
//-----------------------------------------------
function preprocessCanvas(image) {
	// resize the input image to target size of (1, 28, 28)
	let tensor = tf.browser.fromPixels(image)
		.resizeNearestNeighbor([28, 28])
		.mean(2)
		.expandDims(2)
		.expandDims()
		.toFloat();
	console.log(tensor.shape);
	return tensor.div(255.0);
}

//-----------------------------------------------
// check if canvas is blank
//-----------------------------------------------
function isCanvasBlank() {  
	// returns true if every pixel's uint32 representation is 0 (or "blank")
	const pixelBuffer = new Uint32Array(
		ctx.getImageData(0, 0, canvas.width, canvas.height).data.buffer
	);
  
	return !pixelBuffer.some(color => color !== 0);
  }

//--------------------------------------------
// predict function 
//--------------------------------------------
$("#predict-button").click(async function () {
    // get image data from canvas
	// var imageData = canvas.toDataURL('image/png');
	// console.log(imageData);

	if(!isCanvasBlank()){
		// preprocess canvas
		let tensor = preprocessCanvas(canvas);

		// make predictions on the preprocessed image tensor
		let predictions = await model.predict(tensor).data();

		// get the model's prediction results
		let results = Array.from(predictions);

		// display the predictions in chart
		$("#helperText").hide();
		$("#result_box").removeClass('d-none');
		$("#result_box").show();

		//displayChart(results);
		displayLabel(results);

		console.log(results);
	}
	else{
		alert("Please draw a digit in the canvas!");
	}
});

//--------------------------------------------
// display prediction 
//--------------------------------------------
function displayLabel(data) {
	var max = data[0];
    var maxIndex = 0;

    for (var i = 1; i < data.length; i++) {
        if (data[i] > max) {
            maxIndex = i;
            max = data[i];
        }
    }
	$(".prediction-text").html(maxIndex)
	$(".percentage-text").html(Math.trunc(max*100)+"&percnt;");
}

// canvas cannot be maximized to more value in phones
if($(window).width() < 450){
	slider.max = 200;
}

// change canvas size based on slider value
$("#slider").on('input', function() {
	canvas.setAttribute("width", this.value);
	canvas.setAttribute("height", this.value);
});

/*
//------------------------------
// Chart to display predictions
//------------------------------
var chart = "";
var firstTime = 0;
function loadChart(label, data, modelSelected) {
	var ctx = document.getElementById('chart_box').getContext('2d');
	chart = new Chart(ctx, {
	    // The type of chart we want to create
	    type: 'bar',

	    // The data for our dataset
	    data: {
	        labels: label,
	        datasets: [{
	            label: modelSelected + " prediction",
	            backgroundColor: '#f50057',
	            borderColor: 'rgb(255, 99, 132)',
	            data: data,
	        }]
	    },

	    // Configuration options go here
	    options: {}
	});
}

//----------------------------
// display chart with updated
// drawing from canvas
//----------------------------
function displayChart(data) {
	var select_model  = document.getElementById("select_model");
  	var select_option = "CNN";

	label = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
	if (firstTime == 0) {
		loadChart(label, data, select_option);
		firstTime = 1;
	} else {
		chart.destroy();
		loadChart(label, data, select_option);
	}
	$('#chart_box').show();
}
*/