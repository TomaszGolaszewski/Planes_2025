"use strict";

const worldWidth = 3000; // int
const screenWidth = 1000; // int
const screenHeight = 800; // int
const deltaVelocity = 2; // int: aircraft speed difference between modes
const deltaAngle = 2; // int: aircraft angle speed

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

class Plane {
    constructor(worldX, worldY, angle, team) {
        this.worldCoord = {x: worldX, y: worldY};
        this.angle = angle; //radians
        this.speed = deltaVelocity;
        this.team = team;
    };
    draw(offset) {
        let r = 20;
        if (this.team === 1) fill('blue');
        else fill('red');
        stroke('black');
        strokeWeight(5);
        let xCoord = decidePositionOnScreen(this.worldCoord.x - offset);
        line(
            xCoord, 
            this.worldCoord.y, 
            xCoord + r * Math.cos(this.angle), 
            this.worldCoord.y + r * Math.sin(this.angle)
        );
        noStroke();
        circle(xCoord, this.worldCoord.y, 20);
    };
    move() {
        this.worldCoord.x += this.speed * Math.cos(this.angle);
        this.worldCoord.y += this.speed * Math.sin(this.angle);
        // fold the world around
        if (this.worldCoord.x > worldWidth) {
            this.worldCoord.x -= worldWidth
        };
        if (this.worldCoord.x < 0) {
            this.worldCoord.x += worldWidth
        };
    };
};

function setup() {
// run once at the beginning
    console.log("p5.js setup");
    
    let cnv = createCanvas(screenWidth, screenHeight);
    // cnv.position(100, 50);
    noSmooth();
    // noCursor();

    userPlane = new Plane(screenOffset, screenHeight - 30, Math.PI, 1)
    enemyPlane = new Plane(screenWidth/2 - 200, screenHeight/2, 0, 2)
};
  
function draw() {
// run with every frame
    console.time();

    // draw screen
    background(135, 206, 235);

    userPlane.draw(screenOffset);
    enemyPlane.draw(screenOffset);
    for (let chunk of world) {
        chunk.draw(screenOffset);
    };
    // drawLandmarks(screenOffset);

    // check and handle buttons' states
    if (keyIsDown(LEFT_ARROW) === true) {
        userPlane.angle -= deltaAngle*Math.PI/180;
    }
    if (keyIsDown(RIGHT_ARROW) === true) {
        userPlane.angle += deltaAngle*Math.PI/180;
    }

    // move objects
    userPlane.move();
    enemyPlane.move();
    screenOffset = userPlane.worldCoord.x - screenWidth/2;

    enemyPlane.angle -= Math.PI/180;

    console.timeEnd();
};

function keyPressed() {
// run once when button is pressed
    if (keyCode === UP_ARROW) {
        userPlane.speed += deltaVelocity;
    } else if (keyCode === DOWN_ARROW) {
        userPlane.speed -= deltaVelocity;
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

function decidePositionOnScreen(pos) {
// decide if the passed position is on the screen - if not - move it
    if (pos > screenWidth + screenMargin) pos -= worldWidth;
    if (pos < -screenMargin) pos += worldWidth; // checks position after correction
    return pos;
};
