/*
Planes 2025
By Tomasz Golaszewski
01.2025 - 02.2025
*/

"use strict";

const worldWidth = 6000; // int

let screenWidth = 1000; // int
let screenHeight = 800; // int
let groundHeight = 100; // ground height measured from the bottom of the screen
let groundLevel; // ground height measured from the top of the screen
let groundPlaneOverlap = 15;
let textPos;

let screenOffsetHorizontal = 4600;
let screenOffsetVerical = 0;
let imagePlane;
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
    new AirportCenterTile(21),
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

function preload() {
// run before the rest of the script
    /*
    Because of:
    "Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource."
    We can not have nice image in offline mode :(
    You can run locally on Python server:
    python3 -m http.server
    and change false to true inside if below:
    */
    if (false) {
        // load the image
        imagePlane = loadImage('/assets/plane_transparent.png');
    } else {
        // create the p5.Graphics object
        imagePlane = createGraphics(150, 35);
        // draw to the graphics buffer
        imagePlane.noStroke();
        imagePlane.fill(color(169, 169, 169)); // dark gray
        imagePlane.ellipse(140, 17, 20, 35); // tail
        imagePlane.rect(60, 18, 80, 17); // tail
        imagePlane.ellipse(60, 23, 120, 24); // body
        imagePlane.fill(color(119, 119, 119)); // sonic silver
        imagePlane.ellipse(68, 22, 60, 10); // wings
    };
};

function setup() {
// run once at the beginning
    
    // get the dimensions of the browser window
    screenWidth = windowWidth;
    screenHeight = windowHeight;
    groundLevel = screenHeight - groundHeight;
    textPos = screenWidth - 190;

    // window setup
    let cnv = createCanvas(screenWidth, screenHeight); // custom
    // let cnv = createCanvas(displayWidth, displayHeight); // monitor dimensions
    // let cnv = createCanvas(windowWidth, windowHeight); // window dimensions
    cnv.position(0, 0);
    noSmooth();

    userPlane = new Plane(screenOffsetHorizontal, groundLevel, Math.PI, 1);
};
  
function draw() {
// run with every frame
    console.time();

    // draw screen
    let heightForColor = Math.floor(userPlane.worldCoord.y / 100)
    let backgroundColor = color(135 + heightForColor, 206 + 2 * heightForColor, 235 + heightForColor)
    console.log(backgroundColor.levels)
    background(userPlane.isAlive ? backgroundColor : 'red')

    for (let chunk of world) {
        chunk.draw(screenOffsetHorizontal, screenOffsetVerical);
    };
    userPlane.draw(screenOffsetHorizontal);

    // draw texts
    fill('black');
    noStroke();
    textSize(20);
    textAlign(LEFT, CENTER);
    text(`Power: ${userPlane.power}`, textPos, 25);
    text(`Speed: ${userPlane.speed.toFixed(2)}`, textPos, 50);
    text(`Climbing: ${-userPlane.speedVector.y.toFixed(1)}`, textPos, 75);
    text(`Altitude: ${groundLevel - userPlane.worldCoord.y.toFixed(0)}`, textPos, 100);
    text(`Air Density: ${(userPlane.airDensity * 100).toFixed(0)}%`, textPos, 125)
    // text flaps
    if (userPlane.flapsTakeOff) {text(`Flaps: Take Off`, 10, 25)};
    // text(`Flaps: ${userPlane.flapsTakeOff ? 'Take Off' : 'Nominal'}`, 10, 25);
    // text landing gear
    if (userPlane.landingGear) {text(`Landing Gear: Extended`, 10, 50)};
    // text(`Landing Gear: ${userPlane.landingGear ? 'Extended' : 'Retracted'}`, 10, 50);

    // text you died
    textAlign(CENTER, CENTER);
    textSize(50);
    if (!userPlane.isAlive) text('YOU DIED', screenWidth/2, screenHeight/2);

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
    // center screen on user plane
    screenOffsetHorizontal = userPlane.screenOffsetHorizontal;
    screenOffsetVerical = userPlane.screenOffsetVerical;

    console.timeEnd();
};

// // If the mouse is pressed,
// // toggle full-screen mode.
// function mousePressed() {
//     if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
//       let fs = fullscreen();
//       fullscreen(!fs);
//     }
// }

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
    // landing gear
    if (key === 'g') {
        userPlane.landingGear = userPlane.landingGear ? false : true;
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
