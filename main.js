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
    constructor(name, radius, color, health, placementCheck=b=>false) {
        this.name = name;

        this.radius = radius;
        this.color = color;
        this.health = health;

        this.placementCheck = placementCheck;
    }
}

class Building {
    constructor(position, prototype) {
        this.position = position;
        this.prototype = prototype;

        this.radius = prototype.radius;
        this.color = prototype.color;
        this.health = prototype.health;
        
        this.maxHealth = prototype.health;

        this.dead = false;
    }

    draw(ctx, camera) {
        drawCircle(ctx,
            camera.transform(this.position.add(0.5)).arr(), this.radius*camera.scale,
        this.color);

        // health indicators
        if(this.health <= 0) {
            this.drawDeathIndicator(ctx, camera);
        } else if(this.health < this.maxHealth) {
            this.drawHealthBar(ctx, camera);
        }
    }

    update() {
        if(this.health <= 0) {
            this.dead = true;
            this.health = 0;
        }
    }

    drawHealthBar(ctx, camera) {
        var fraction = this.health / this.maxHealth;
        if(fraction > 0.75) {
            var color = GREEN;
        } else if(fraction > 0.25) {
            var color = YELLOW;
        } else {
            var color = RED;
        }
        var y = 0.5 + this.radius;
        
        drawLine(ctx,
            camera.transform(this.position.add(new Vector(0, y))).arr(),
            camera.transform(this.position.add(new Vector(fraction, y))).arr(),
        color);
    }

    drawDeathIndicator(ctx, camera) {
        var center = this.position.add(0.5);
        var offset = this.radius * Math.sqrt(2)/2;
        drawLine(ctx,
            camera.transform(center.add(new Vector(-offset, offset))).arr(),
            camera.transform(center.add(new Vector(offset, -offset))).arr(),
        RED);
        drawLine(ctx,
            camera.transform(center.add(new Vector(-offset, -offset))).arr(),
            camera.transform(center.add(new Vector(offset, offset))).arr(),
        RED);
    }
}

var buildingPrototypes = [
    new BuildingPrototype("wall", 0.5, DARK_GREY, 20),
    new BuildingPrototype("tower", 0.4, BLUE, 5, b=>b=="wall")
];


var map = new Map(50, 50);

// add basic castle
var castleX = 10;
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


var selectedBuildingPrototypeIndex = 1;

function mousePlaceBuilding() {
    var v = map.camera.reverse(mousePosition).floor();

    if(v.x < 0 || v.y < 0 || v.x >= map.width || v.y >= map.height) {
        return false;
    }

    var proto = buildingPrototypes[selectedBuildingPrototypeIndex];
    
    for(let i=0; i<map.buildings.length; i++) {
        var building = map.buildings[i];
        if(building.position.eq(v) && !proto.placementCheck(building.prototype.name)) {
            return false;
        }
    }

    map.buildings.push(new Building(v, proto));
    return true;
}


function draw() {
    fillCanvas(ctx, canvas, BLACK);
    map.draw(ctx);


    // side panel

    drawCircle(ctx, [0, 0], 100, WHITE, BLACK);
    var proto = buildingPrototypes[selectedBuildingPrototypeIndex];
    drawCircle(ctx, [40, 40], 25, proto.color);
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


    // debug
    map.buildings[randInt(0, map.buildings.length)].health--;
    map.buildings[randInt(0, map.buildings.length)].health--;
    map.buildings[randInt(0, map.buildings.length)].health--;
    map.buildings[randInt(0, map.buildings.length)].health--;
    map.buildings[randInt(0, map.buildings.length)].health--;


    map.buildings.forEach(b => b.update());
}

function onMouseDown() {
    mousePlaceBuilding();
}

function onMouseUp() {
    mousePlaceBuilding();
}

function onMouseWheel(change) {
    if(change > 0) {
        selectedBuildingPrototypeIndex++;
    } else {
        selectedBuildingPrototypeIndex--;
    }
    selectedBuildingPrototypeIndex = mod(selectedBuildingPrototypeIndex, buildingPrototypes.length);
}
