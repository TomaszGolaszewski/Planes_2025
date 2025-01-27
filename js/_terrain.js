"use strict";

const chunkSize = 100; // int
const screenMargin = 200; // int, margin displayed outside the screen

class TerrainChunk {
    color = 'red';
    height = 15;
    constructor(id) {
        this.id = id
    };
    draw(offset) {
        fill(this.color);
        noStroke();
        let xCoord = decidePositionOnScreen(this.id*chunkSize - offset);
        rect(xCoord, screenHeight - this.height, chunkSize+1, this.height); // +1 to make an overlap
        // fill('red');
        // circle(xCoord, screenHeight, 20);
    };
};

class Ocean extends TerrainChunk {
    color = 'blue'
};

class Desert extends TerrainChunk {
    color = 'gold'; // (255, 200, 0);
};

class Palm extends Desert {
    draw(offset) {
        super.draw(offset);
        let xCoord = decidePositionOnScreen(this.id*chunkSize - offset);
        // palm tree trunk
        stroke('brown');
        strokeWeight(8);
        line(xCoord+50, screenHeight - this.height, xCoord+60, screenHeight-70);
        // leaves
        stroke('green');
        strokeWeight(10);
        line(xCoord+60, screenHeight-70, xCoord+20, screenHeight-60); // bottom left
        line(xCoord+60, screenHeight-70, xCoord+30, screenHeight-80); // mid left
        line(xCoord+60, screenHeight-70, xCoord+90, screenHeight-50); // bottom right
        line(xCoord+60, screenHeight-70, xCoord+100, screenHeight-70); // mid right
        line(xCoord+60, screenHeight-70, xCoord+85, screenHeight-90); // top
    };
};

class Airport extends TerrainChunk {
    color = 100;
    height = 20;
};

class FlagBlue extends Airport {
    colorFlag = "blue";
    draw(offset) {
        super.draw(offset);
        let xCoord = decidePositionOnScreen(this.id*chunkSize - offset);
        // flag
        fill(this.colorFlag);
        rect(xCoord, screenHeight-200, 45, 20);
        // pole
        stroke('black');
        strokeWeight(6);
        line(xCoord, screenHeight - this.height + 5, xCoord, screenHeight-200);
    };
};

class FlagRed extends FlagBlue {
    color = "gold"
    colorFlag = "red";
    height = 15;
};
