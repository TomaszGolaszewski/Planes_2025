"use strict";

const maxPower = 120; // int
const maxHeight = 10000; // int
const deltaPower = 5; // int: increment of aircraft power increase
const deltaVelocity = 2; // int: aircraft speed difference between modes
const deltaAngle = 2; // int: aircraft angle speed
const topScreenMargin = 200; // int

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

    get screenOffsetHorizontal() {
        return this.worldCoord.x - screenWidth/2;
    }; 
    get screenOffsetVerical() {
        return this.worldCoord.y - screenHeight;
    }; 

    get airDensity() {
        let density = (maxHeight + this.worldCoord.y - groundLevel) / maxHeight; // worldCoord.y is negative
        return density > 0 ? density : 0;
    };
    get dragCoefficient() {
        return this.baseDragCoefficient; // * this.airDensity; compensation for engine power loss
    }
    get liftCoefficient() {
        return this.baseLiftCoefficient * this.airDensity; 
    }

    setFlapsNominal() {
        this.flapsTakeOff = false;
        this.baseDragCoefficient = 0.5;
        this.baseLiftCoefficient = 0.5;
    };
    setFlapsTakeOff() {
        this.flapsTakeOff = true;
        this.baseDragCoefficient = 1.25;
        this.baseLiftCoefficient = 1.25;
    };

    draw(offset) {
        let r = 20;
        let xCoord = decidePositionOnScreen(this.worldCoord.x - offset);
        let yCoord = this.worldCoord.y < topScreenMargin ? topScreenMargin : this.worldCoord.y;

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
            let screenOrigin = {x: screenWidth/2, y: this.worldCoord.y < topScreenMargin ? topScreenMargin : this.worldCoord.y};
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
};