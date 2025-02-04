"use strict";

const worldWidth = 3000; // int
const screenWidth = 1000; // int
const screenHeight = 800; // int
const groundLevel = screenHeight - 25;
const textPos = 830; // int

let screenOffset = 2300;
let userPlane;
let enemyPlane;
let world = [
    new TerrainChunk(0), 
    new Desert(1), 
    new Palm(2), 
    new Desert(3), 
    new FlagRed(4),
    new Desert(5),
    new Desert(6),
    new Palm(7),
    new Desert(8),
    new Desert(9),
    new Desert(10),
    new Ocean(11),
    new Ocean(12),
    new Ocean(13),
    new Ocean(14),
    new Ocean(15),
    new Ocean(16),
    new Desert(17),
    new Desert(18),
    new Airport(19),
    new FlagBlue(20),
    new Airport(21),
    new Airport(22),
    new Airport(23),
    new Palm(24),
    new Desert(25),
    new Ocean(26),
    new Ocean(27),
    new Ocean(28),
    new Ocean(29),
    new Ocean(30),
]

function setup() {
// run once at the beginning
    
    let cnv = createCanvas(screenWidth, screenHeight);
    // cnv.position(100, 50);
    noSmooth();
    // noCursor();

    userPlane = new Plane(screenOffset, groundLevel, Math.PI, 1);
    // enemyPlane = new Plane(screenWidth/2 - 200, screenHeight/2, 0, 2);
};
  
function draw() {
// run with every frame
    console.time();

    // draw screen
    background(135, 206, 235);

    for (let chunk of world) {
        chunk.draw(screenOffset);
    };
    userPlane.draw(screenOffset);
    // enemyPlane.draw(screenOffset);
    // drawLandmarks(screenOffset);

    // draw texts
    fill('black');
    noStroke();
    textSize(20);
    textAlign(LEFT, CENTER);
    text(`Power: ${userPlane.power}`, textPos, 25);
    text(`Speed: ${userPlane.speed.toFixed(2)}`, textPos, 50);
    text(`Climbing: ${userPlane.speedVector.y.toFixed(1)}`, textPos, 75);
    text(`Altitude: ${groundLevel - userPlane.worldCoord.y.toFixed(0)}`, textPos, 100);
    // text flaps
    if (userPlane.flapsTakeOff) {
        text(`Flaps: Take Off`, 10, 25);
    };

    // check and handle buttons' states
    if (keyIsDown(UP_ARROW) === true) {
        userPlane.angle -= deltaAngle*Math.PI/180 * 0.5;
    } else if (keyIsDown(LEFT_ARROW) === true) {
        userPlane.angle -= deltaAngle*Math.PI/180 * 2;
    };
    if (keyIsDown(DOWN_ARROW) === true) {
        userPlane.angle += deltaAngle*Math.PI/180 * 0.5;
    } else if (keyIsDown(RIGHT_ARROW) === true) {
        userPlane.angle += deltaAngle*Math.PI/180 * 2;
    };

    // move objects
    userPlane.move();
    // enemyPlane.move();
    screenOffset = userPlane.worldCoord.x - screenWidth/2;

    // enemyPlane.angle -= Math.PI/180;

    console.timeEnd();
};

function keyPressed() {
// run once when button is pressed
    // aircraft power control
    if (key === '2') {
        userPlane.power = maxPower;
    } else if (key === 'w') {
        // userPlane.speed += deltaVelocity;
        userPlane.power += deltaPower;
    } else if (key === 's') {
        // userPlane.speed -= deltaVelocity;
        userPlane.power -= deltaPower;
    } else if (key === 'x') {
        userPlane.power = 0;
    };
    // flaps
    if (key === 'f') {
        if (userPlane.flapsTakeOff) {
            userPlane.setFlapsNominal()
        } else {
            userPlane.setFlapsTakeOff()
        };
    };
    // show vectors
    if (key === 'v') {
        if (userPlane.showVectors) userPlane.showVectors = false;
        else userPlane.showVectors = true;
    };
};

function drawLandmarks(offset) {
// help tool to draw marks on the ground
    fill('red');
    noStroke();
    for (let i = 0; i < worldWidth; i+=500) {
        circle(i - offset, screenHeight, 20);
    };
};

function drawVector(vector, origin, color='red', scale=1) {
// help tool to draw vector
    stroke(color);
    strokeWeight(2);
    line(origin.x, origin.y, origin.x +  scale*vector.x, origin.y + scale*vector.y);
};

function decidePositionOnScreen(pos) {
// decide if the passed position is on the screen - if not - move it
    if (pos > screenWidth + screenMargin) pos -= worldWidth;
    if (pos < -screenMargin) pos += worldWidth; // checks position after correction
    return pos;
};
