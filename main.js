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

        this.entities = [];
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

        // entities
        this.entities.forEach(e => e.draw(ctx, this.camera));
    }

    entitiesAtPosition(v) {
        return this.entities.filter(e => e.position.eq(v));
    }
}


class EntityPrototype {
    constructor(name, radius, color, health, combatValue=0) {
        this.name = name;

        this.radius = radius;
        this.color = color;
        this.health = health;
        this.combatValue = combatValue;
    }
}

class Entity {
    constructor(prototype, position) {
        this.prototype = prototype;
        this.position = position;

        this.radius = prototype.radius;
        this.color = prototype.color;
        this.health = prototype.health;
        this.maxHealth = prototype.health;
        this.combatValue = prototype.combatValue;

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

    update(map) {
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


class BuildingPrototype extends EntityPrototype {
    //constructor(name, radius, color, health, placementCheck=b=>false) {
    //    super(name, radius, color, health);

    //    this.placementCheck = placementCheck;
    //}
}

class Building extends Entity {}


class UnitPrototype extends EntityPrototype {}

class Unit extends Entity {
    constructor(prototype, position, attackStrength) {
        super(prototype, position);

        this.attackStrength = attackStrength;

        this.pathTarget = null;
        this.pathUseCombatValues = true;
        this.path = [];

        this.doDrawPath = true;
    }

    draw(ctx, camera) {
        super.draw(ctx, camera);

        if(this.doDrawPath) {
            this.drawPath(ctx, camera);
        }
    }

    update(map) {
        super.update(map);

        if(this.pathTarget) {
            this.pathfind(map, this.pathTarget);
            this.path.pop(); // current position
        }

        if(this.path.length > 0) {
            this.position = new Vector(...this.path.pop());
        }
    }

    pathfind(map, target) {
        //this.path = tiledAStar(map.tiles, ...this.position.arr(), ...target.arr(), {"grass": 1});

        this.path = gridAStar(...this.position.arr(), ...target.arr(), (x, y) => {
            if(x < 0 || y < 0 || x >= map.width || y >= map.height) {
                return -1;
            }
            var cost = 1;

            // ignore tiles for now

            map.entitiesAtPosition(new Vector(x, y)).forEach(e => {
                cost += e.health/this.attackStrength;
                if(this.pathUseCombatValues) {
                    cost -= e.combatValue;
                }
            });

            return cost;
        });
    }

    drawPath(ctx, camera) {
        for(let i=0; i<this.path.length-1; i++) {
            drawLine(ctx,
                camera.transform(new Vector(...this.path[i]).add(0.5)).arr(),
                camera.transform(new Vector(...this.path[i+1]).add(0.5)).arr(),
            RED);
        }
        if(this.path.length > 0) { 
            drawLine(ctx,
                camera.transform(new Vector(...this.path[this.path.length-1]).add(0.5)).arr(),
                camera.transform(this.position.add(0.5)).arr(),
            RED);
        }
    }
}


var buildingPrototypes = [
    new BuildingPrototype("wall", 0.5, DARK_GREY, 20),
    new BuildingPrototype("ballista", 0.4, BLUE, 5, 10)//, b=>b=="wall")
];

var unitPrototypes = [
    new UnitPrototype("swordsman", 0.3, LIGHT_GREY, 3)
]


var map = new Map(50, 50);

map.camera.scale = 25;
map.camera.position = new Vector(0, 0);


// add basic castle
var castleX = 10;
var castleY = 7;
var castleW = 7;
var castleH = 7;
for(let i=0; i<castleW; i++) {
    map.entities.push(new Building(buildingPrototypes[0], new Vector(castleX+i, castleY)));
}
for(let i=0; i<castleW; i++) {
    map.entities.push(new Building(buildingPrototypes[0], new Vector(castleX+i, castleY+castleH-1)));
}
for(let i=1; i<castleH-1; i++) {
    map.entities.push(new Building(buildingPrototypes[0], new Vector(castleX, castleY+i)));
}
for(let i=1; i<castleH-1; i++) {
    map.entities.push(new Building(buildingPrototypes[0], new Vector(castleX+castleW-1, castleY+i)));
}


var bestie = new Unit(unitPrototypes[0], new Vector(5, 4), 2);
map.entities.push(bestie);
bestie.pathTarget = new Vector(13, 10);

//bestie.pathfind(map, new Vector(13, 10));
//console.log(bestie.path);


var selectedBuildingPrototypeIndex = 0;

function mousePlaceBuilding() {
    // for now buildings cannot be stacked


    var v = map.camera.reverse(mousePosition).floor();

    if(v.x < 0 || v.y < 0 || v.x >= map.width || v.y >= map.height) {
        return false;
    }

    var proto = buildingPrototypes[selectedBuildingPrototypeIndex];
    
    for(let i=0; i<map.entities.length; i++) {
        var building = map.entities[i];
        if(building.position.eq(v)) {// && !proto.placementCheck(building.prototype.name)) {
            return false;
        }
    }

    map.entities.push(new Building(proto, v));
    return true;
}


function draw() {
    fillCanvas(ctx, canvas, BLACK);
    map.draw(ctx);


    // selection panel

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


    map.entities.forEach(e => e.update(map));
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
