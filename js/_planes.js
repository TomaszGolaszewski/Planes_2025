"use strict";

const maxPower = 120; // int
const deltaPower = 5; // int: increment of aircraft power increase
const deltaVelocity = 2; // int: aircraft speed difference between modes
const deltaAngle = 2; // int: aircraft angle speed
const topMargin = 100; // int

class Plane {
    mass = 100;
    constructor(worldX, worldY, angle, team) {
        this.isAlive = true;
        this.worldCoord = {x: worldX, y: worldY};
        this.resultantForceVector = {x: 0, y: 0};
        this.speedVector = {x: 0, y: 0};
        this.speed = 0; // deltaVelocity;
        this.angle = angle; //radians
        this.power = 0;
        this.team = team;
        this.showVectors = false;
        this.landingGear = true;
        this.setFlapsTakeOff();
    };
    draw(offset) {
        let r = 20;
        let xCoord = decidePositionOnScreen(this.worldCoord.x - offset);
        let yCoord = this.worldCoord.y < topMargin ? topMargin : this.worldCoord.y;

        // draw landing gear
        if (this.landingGear) {
            fill(color(119, 119, 119)); // sonic silver
            stroke('black');
            strokeWeight(5);
            // rear
            circle(
                xCoord + 26 * Math.cos(this.angle + 1.4*Math.PI), 
                yCoord + 26 * Math.sin(this.angle + 1.4*Math.PI), 10);
            // front
            circle(
                xCoord + 65 * Math.cos(this.angle - 0.12*Math.PI), 
                yCoord + 65 * Math.sin(this.angle - 0.12*Math.PI), 10);
        };

        // draw the image.
        imageMode(CENTER);
        translate(xCoord, yCoord);
        rotate(this.angle-Math.PI);
        image(imagePlane,0,0);
        rotate(Math.PI-this.angle);
        translate(-xCoord, -yCoord);

        /*
        // draw 2D primitives
        // draw angle indicator
        stroke('black');
        strokeWeight(5);
        line(
            xCoord, 
            yCoord, 
            xCoord + r * Math.cos(this.angle), 
            yCoord + r * Math.sin(this.angle)
        );
        // for future team indicator
        // draw circle
        if (this.team === 1) fill('blue');
        else fill('red');
        noStroke();
        circle(xCoord, yCoord, 20);
        */

        // flaps
        if (this.flapsTakeOff) {
            stroke(color(119, 119, 119)); // sonic silver
            strokeWeight(5);
            line(
                xCoord + 6 * Math.cos(this.angle + 1.25*Math.PI), 
                yCoord + 6 * Math.sin(this.angle + 1.25*Math.PI), 
                xCoord + 20 * Math.cos(this.angle + 1.25*Math.PI), 
                yCoord + 20 * Math.sin(this.angle + 1.25*Math.PI)
            );
        };

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
            if (this.landingGear) {
                this.angle = Math.PI;
            } else {
                // crash
                this.isAlive = false;
            };
        };
        this.speed = Math.sqrt(this.speedVector.x * this.speedVector.x + this.speedVector.y * this.speedVector.y);
    };
    setFlapsNominal() {
        this.flapsTakeOff = false;
        this.dragCoefficient = 0.5;
        this.liftCoefficient = 0.5;
    };
    setFlapsTakeOff() {
        this.flapsTakeOff = true;
        this.dragCoefficient = 1.25;
        this.liftCoefficient = 1.25;
    };
};