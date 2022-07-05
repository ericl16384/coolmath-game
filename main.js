class Camera {
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

    transformScale(v) {
        return v.mul(this.scale);
    }

    reverseScale(v) {
        return v.div(this.scale);
    }

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

        this.camera = new Camera();
        this.tileColors = {
            //"empty": WHITE,
            //"stone": BLACK
            
            "grass": "#228B22",
            //"wall": "#404040"
        }

        this.buildings = [];
    }

    draw(ctx) {
        // map
        for(let x=0; x<this.width; x++) {
            for(let y=0; y<this.height; y++) {
                if(this.tiles[x][y] !== null) {
                    var color = this.tileColors[this.tiles[x][y]];
                    if(color === undefined) {
                        color = PURPLE;
                    }

                    //drawPolygon(ctx, [
                    //    this.camera.transform(new Vector(x, y)).arr(),
                    //    this.camera.transform(new Vector(x+1, y)).arr(),
                    //    this.camera.transform(new Vector(x+1, y+1)).arr(),
                    //    this.camera.transform(new Vector(x, y+1)).arr()
                    //], color, GREY);

                    // this is simpler than polygons, because I have disabled rotation
                    drawRectangle(ctx,
                        this.camera.transform(new Vector(x, y)).arr(),
                        [this.camera.scale, this.camera.scale],
                    color, GREY);
                }
            }
        }

        // buildings
        this.buildings.forEach(b => b.draw(ctx, this.camera));
    }
}


class Building {
    constructor(position) {
        this.position = position;

        this.radius = 0.5;
        this.color = PURPLE;
    }

    draw(ctx, camera) {
        drawCircle(ctx,
            camera.transform(this.position.add(0.5)).arr(), this.radius*camera.scale,
        this.color);
    }
}

class Wall extends Building {
    constructor(position) {
        super(position);

        this.color = DARK_GREY;
    }
}

class Tower extends Building {
    constructor(position) {
        super(position);

        this.radius = 0.4;
        this.color = BLUE;
    }
}


var map = new Map(50, 50);

// add basic castle
var castleX = 7;
var castleY = 7;
var castleW = 7;
var castleH = 7;
for(let i=0; i<castleW; i++) {
    map.buildings.push(new Wall(new Vector(castleX+i, castleY)));
}
for(let i=0; i<castleW; i++) {
    map.buildings.push(new Wall(new Vector(castleX+i, castleY+castleH-1)));
}
for(let i=1; i<castleH-1; i++) {
    map.buildings.push(new Wall(new Vector(castleX, castleY+i)));
}
for(let i=1; i<castleH-1; i++) {
    map.buildings.push(new Wall(new Vector(castleX+castleW-1, castleY+i)));
}

map.camera.scale = 25;
map.camera.position = new Vector(0, 0);

//map.towers.push(new Building(new Vector(8, 7)));


var selectedBuilding = Tower;

function mousePlaceBuilding() {
    var v = map.camera.reverse(mousePosition).floor();
    //map.tiles[v.x][v.y] = "wall";
    map.buildings.push(new selectedBuilding(v));
    console.log(v);
}


function draw() {
    map.draw(ctx);

    //drawCircle(ctx, mousePosition.arr(), 5, RED);
    //drawCircle(ctx, map.camera.transform(map.camera.reverse(mousePosition)).arr(), 3, GREEN);
}

function update() {
    //map.camera.rotation += 0.01;

    if(mousePressed) {
        mousePlaceBuilding();
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
    mousePlaceBuilding();
}
