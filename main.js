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


class BuildingPrototype {
    constructor(name, radius, color) {
        this.name = name;

        this.radius = radius;
        this.color = color;
    }
}

class Building {
    constructor(position, prototype) {
        this.position = position;
        this.prototype = prototype;

        this.radius = prototype.radius;
        this.color = prototype.color;
    }

    draw(ctx, camera) {
        drawCircle(ctx,
            camera.transform(this.position.add(0.5)).arr(), this.radius*camera.scale,
        this.color);
    }
}

//class Wall extends Building {
//    constructor(position) {
//        super(position);

//        this.color = DARK_GREY;
//    }
//}

//class Tower extends Building {
//    constructor(position) {
//        super(position);

//        this.radius = 0.4;
//        this.color = BLUE;
//    }
//}

var buildingPrototypes = [
    new BuildingPrototype("wall", 0.5, DARK_GREY),
    new BuildingPrototype("tower", 0.4, BLUE)
];


var map = new Map(50, 50);

// add basic castle
var castleX = 7;
var castleY = 7;
var castleW = 7;
var castleH = 7;
for(let i=0; i<castleW; i++) {
    map.buildings.push(new Building(new Vector(castleX+i, castleY), buildingPrototypes[0]));
}
for(let i=0; i<castleW; i++) {
    map.buildings.push(new Building(new Vector(castleX+i, castleY+castleH-1), buildingPrototypes[0]));
}
for(let i=1; i<castleH-1; i++) {
    map.buildings.push(new Building(new Vector(castleX, castleY+i), buildingPrototypes[0]));
}
for(let i=1; i<castleH-1; i++) {
    map.buildings.push(new Building(new Vector(castleX+castleW-1, castleY+i), buildingPrototypes[0]));
}

map.camera.scale = 25;
map.camera.position = new Vector(0, 0);


var selectedBuildingPrototypeIndex = 0;

function mousePlaceBuilding() {
    var v = map.camera.reverse(mousePosition).floor();
    map.buildings.push(new Building(v, buildingPrototypes[selectedBuildingPrototypeIndex]));
}


function draw() {
    map.draw(ctx);
}

function update() {
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
