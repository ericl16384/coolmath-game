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

    update() {
        var i = 0;
        while(i < this.entities.length) {
            this.entities[i].update(this);

            if(this.entities[i].health <= 0) {
                popAtIndex(this.entities, i);
                continue;
            }

            i++;
        }
    }

    entitiesAtPosition(v) {
        return this.entities.filter(e => e.position.eq(v));
    }
}

//AllEntityPrototypes = {}
class EntityPrototype {
    constructor(name, image, health, combatValue=0) {
        this.name = name;
        //AllEntityPrototypes[name] = this;

        this.image = image;
        this.health = health;
        this.combatValue = combatValue;
    }
}

class Entity {
    constructor(prototype, position, force) {
        this.prototype = prototype;
        this.position = position;
        this.force = force;

        this.image = prototype.image;
        this.health = prototype.health;
        this.maxHealth = prototype.health;
        this.combatValue = prototype.combatValue;

        this.nextPosition = null;
        this.movementAnimation = null;
    }

    get drawPosition() {
        if(this.movementAnimation != null) {
            console.log(this.movementAnimation)
            return this.movementAnimation.position(ticks);
        } else {
            return this.position;
        }
    }

    draw(ctx, camera) {
        //drawCircle(ctx,
        //    camera.transform(this.drawPosition.add(0.5)).arr(), this.radius*camera.scale,
        //this.debugColor);
        ctx.drawImage(this.image, ...camera.transform(this.drawPosition).arr(), camera.scale, camera.scale);

        // health indicators
        //if(this.health <= 0) {
        //    this.drawDeathIndicator(ctx, camera);
        //} else
        if(this.health < this.maxHealth) {
            this.drawHealthBar(ctx, camera);
        }
    }

    update(map) {
        if(isNaN(this.health)) {
            throw `health must be a number, not ${this.health}`;
        }

        if(this.health <= 0) {
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
            camera.transform(this.drawPosition.add(new Vector(0, y))).arr(),
            camera.transform(this.drawPosition.add(new Vector(fraction, y))).arr(),
        color);
    }

    //drawDeathIndicator(ctx, camera) {
    //    var center = this.position.add(0.5);
    //    var offset = this.radius * Math.sqrt(2)/2;
    //    drawLine(ctx,
    //        camera.transform(center.add(new Vector(-offset, offset))).arr(),
    //        camera.transform(center.add(new Vector(offset, -offset))).arr(),
    //    RED);
    //    drawLine(ctx,
    //        camera.transform(center.add(new Vector(-offset, -offset))).arr(),
    //        camera.transform(center.add(new Vector(offset, offset))).arr(),
    //    RED);
    //}
}


class BuildingPrototype extends EntityPrototype {}

class Building extends Entity {}


var pathfind_through_obstacles_cost_factor = 0.5

class UnitPrototype extends EntityPrototype {
    constructor(name, health, attackStrength, movementDuration, combatValue=0) {
        super(name, health, combatValue);

        this.attackStrength = attackStrength;
        this.movementDuration = movementDuration;
    }
}

class Unit extends Entity {
    constructor(prototype, position, force) {
        super(prototype, position, force);
        
        this.attackStrength = prototype.attackStrength;
        this.movementDuration = prototype.movementDuration;

        this.pathTarget = null;
        this.pathUseCombatValues = true;
        this.path = [];

        this.doDrawPath = false;
    }

    draw(ctx, camera) {
        super.draw(ctx, camera);

        if(this.doDrawPath) {
            this.drawPath(ctx, camera);
        }
    }

    update(map) {
        super.update(map);

        this.move(map);
    }

    move(map) {
        // skip if move already happening
        if(this.movementAnimation) {
            if(this.movementAnimation.finished(ticks)) {
                this.movementAnimation = null;
                this.position = this.nextPosition;
                this.path.pop()
            } else {
                return;
            }
        }

        // pathfind (can optimize, so it does not do it every tick)
        if(this.pathTarget) {
            this.pathfind(map, this.pathTarget);
            this.path.pop(); // current position
        } else {
            return;
        }

        // get next position
        if(this.path[this.path.length-1]) {
            this.nextPosition = new Vector(...this.path[this.path.length-1]);
        } else {
            return;
        }

        // attack
        var colliding = map.entitiesAtPosition(this.nextPosition);
        if(colliding.length > 0) {
            this.attack(colliding[0]);
            return;
        }

        // move
        print(this.movementDuration)
        this.movementAnimation = new Animation(
            ticks, ticks+this.movementDuration,
            this.position, this.nextPosition
        );
    }

    attack(entity) {
        entity.health -= this.attackStrength;
    }

    pathfind(map, target) {
        this.path = gridAStar(...this.position.arr(), ...target.arr(), (x, y) => {
            if(x < 0 || y < 0 || x >= map.width || y >= map.height) {
                return -1;
            }
            var cost = this.movementDuration;

            // ignore tiles for now

            map.entitiesAtPosition(new Vector(x, y)).forEach(e => {
                cost += e.health / this.attackStrength * pathfind_through_obstacles_cost_factor;
                if(this.pathUseCombatValues) {
                    cost -= e.combatValue;
                }
            });

            return cost;
        }, 1024);
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
                camera.transform(this.drawPosition.add(0.5)).arr(),
            RED);
        }
    }
}


var buildingPrototypes = [
    new BuildingPrototype("wall", loadImage("assets/wall_single_pixel.png"), 100),
    new BuildingPrototype("archer", loadImage("assets/archer_single_pixel.png"), 10, 10)//, b=>b=="wall")
];

var unitPrototypes = [
    new UnitPrototype("swordsman", loadImage("assets/swordsman_single_pixel.png"), 10, 2, 5)
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
    map.entities.push(new Building(buildingPrototypes[0], new Vector(castleX+i, castleY), "player"));
}
for(let i=0; i<castleW; i++) {
    map.entities.push(new Building(buildingPrototypes[0], new Vector(castleX+i, castleY+castleH-1), "player"));
}
for(let i=1; i<castleH-1; i++) {
    map.entities.push(new Building(buildingPrototypes[0], new Vector(castleX, castleY+i), "player"));
}
for(let i=1; i<castleH-1; i++) {
    map.entities.push(new Building(buildingPrototypes[0], new Vector(castleX+castleW-1, castleY+i), "player"));
}


var enemy = new Unit(unitPrototypes[0], new Vector(5, 4), "enemy");
map.entities.push(enemy);
enemy.pathTarget = new Vector(13, 10);


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


    // corner panel

    drawCircle(ctx, [0, 50], 100, WHITE, BLACK);

    var proto = buildingPrototypes[selectedBuildingPrototypeIndex];
    drawCircle(ctx, [40, 40], 25, proto.debugColor);
    drawText(ctx, proto.name, [40, 80]);

    drawText(ctx, map.camera.reverse(mousePosition).floor().str(), [40, 110]);
}

function update() {
    if(mousePressed) {
        mousePlaceBuilding();
    }

    // camera movement
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


    map.update();
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