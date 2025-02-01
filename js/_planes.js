"use strict";

const maxPower = 120; // int
const deltaPower = 5; // int: increment of aircraft power increase
const deltaVelocity = 2; // int: aircraft speed difference between modes
const deltaAngle = 2; // int: aircraft angle speed
const topMargin = 100; // int

class Plane {
    mass = 100;
    dragCoefficient = 0.5;
    liftCoefficient = 0.5;
    constructor(worldX, worldY, angle, team) {
        this.worldCoord = {x: worldX, y: worldY};
        this.resultantForceVector = {x: 0, y: 0};
        this.speedVector = {x: 0, y: 0};
        this.speed = 0; // deltaVelocity;
        this.angle = angle; //radians
        this.power = 0;
        this.team = team;
        this.showVectors = false;
    };
    draw(offset) {
        let r = 20;
        if (this.team === 1) fill('blue');
        else fill('red');
        stroke('black');
        strokeWeight(5);
        let xCoord = decidePositionOnScreen(this.worldCoord.x - offset);
        let yCoord = this.worldCoord.y < topMargin ? topMargin : this.worldCoord.y;
        line(
            xCoord, 
            yCoord, 
            xCoord + r * Math.cos(this.angle), 
            yCoord + r * Math.sin(this.angle)
        );
        noStroke();
        circle(xCoord, yCoord, 20);

        // frame when plane is under the screen
        noFill()
        stroke('black');
        strokeWeight(3);
        if (this.worldCoord.y < topMargin) {
            rect(screenWidth/2 - 200, 0, 400, 2*topMargin);
            // draw text
            fill('black');
            noStroke();
            textSize(20);
            textAlign(RIGHT, TOP);
            text(`+ ${(topMargin - this.worldCoord.y).toFixed(0)}`, screenWidth/2 + 200, 2*topMargin + 5);
        };
    };
    move() {
        this.dynamics();
        this.kinematics();
    };
    dynamics() {
        let vectorPower = {x: this.power * Math.cos(this.angle), y: this.power * Math.sin(this.angle)};
        let vectorDrag = {
            x: - this.speedVector.x * Math.abs(this.speedVector.x * this.dragCoefficient), 
            y: - this.speedVector.y * Math.abs(this.speedVector.y * this.dragCoefficient), 
        };
        let vectorLift = {
            x: - this.speedVector.y * Math.abs(this.speedVector.y * this.liftCoefficient), 
            y: this.speedVector.x * Math.abs(this.speedVector.x * this.liftCoefficient),
        };
        let vectorGravitation = {x: 0, y: this.mass};

        this.resultantForceVector.x = vectorPower.x + vectorDrag.x + vectorLift.x + vectorGravitation.x;
        this.resultantForceVector.y = vectorPower.y + vectorDrag.y + vectorLift.y + vectorGravitation.y;

        if (this.showVectors) {
            let screenOrigin = {x: screenWidth/2, y: this.worldCoord.y < topMargin ? topMargin : this.worldCoord.y};
            drawVector(vectorPower, screenOrigin);
            drawVector(vectorDrag, screenOrigin);
            drawVector(vectorLift, screenOrigin);
            drawVector(vectorGravitation, screenOrigin);
            drawVector(this.resultantForceVector, screenOrigin, 'green');
            drawVector(this.speedVector, screenOrigin, 'white', 5);
        };
    };
    kinematics() {
        this.speedVector.x += this.resultantForceVector.x / this.mass;
        this.speedVector.y += this.resultantForceVector.y / this.mass;
        // this.worldCoord.x += this.speed * Math.cos(this.angle);
        // this.worldCoord.y += this.speed * Math.sin(this.angle);
        this.worldCoord.x += this.speedVector.x;
        this.worldCoord.y += this.speedVector.y;
        // fold the world around
        if (this.worldCoord.x > worldWidth) {
            this.worldCoord.x -= worldWidth;
        };
        if (this.worldCoord.x < 0) {
            this.worldCoord.x += worldWidth;
        };
        // check the ground level
        if (this.worldCoord.y >= groundLevel) {
            this.worldCoord.y = groundLevel;
            this.speedVector.y = 0;
        };
        // top of the screen
        // if (this.worldCoord.y < 0) {
        //     this.worldCoord.y = 0;
        //     this.speedVector.y = 0;
        // };
        this.speed = Math.sqrt(this.speedVector.x * this.speedVector.x + this.speedVector.y * this.speedVector.y);
    };
};