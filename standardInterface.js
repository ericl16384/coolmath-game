"use strict"; // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode/Transitioning_to_strict_mode


// https://keyjs.dev/


// init constants

const ticksPerSecond = 20;


// init reference model

var canvas = document.getElementById("main-canvas");
var ctx = canvas.getContext("2d");

var sidePanel = document.getElementById("side-panel");


// init globals

var ticks = -1;

var mousePosition = new Vector(0, 0);
var mousePressed = false;

var keysPressed = {};


// global helpers

function updateMousePosition(event) {
    var rect = canvas.getBoundingClientRect();
    mousePosition = new Vector(
        event.clientX - rect.left,
        event.clientY - rect.top
    );
}


// undefined functions

var draw;
setInterval(function() {
    if(draw !== undefined) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw();
    }
}, 10);

var update;
setInterval(function() {
    if(update !== undefined) {
        ticks++;
        update();
    }
}, 1000/ticksPerSecond);

var onMouseMove;
document.addEventListener("mousemove", function(event) {
    updateMousePosition(event);
    if(onMouseMove !== undefined) {
        onMouseMove();
    }
});

var onMouseDown;
document.addEventListener("mousedown", function(event) {
    mousePressed = true;
    updateMousePosition(event);
    if(onMouseDown !== undefined) {
        onMouseDown();
    }
});

var onMouseUp;
document.addEventListener("mouseup", function(event) {
    mousePressed = false;
    updateMousePosition(event);
    if(onMouseUp !== undefined) {
        onMouseUp();
    }
});

var onKeyDown;
document.addEventListener("keydown", function(event) {
    keysPressed[event.code] = true;
    if(onKeyDown !== undefined) {
        onKeyDown();
    }
});

var onKeyUp;
document.addEventListener("keyup", function(event) {
    keysPressed[event.code] = false;
    if(onKeyUp !== undefined) {
        onKeyUp();
    }
});
