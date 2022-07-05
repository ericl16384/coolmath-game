class CameraTransform {
    constructor() {
        this.offset = new Vector(0, 0);
        //this.scale = 1
        //this.rotation = 0;
        //this.invertX = false;
        //this.invertY = false;
    }

    transform(v) {
        return v.add(this.offset);
    }
}


class Map {
    constructor(width, height) {
        this.width = width;
        this.height = height;

        this.tiles = createTileSpace(width, height, "stone");

        this.camera = new CameraTransform();
        this.colors = {
            "empty": WHITE,
            "stone": BLACK
        }
    }

    draw(ctx) {
        for(let i=0; i<this.width; i++) {
            for(let j=0; j<this.height; j++) {
                if(this.tiles[i][j] !== null) {
                    var color = this.colors[map[i][j]];
                    if(color === undefined) {
                        color = PURPLE;
                    }
                    drawRectangle(ctx,
                        this.camera.transform(new Vector(i, j)).arr(),
                        size,
                    color, gridColor);
                }
            }
        }
    }
}

class Tower {
    constructor(position) {
        this.position = position;

        this.size = new Vector(1, 1);
        this.color = BLUE;
    }

    draw(ctx, tileSize) {
        drawRectangle(ctx, this.position.mul(tileSize).arr(), this.size.mul(tileSize).arr(), BLUE);
    }
}


//var mapSize = [64, 32];

var map = new Map(64, 32);

//var tileSize = 15;

//var terrainColors = {
//    "empty": WHITE,
//    "stone": BLACK
//}
//var terrainMap = createTileSpace(...mapSize, "stone");
for(let i=0; i<20; i++) {
    for(let j=0; j<20; j++) {
        //terrainMap[i+10][j+10] = "empty";
        map.tiles[i+10][j+10] = "empty";
    }
}


//var units = [];
//units.push(new Tower(new Vector(12, 12)));


function draw() {
    //drawMap(ctx, terrainMap, tileSize, terrainColors);
    map.draw(ctx);

    //units.forEach(u => u.draw(ctx, tileSize));
}

function update() {}
