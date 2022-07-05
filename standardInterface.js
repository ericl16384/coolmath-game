"use strict"; // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode/Transitioning_to_strict_mode


//const keysPressed = {};
//function keyDownHandler(e) {
//    keysPressed[e.key] = true;
//}
//function keyUpHandler(e) {
//    keysPressed[e.key] = false;
//}

//function clickHandler() {
//    // paragraph.style.display = "block";
//    // paragraph.innerHTML += "!";
//}


var canvas = document.getElementById("main-canvas");
var ctx = canvas.getContext("2d");

var sidePanel = document.getElementById("side-panel");

var ticksPerSecond = 20;
var ticks = -1;


//function draw() {}
//function update() {}
var draw = undefined;
var update = undefined;


setInterval(function() {
    if(draw !== undefined) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw();
    }
}, 10);

setInterval(function() {
    if(update !== undefined) {
        ticks++;
        update();
    }
}, 1000/ticksPerSecond);

// https://www.w3schools.com/jsref/dom_obj_event.asp
//document.addEventListener("keydown", keyDownHandler, false);
//document.addEventListener("keyup", keyUpHandler, false);
//document.addEventListener("click", clickHandler);