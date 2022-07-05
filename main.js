class Tower {
    constructor(position) {
        this.position = position;

        this.size = new Vector(3, 3);
        this.color = BLUE;
    }

    draw(ctx, tileSize) {
        drawRectangle(ctx, ...this.position.mul(tileSize).arr(), ...this.size.mul(tileSize).arr());
    }
}


var mapSize = [64, 32];

var tileSize = 15;

var terrainColors = {
    "empty": WHITE,
    "stone": BLACK
}
var terrainMap = createTileSpace(...mapSize, "stone");
for(let i=0; i<20; i++) {
    for(let j=0; j<20; j++) {
        terrainMap[i+10][j+10] = "empty";
    }
}


var units = [];
units.push(new Tower(new Vector(12, 12)));


function draw() {
    drawMap(ctx, terrainMap, tileSize, terrainColors);

    units.forEach(u => u.draw(ctx, tileSize));
}

function update() {}
