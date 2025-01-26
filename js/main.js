"use strict";

const worldWidth = 2500; // int
const screenWidth = 1000; // int
const screenHeight = 800; // int
const deltaVelocity = 2; // int: aircraft speed difference between modes
const deltaAngle = 2; // int: aircraft angle speed

let screenOffset = 0;
let userPlane;
let enemyPlane;

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
        line(
            this.worldCoord.x - offset, 
            this.worldCoord.y, 
            this.worldCoord.x + r * Math.cos(this.angle) - offset, 
            this.worldCoord.y + r * Math.sin(this.angle)
        );
        noStroke();
        circle(this.worldCoord.x - offset, this.worldCoord.y, 20);
    };
    move() {
        this.worldCoord.x += this.speed * Math.cos(this.angle);
        this.worldCoord.y += this.speed * Math.sin(this.angle);
    };
};

function setup() {
// run once at the beginning
    console.log("p5.js setup");
    
    let cnv = createCanvas(screenWidth, screenHeight);
    // cnv.position(100, 50);
    noSmooth();
    // noCursor();

    userPlane = new Plane(screenWidth/2 + 200, screenHeight/2, Math.PI, 1)
    enemyPlane = new Plane(screenWidth/2 - 200, screenHeight/2, 0, 2)
};
  
function draw() {
// run with every frame
    console.time();

    // draw screen
    background(135, 206, 235);

    userPlane.draw(screenOffset);
    enemyPlane.draw(screenOffset);
    drawLandmarks(screenOffset);

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

