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

        this.tiles = createTileSpace(width, height, "grass");

        this.camera = new CameraTransform();
        this.colors = {
            //"empty": WHITE,
            //"stone": BLACK
            "grass": "#228B22",
            "wall": "#404040"
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


function draw() {
    if(mousePressed) {
        var v = map.camera.reverse(mousePosition).floor();
        map.tiles[v.x][v.y] = "wall";
    }
    

    map.draw(ctx);


    drawCircle(ctx, mousePosition.arr(), 5, RED);
    drawCircle(ctx, map.camera.transform(map.camera.reverse(mousePosition)).arr(), 3, GREEN);
}

function update() {
    //map.camera.rotation += 0.01;
}

function onMouseDown() {
}
