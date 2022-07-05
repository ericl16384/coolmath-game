class CameraTransform {
    constructor() {
        this.position = new Vector(0, 0);
        this.scale = 1
        this.rotation = 0;
        //this.invertX = false;
        //this.invertY = false;
    }

    //get inversionVector() {
    //    if(this.invertX) {
    //        var x = -1;
    //    } else {
    //        var x = 1;
    //    }

    //    if(this.invertY) {
    //        var y = -1;
    //    } else {
    //        var y = 1;
    //    }

    //    return new Vector(x, y);
    //}

    transform(v) {
        return v.sub(this.position).mul(this.scale).rotate(-this.rotation);
    }

    reverse(v) {
        return v.rotate(this.rotation).div(this.scale).add(this.position);
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
                    var color = this.colors[this.tiles[i][j]];
                    if(color === undefined) {
                        color = PURPLE;
                    }
                    drawPolygon(ctx, [
                        this.camera.transform(new Vector(i, j)).arr(),
                        this.camera.transform(new Vector(i+1, j)).arr(),
                        this.camera.transform(new Vector(i+1, j+1)).arr(),
                        this.camera.transform(new Vector(i, j+1)).arr()
                    ], color, GREY);
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
map.camera.scale = 15;
map.camera.position = new Vector(-10, 0);
map.camera.invertY = true;

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

    map.camera.rotation += 0.01;

    drawCircle(ctx, mousePosition.arr(), 5, RED);
    drawCircle(ctx, map.camera.transform(map.camera.reverse(mousePosition)).arr(), 3, GREEN);
}

function update() {
    //var [x, y] = map.camera.reverse()
}
