class CameraTransform {
    constructor() {
        this.position = new Vector(0, 0);
        this.scale = 1
        //this.rotation = 0;
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
        //return v.sub(this.position).mul(this.scale).rotate(-this.rotation);
        return v.sub(this.position).mul(this.scale);
    }

    reverse(v) {
        //return v.rotate(this.rotation).div(this.scale).add(this.position);
        return v.div(this.scale).add(this.position);
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
        for(let x=0; x<this.width; x++) {
            for(let y=0; y<this.height; y++) {
                if(this.tiles[x][y] !== null) {
                    var color = this.colors[this.tiles[x][y]];
                    if(color === undefined) {
                        color = PURPLE;
                    }
                    drawPolygon(ctx, [
                        this.camera.transform(new Vector(x, y)).arr(),
                        this.camera.transform(new Vector(x+1, y)).arr(),
                        this.camera.transform(new Vector(x+1, y+1)).arr(),
                        this.camera.transform(new Vector(x, y+1)).arr()
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


var map = new Map(40, 20);

// add basic castle
var castleX = 7;
var castleY = 7;
var castleW = 6;
var castleH = 6;
for(let i=0; i<castleW; i++) {
    map.tiles[castleX+i][castleY] = "wall";
}
for(let i=0; i<castleW; i++) {
    map.tiles[castleX+i][castleY+castleH-1] = "wall";
}
for(let i=0; i<castleH; i++) {
    map.tiles[castleX][castleY+i] = "wall";
}
for(let i=0; i<castleH; i++) {
    map.tiles[castleX+castleW-1][castleY+i] = "wall";
}


map.camera.scale = 25;
map.camera.position = new Vector(0, 0);


function draw() {
    map.draw(ctx);

    //drawCircle(ctx, mousePosition.arr(), 5, RED);
    //drawCircle(ctx, map.camera.transform(map.camera.reverse(mousePosition)).arr(), 3, GREEN);
}

function update() {
    //map.camera.rotation += 0.01;

    if(mousePressed) {
        var v = map.camera.reverse(mousePosition).floor();
        map.tiles[v.x][v.y] = "wall";
        console.log(v);
    }

    var x = 0;
    var y = 0;
    if(keysPressed["KeyW"]) {
        y--;
    }
    if(keysPressed["KeyA"]) {
        x--;
    }
    if(keysPressed["KeyS"]) {
        y++;
    }
    if(keysPressed["KeyD"]) {
        x++;
    }
    map.camera.position = map.camera.position.add(new Vector(x, y).mul(map.camera.scale / 20));
}

function onMouseDown() {

}
