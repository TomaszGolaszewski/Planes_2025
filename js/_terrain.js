"use strict";

const chunkSize = 100; // int
const screenMargin = 200; // int, margin displayed outside the screen
const minCloudHeight = 300; // int
const maxCloudHeight = 2000; // int

class TerrainChunk {
    color = 'red';
    height = groundHeight - groundPlaneOverlap;
    constructor(id) {
        this.id = id
        this.cloudHeight = - minCloudHeight - Math.floor(Math.random() * maxCloudHeight); // screenHeight -- minCloudHeight
    };
    draw(offsetHorizontal, offsetVerical) {
        fill(this.color);
        noStroke();
        let xCoord = decidePositionOnScreen(this.id*chunkSize - offsetHorizontal);
        let yCoord = groundLevel - offsetVerical;
        rect(xCoord, yCoord - this.height, chunkSize+1, this.height); // +1 to make an overlap
        // fill('red');
        // circle(xCoord, screenHeight, 20);

        // draw cloud
        let bubbleRadius = 50;
        fill('white');
        circle(xCoord, yCoord + this.cloudHeight, bubbleRadius);
        circle(xCoord + 40, yCoord + this.cloudHeight - 10, bubbleRadius);
        circle(xCoord + 80, yCoord + this.cloudHeight, bubbleRadius);
        circle(xCoord + 120, yCoord + this.cloudHeight - 20, bubbleRadius);
        circle(xCoord + 160, yCoord + this.cloudHeight, bubbleRadius);
    };
};

class Ocean extends TerrainChunk {
    color = 'blue'
};

class Desert extends TerrainChunk {
    color = 'gold'; // (255, 200, 0);
};

class Palm extends Desert {
    draw(offsetHorizontal, offsetVerical) {
        super.draw(offsetHorizontal, offsetVerical);
        let xCoord = decidePositionOnScreen(this.id*chunkSize - offsetHorizontal);
        let yCoord = groundLevel - offsetVerical - this.height;
        // palm tree trunk
        stroke('brown');
        strokeWeight(8);
        line(xCoord + 50, yCoord, xCoord+60, yCoord - 70);
        // leaves
        stroke('green');
        strokeWeight(10);
        line(xCoord + 60, yCoord - 70, xCoord + 20, yCoord - 60); // bottom left
        line(xCoord + 60, yCoord - 70, xCoord + 30, yCoord - 80); // mid left
        line(xCoord + 60, yCoord - 70, xCoord + 90, yCoord - 50); // bottom right
        line(xCoord + 60, yCoord - 70, xCoord + 100, yCoord - 70); // mid right
        line(xCoord + 60, yCoord - 70, xCoord + 85, yCoord - 90); // top
    };
};

class Airport extends TerrainChunk {
    color = 100;
};

class FlagBlue extends Airport {
    colorFlag = "blue";
    draw(offsetHorizontal, offsetVerical) {
        super.draw(offsetHorizontal, offsetVerical);
        let xCoord = decidePositionOnScreen(this.id*chunkSize - offsetHorizontal);
        let yCoord = groundLevel - offsetVerical - this.height ;
        // flag
        fill(this.colorFlag);
        rect(xCoord, yCoord - 200, 45, 20);
        // pole
        stroke('black');
        strokeWeight(6);
        line(xCoord, yCoord + 5, xCoord, yCoord - 200);
    };
};

class FlagRed extends FlagBlue {
    color = "gold"
    colorFlag = "red";
};
