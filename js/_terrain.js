"use strict";

const chunkSize = 200; // int
const screenMargin = 200; // int, margin displayed outside the screen
const minCumulusCloudHeight = 300; // int
const maxCumulusCloudHeight = 2000; // int
const minCirrusCloudHeight = 3500; // int, 
const maxCirrusCloudHeight = 4500; // int

class TerrainChunk {
    color = 'red';
    height = groundHeight - groundPlaneOverlap;
    constructor(id) {
        this.id = id
        this.cumulusCloudHeight = - minCumulusCloudHeight - Math.floor(Math.random() * (maxCumulusCloudHeight - minCumulusCloudHeight));
        this.cirrusCloudHeight = - minCirrusCloudHeight - Math.floor(Math.random() * (maxCirrusCloudHeight - minCirrusCloudHeight)); 
    };
    draw(offsetHorizontal, offsetVerical) {
        fill(this.color);
        noStroke();
        let xCoord = decidePositionOnScreen(this.id*chunkSize - offsetHorizontal);
        let yCoord = groundLevel - offsetVerical;
        rect(xCoord, yCoord - this.height, chunkSize+1, this.height); // +1 to make an overlap
        // fill('red');
        // circle(xCoord, screenHeight, 20);

        // draw Cumulus cloud
        let bubbleRadius = 50;
        fill('white');
        circle(xCoord, yCoord + this.cumulusCloudHeight, bubbleRadius);
        circle(xCoord + 40, yCoord + this.cumulusCloudHeight - 10, bubbleRadius);
        circle(xCoord + 80, yCoord + this.cumulusCloudHeight, bubbleRadius);
        circle(xCoord + 120, yCoord + this.cumulusCloudHeight - 20, bubbleRadius);
        circle(xCoord + 160, yCoord + this.cumulusCloudHeight, bubbleRadius);

        //draw Cirrus cloud
        stroke('white');
        strokeWeight(5);
        line(xCoord, yCoord + this.cirrusCloudHeight, xCoord + 80, yCoord + this.cirrusCloudHeight);
        line(xCoord + 30, yCoord + this.cirrusCloudHeight - 10, xCoord + 130, yCoord + this.cirrusCloudHeight - 10);
        line(xCoord + 60, yCoord + this.cirrusCloudHeight - 30, xCoord + 140, yCoord + this.cirrusCloudHeight - 30);
        line(xCoord + 120, yCoord + this.cirrusCloudHeight - 20, xCoord + 200, yCoord + this.cirrusCloudHeight - 20);
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

class AirportCenterTile extends Airport {
    color = 100;
    // draw(offsetHorizontal, offsetVerical) {
    //     super.draw(offsetHorizontal, offsetVerical);
    //     let xCoord = decidePositionOnScreen(this.id*chunkSize - offsetHorizontal);
    //     let yCoord = groundLevel - offsetVerical - this.height ;
    //     // landing path
    //     noFill()
    //     stroke(color(0, 255, 0));
    //     strokeWeight(6);
    //     arc(xCoord + chunkSize/2, yCoord - 600, 2500, 800, 0.1, Math.PI - 0.1);
    // };
};

class FlagBlue extends Airport {
    colorFlag = "blue";
    draw(offsetHorizontal, offsetVerical) {
        super.draw(offsetHorizontal, offsetVerical);
        let xCoord = decidePositionOnScreen(this.id*chunkSize - offsetHorizontal);
        let yCoord = groundLevel - offsetVerical - this.height ;
        // flag
        noStroke();
        fill(this.colorFlag);
        rect(xCoord, yCoord - 200, 45, 20);
        // pole
        stroke('black');
        strokeWeight(6);
        line(xCoord, yCoord + 5, xCoord, yCoord - 200);

        // arrow
        if (yCoord > screenHeight + 200) {
            fill(this.colorFlag);
            noStroke();
            circle(xCoord, screenHeight, 20);
        };
    };
};

class FlagRed extends FlagBlue {
    color = "gold"
    colorFlag = "red";
};
