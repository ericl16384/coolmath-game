"use strict"; // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode/Transitioning_to_strict_mode


//cdnjs.cloudflare.com/ajax/libs/seedrandom/3.0.5/seedrandom.min.js
!function(f,a,c){var s,l=256,p="random",d=c.pow(l,6),g=c.pow(2,52),y=2*g,h=l-1;function n(n,t,r){function e(){for(var n=u.g(6),t=d,r=0;n<g;)n=(n+r)*l,t*=l,r=u.g(1);for(;y<=n;)n/=2,t/=2,r>>>=1;return(n+r)/t}var o=[],i=j(function n(t,r){var e,o=[],i=typeof t;if(r&&"object"==i)for(e in t)try{o.push(n(t[e],r-1))}catch(n){}return o.length?o:"string"==i?t:t+"\0"}((t=1==t?{entropy:!0}:t||{}).entropy?[n,S(a)]:null==n?function(){try{var n;return s&&(n=s.randomBytes)?n=n(l):(n=new Uint8Array(l),(f.crypto||f.msCrypto).getRandomValues(n)),S(n)}catch(n){var t=f.navigator,r=t&&t.plugins;return[+new Date,f,r,f.screen,S(a)]}}():n,3),o),u=new m(o);return e.int32=function(){return 0|u.g(4)},e.quick=function(){return u.g(4)/4294967296},e.double=e,j(S(u.S),a),(t.pass||r||function(n,t,r,e){return e&&(e.S&&v(e,u),n.state=function(){return v(u,{})}),r?(c[p]=n,t):n})(e,i,"global"in t?t.global:this==c,t.state)}function m(n){var t,r=n.length,u=this,e=0,o=u.i=u.j=0,i=u.S=[];for(r||(n=[r++]);e<l;)i[e]=e++;for(e=0;e<l;e++)i[e]=i[o=h&o+n[e%r]+(t=i[e])],i[o]=t;(u.g=function(n){for(var t,r=0,e=u.i,o=u.j,i=u.S;n--;)t=i[e=h&e+1],r=r*l+i[h&(i[e]=i[o=h&o+t])+(i[o]=t)];return u.i=e,u.j=o,r})(l)}function v(n,t){return t.i=n.i,t.j=n.j,t.S=n.S.slice(),t}function j(n,t){for(var r,e=n+"",o=0;o<e.length;)t[h&o]=h&(r^=19*t[h&o])+e.charCodeAt(o++);return S(t)}function S(n){return String.fromCharCode.apply(0,n)}if(j(c.random(),a),"object"==typeof module&&module.exports){module.exports=n;try{s=require("crypto")}catch(n){}}else"function"==typeof define&&define.amd?define(function(){return n}):c["seed"+p]=n}("undefined"!=typeof self?self:this,[],Math);


// basic math

function mod(a, b) {
   return ((a % b) + b) % b;
};

function intDiv(a, b) {
    return Math.floor(a / b);
}

function round(x, precision) {
    // https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary
    var scale = 10**precision;
    return Math.round((x + Number.EPSILON) * scale) / scale;
}

function within(x, min, max) {
    if(x < min) {
        return false;
    } else if(x > max) {
        return false;
    } else {
        return true;
    }
}

function constrain(x, min, max) {
    if(x < min) {
        return min;
    } else if(x > max) {
        return max;
    } else {
        return x;
    }
}

function randRange(min, max, rng) {
    if(rng) {
        return rng() * (max - min) + min;
    } else {
        return Math.random() * (max - min) + min;
    }
}

function randInt(min, max, rng) {
    // // inclusive min, exclusive max
    // if(rng) {
    //     return Math.floor(rng() * (max - min)) + min;
    // } else {
    //     return Math.floor(Math.random() * (max - min)) + min;
    // }
    return Math.floor(randRange(min, max, rng));
}


// array manipulation

function popAtIndex(array, index) {
    var item = array[index];
    array.splice(index, 1);
    return item;
}

function popAtRandom(array, rng) {
    return popAtIndex(array, randInt(0, array.length, rng));
}

function removeDuplicates(array) {
    for(let i=0; i<array.length; i++) {
        let j = i + 1;
        while(j < array.length) {
            if(array[i] == array[j]) {
                //array.slice(j, 1);
                popAtIndex(array, j);
            } else {
                j++;
            }
        }
    }
}

function getItemCounts(array) {
    var itemCounts = [];
    for(let i=0; i<array.length; i++) {
        var found = false;
        for(let j=0; j<itemCounts.length; j++) {
            if(array[i] == itemCounts[j][0]) {
                itemCounts[j][1]++;
                found = true;
                break;
            }
        }
        if(!found) {
            itemCounts.push([array[i], 1]);
        }
    }
    return itemCounts;
}

function sortNumbers(array, ascending=true) {
    if(ascending) {
        array.sort((a, b) => a - b);
    } else {
        array.sort((a, b) => b - a);
    }
}

function sortNumbersByIndex(array, index, ascending=true) {
    if(ascending) {
        array.sort((a, b) => a[index] - b[index]);
    } else {
        array.sort((a, b) => b[index] - a[index]);
    }
}

function shuffle(array) {
    // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array

    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}


// point math

function averagePoint(p1, p2) {
    return [
        (p1[0] + p2[0]) / 2,
        (p1[1] + p2[1]) / 2
    ]
}

function lerp(p1, p2, t) {
    return [p1[0] + (p2[0] - p1[0])*t, p1[1] + (p2[1] - p1[1])*t];
}

function displacement(x1, y1, x2, y2) {
    return [x2 - x1, y2 - y1];
}

function euclideanDistance(x1, y1, x2, y2) {
    var [x, y] = displacement(x1, y1, x2, y2);
    return Math.sqrt(x**2 + y**2);
}

function manhattanDistance(x1, y1, x2, y2) {
    var [x, y] = displacement(x1, y1, x2, y2);
    return Math.abs(x) + Math.abs(y);
}

function getPointAngle(x, y, originX=0, originY=0) {
    var [x, y] = displacement(originX, originY, x, y);
    var theta = Math.atan(y / x);
    if(x < 0) {
        theta += Math.PI;
    }
    if(theta < 0) {
        theta += Math.PI*2;
    }
    return theta;
}

function rotatePoint(x, y, theta) {
    var c = Math.cos(theta);
    var s = Math.sin(theta);
    return [x*c - y*s, x*s + y*c];
}


// vector math (immutable)

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        
        if(isNaN(x) || isNaN(y)) {
            //console.warn(this.str());
            throw `vector components must be real numbers, not ${this.str()}`;
        }

        Object.freeze(this);
    }

    //set(v) {
    //    if(v instanceof Vector) {
    //        this.x = v.x;
    //        this.y = v.y;
    //    } else {
    //        [this.x, this.y] = v;
    //    }
    //}

    round(x=0) {
        return new Vector(this.x.toFixed(x), this.y.toFixed(x));
    }
    floor() {
        return new Vector(Math.floor(this.x), Math.floor(this.y));
    }
    
    str(x=3) {
        return `<${this.x.toFixed(x)}, ${this.y.toFixed(x)}>`;
    }
    arr() {
        return [this.x, this.y];
    }

    eq(v) {
        if(v instanceof Vector && this.x === v.x && this.y === v.y) {
            return true;
        } else {
            return false;
        }
    }

    //copy() {
    //    return new Vector(this.x, this.y);
    //}

    add(o) {
        if(o instanceof Vector) {
            return new Vector(this.x+o.x, this.y+o.y);
        } else {
            return new Vector(this.x+o, this.y+o);
        }
    }
    sub(o) {
        if(o instanceof Vector) {
            return new Vector(this.x-o.x, this.y-o.y);
        } else {
            return new Vector(this.x-o, this.y-o);
        }
    }
    mul(o) {
        if(o instanceof Vector) {
            return new Vector(this.x*o.x, this.y*o.y);
        } else {
            return new Vector(this.x*o, this.y*o);
        }
    }
    div(o) {
        if(o instanceof Vector) {
            return new Vector(this.x/o.x, this.y/o.y);
        } else {
            return new Vector(this.x/o, this.y/o);
        }
    }
    mod(o) {
        if(o instanceof Vector) {
            return new Vector(
                mod(this.x, o.x),
                mod(this.y, o.y)
            );
        } else {
            return new Vector(
                mod(this.x, o),
                mod(this.y, o)
            );
        }
    }
    get neg() {
        return new Vector(-this.x, -this.y);
    }
    get mag() {
        return Math.sqrt(this.x**2 + this.y**2);
    }
    get norm() {
        var mag = this.mag;
        if(!isNaN(mag)) {
            return this.div(mag);
        } else {
            return new Vector(0, 0);
            throw "cannot normalize zero vector";
        }
    }
    get perp() {
        return this.rotate(Math.PI/2);
    }
    
    //addSet(o) {this.set(this.add(o));}
    //subSet(o) {this.set(this.sub(o));}
    //mulSet(o) {this.set(this.mul(o));}
    //divSet(o) {this.set(this.div(o));}
    //modSet(o) {this.set(this.mod(o));}
    
    //negSet(o) {this.set(this.neg(o));}
    //normSet(o) {this.set(this.norm(o));}

    dot(v) {
        return this.x*v.x + this.y*v.y;
    }
    cross(v) {
        return this.x*v.y - this.y*v.x;
    }

    rotate(angle) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        return new Vector(this.x*c - this.y*s, this.x*s + this.y*c);
    }
}

function angleToVector(theta, magnitude=1) {
    return new Vector(Math.cos(theta), Math.sin(theta)).mul(magnitude);
}


// matrix math

class Matrix {
    constructor(i, j) {
        this.i = i;
        this.j = j;
    }

    set(m) {
        if(m instanceof Matrix) {
            this.i = m.i;
            this.j = m.j;
        } else {
            // [this.x, this.y] = v;
        }
    }
    
    str(x=3) {
        return `⎡${this.i.x.toFixed(x)} ${this.j.x.toFixed(x)}⎤
⎣${this.i.y.toFixed(x)} ${this.j.y.toFixed(x)}⎦`;
    }
    arr() {
        return [this.i.x, this.j.x, this.i.y, this.j.y];
    }

    add(o) {
        if(o instanceof Matrix) {
            return new Matrix(this.i+o.i, this.j+o.j);
        } else {
            return new Matrix(this.x+o, this.y+o);
        }
    }
}


// geometry

function distanceToLine(p1, p2, point) {
    var line = p2.sub(p1);
    var perpendicular = line.perp;
    var toPoint = point.sub(p1);

    var intersection = new Vector(...linearParametricIntersection(
        line.arr(), p1.arr(), perpendicular.arr(), point.arr()
    ));
    var distance = intersection.sub(point).mag;

    if(perpendicular.dot(toPoint) > 0) {
        return distance;
    } else {
        return -distance;
    }
}

function linearParametricIntersection(v1, p1, v2, p2) {
    // TODO convert to vectors

    var [a1, c1] = v1;
    var [b1, d1] = p1;
    var [a2, c2] = v2;
    var [b2, d2] = p2;

    var t1 = -(c2*b1 - c2*b2 - d1*a2 + d2*a2)/(a1*c2 - c1*a2);

    return [a1*t1 + b1, c1*t1 + d1];
}

function findEnclosingBox(points) {
    var minX = points[0][0];
    var maxX = points[0][0];
    var minY = points[0][1];
    var maxY = points[0][1];
    for(let i=0; i<points.length; i++) {
        if(points[i][0] < minX) {
            minX = points[i][0];
        } else if(points[i][0] > maxX) {
            maxX = points[i][0];
        }
        if(points[i][1] < minY) {
            minY = points[i][1];
        } else if(points[i][1] > maxY) {
            maxY = points[i][1];
        }
    }
    return [minX, minY, maxX, maxY];
}

function findTriangleSolution(p1, p2, p3) {
    var a = euclideanDistance(...p1, ...p2);
    var b = euclideanDistance(...p2, ...p3);
    var c = euclideanDistance(...p3, ...p1);

    // https://www.calculator.net/triangle-calculator.html
    var A = Math.acos((b**2 + c**2 - a**2) / (2*b*c));
    var B = Math.acos((a**2 + c**2 - b**2) / (2*a*c));
    var C = Math.acos((a**2 + b**2 - c**2) / (2*a*b));

    return [a, b, c, A, B, C];
}

function findTriangleCircumcircle(p1, p2, p3) {
    // https://mathworld.wolfram.com/Circumcenter.html

    // vectors
    var va = [p2[0] - p1[0], p2[1] - p1[1]];
    var vb = [p3[0] - p2[0], p3[1] - p2[1]];
    
    // perpendicular vectors
    var pva = rotatePoint(...va, Math.PI/2);
    var pvb = rotatePoint(...vb, Math.PI/2);

    var [x, y] = linearParametricIntersection(pva, lerp(p1, p2, 0.5), pvb, lerp(p2, p3, 0.5));
    var r = euclideanDistance(x, y, ...p1);
    return [x, y, r];    
}


// maze generation

function getAdjacentTiles(x, y) {
    return [
        [x + 1, y],
        [x, y + 1],
        [x - 1, y],
        [x, y - 1]
    ];
}

function createTileSpace(x, y, filler=undefined) {
    const tiles = [];
    for(let i=0; i<x; i++) {
        tiles.push([]);
        for(let j=0; j<y; j++) {
            tiles[i].push(filler);
        }
    }
    return tiles;
}

function createMazeNodeGrid(x, y, seed) {
    var rng = new Math.seedrandom(seed);

    const nodes = createTileSpace(x, y);
    var start = [randInt(0, x, rng), randInt(0, y, rng)];

    const stack = [start];
    nodes[start[0]][start[1]] = start;

    while(stack.length) {
        var current = stack[stack.length - 1];
        possibilities = getAdjacentTiles(
            current[0], current[1]
        );

        var not_found = true;
        for(let i=0; i<4; i++) {
            var pos = popAtRandom(possibilities, rng);
            if(!within(pos[0], 0, x - 1)) {
                continue
            } else if(!within(pos[1], 0, y - 1)) {
                continue
            } else if(nodes[pos[0]][pos[1]]) {
                continue
            } else {
                stack.push(pos);
                nodes[pos[0]][pos[1]] = current;

                not_found = false;
                break;
            }
        }
        if(not_found) {
            stack.pop();
        }
    }

    return nodes;
}

function createMaze(x, y, seed) {
    var nodes = createMazeNodeGrid(x, y, seed);
    var tiles = createTileSpace(x*2+1, y*2+1);

    for(let i=1; i<tiles.length; i+=2) {
        for(let j=1; j<tiles[i].length; j+=2) {
            tiles[i][j] = 1;
        }
    }

    for(let i=0; i<nodes.length; i++) {
        for(let j=0; j<nodes[i].length; j++) {
            var n = nodes[i][j];
            if(n) {
                var pos = averagePoint([i, j], n);
                pos[0] = pos[0]*2+1;
                pos[1] = pos[1]*2+1;

                tiles[pos[0]][pos[1]] = 1;
            }
        }
    }

    return tiles
}


// pathfinding

class PathfindingNode {
    constructor(x, y, parent=undefined) {
        this.x = x;
        this.y = y;
        this.parent = parent;

        this.f = undefined;
        this.g = undefined;
        this.h = undefined;
    }

    recurse() {
        var node = this;
        var array = [node];
        while(node.parent) {
            node = node.parent;
            array.push(node);
        }
        return array;
    }

    path() {
        var array = this.recurse();
        var path = [];
        for(let i=0; i<array.length; i++) {
            path.push([array[i].x, array[i].y]);
        }
        return path;
    }
}

function tiledAStar(map, startX, startY, targetX, targetY, tileCosts=undefined) {
    function tileCostFunc(x, y) {
        if(x < 0 || x >= map.length || y < 0 || y >= map[0].length) {
            return -1;
        } else if(tileCosts === undefined) {
            // standard
            console.log(x);
            if(isNaN(map[x][y]) || map[x][y] < 0) {
                return -1;
            } else {
                return map[x][y];
            }
        } else {
            // with lookup
            if(tileCosts[map[x][y]] === undefined) {
                return -1;
            } else {
                return tileCosts[map[x][y]];
            }
        }
    }

    // if start or target obstructed, then raise error
    if(tileCostFunc(startX, startY) < 0) {
        throw "start obstructed";
    }
    if(tileCostFunc(targetX, targetY) < 0) {
        throw "target obstructed";
    }

    // init variables
    var start = new PathfindingNode(startX, startY);
    start.g = 0;
    start.f = 0;
    var open = [start];
    var closed = [];

    while(open.length) {
        // finding the best node
        // inefficent, because it is not sorted, so a full scan is necessitated
        var bestIndex = 0;
        for(let i=1; i<open.length; i++) {
            if(open[i].f < open[bestIndex].f) {
                bestIndex = i;
            }
        }
        var bestNode = popAtIndex(open, bestIndex);


        // create successors
        var adjacents = getAdjacentTiles(bestNode.x, bestNode.y);
        for(let i=0; i<adjacents.length; i++) {
            var [newX, newY] = adjacents[i];

            // skip if already checked, or planned to check
            var valid = true;
            for(let i=0; i<open.length; i++) {
                var o = open[i];
                if(newX === o.x && newY === o.y) {
                    valid = false;
                    break;
                }
            }
            if(!valid) {
                continue;
            }
            for(let i=0; i<closed.length; i++) {
                var c = closed[i];
                if(newX === c.x && newY === c.y) {
                    valid = false;
                    break;
                }
            }
            if(!valid) {
                continue;
            }

            // determine tile cost
            var tileCost = tileCostFunc(newX, newY);
            if(tileCost < 0) {
                // move is impossible, skip
                continue;
            }

            // create successor
            var newNode = new PathfindingNode(newX, newY, bestNode);
            newNode.g = bestNode.g + tileCost;
            newNode.h = manhattanDistance(newNode.x, newNode.y, targetX, targetY);
            newNode.f = newNode.g + newNode.h;

            // is that the target?
            if(newNode.x === targetX && newNode.y === targetY) {
                return newNode.path();
            }

            open.push(newNode)
        }
        closed.push(bestNode);
    }

    throw "no path found";
}


// delaunay trianglulation

function delaunayTriangulation(points) {
    // Bowyer-Watson algorithm
    // https://en.wikipedia.org/wiki/Bowyer%E2%80%93Watson_algorithm
    // pseudocode included from wikipedia


//   // points is a set of coordinates defining the points to be triangulated
//   triangulation := empty triangle mesh data structure

    //// each key will be a unique incrementing integer
    var edges = {}; // array of two points
    var triangles = {}; // array of three edge keys and the circumcircle (p1, p2, p3, x, y, r)
    var nextEdge = 0;
    var nextTriangle = 0;

    function addEdge(p1, p2) {
        edges[nextEdge] = [p1, p2];
        nextEdge++;
        return nextEdge - 1;
    }

    function addTriangle(e1, e2, e3) {
        var pts = [...edges[e1], ...edges[e2], ...edges[e3]];
        removeDuplicates(pts);
        if(pts.length != 3) {
            throw "bad triangle";
        }
        triangles[nextTriangle] = [e1, e2, e3, ...findTriangleCircumcircle(...pts)];
        nextTriangle++;
        return nextTriangle - 1;
    }


//   add super-triangle to triangulation // must be large enough to completely contain all the points in points

    // right isosceles triangle around enclosing box because easy
    var [minX, minY, maxX, maxY] = findEnclosingBox(points);

    // extra space
    minX--;
    maxX++;
    minY--;
    maxY++;

    // size
    var superTriangleSize = (maxX - minX) + (maxY - minY);

    // create points
    var superPoints = [
        [minX, minY],
        [minX + superTriangleSize, minY],
        [minX, minY + superTriangleSize]
    ];

    // add triangle
    addEdge(superPoints[0], superPoints[1]);
    addEdge(superPoints[1], superPoints[2]);
    addEdge(superPoints[2], superPoints[0]);
    addTriangle(0, 1, 2);


//   for each point in points do // add all the points one at a time to the triangulation
    for(let i=0; i<points.length; i++) {
        let point = points[i];


//      badTriangles := empty set
//      for each triangle in triangulation do // first find all the triangles that are no longer valid due to the insertion
//         if point is inside circumcircle of triangle
//            add triangle to badTriangles
        var badTriangles = [];
        for(key in triangles) {
            if(euclideanDistance(...point, triangles[key][3], triangles[key][4]) < triangles[key][5]) {
                badTriangles.push(parseInt(key));
            }
        }


//      polygon := empty set
//      for each triangle in badTriangles do // find the boundary of the polygonal hole
//         for each edge in triangle do
//            if edge is not shared by any other triangles in badTriangles
//               add edge to polygon

        var badEdges = [];
        for(let j=0; j<badTriangles.length; j++) {
            for(let k=0; k<3; k++) {
                badEdges.push(triangles[badTriangles[j]][k]);
            }
        }
        var badEdgeCounts = getItemCounts(badEdges);

        var innerEdges = [];
        var outerEdges = [];
        for(let j=0; j<badEdgeCounts.length; j++) {
            if(badEdgeCounts[j][1] == 1) {
                outerEdges.push(badEdgeCounts[j][0]);
            } else {
                innerEdges.push(badEdgeCounts[j][0]);
            }
        }


//      for each edge in polygon do // re-triangulate the polygonal hole
//         newTri := form a triangle from edge to point
//         add newTri to triangulation

        var pointsConnected = [];
        var connectionEdges = [];
        for(let j=0; j<outerEdges.length; j++) {
            var triangleEdges = [outerEdges[j]];
            for(let k=0; k<2; k++) {
                var currentPoint = edges[outerEdges[j]][k];
                var index = pointsConnected.indexOf(currentPoint);
                var edge;
                if(index == -1) {
                    edge = addEdge(currentPoint, point);
                    pointsConnected.push(currentPoint);
                    connectionEdges.push(edge);
                } else {
                    edge = connectionEdges[index];
                }
                triangleEdges.push(edge);
            }
            addTriangle(...triangleEdges);
        }
        

//      for each triangle in badTriangles do // remove them from the data structure
//         remove triangle from triangulation
        
        //// don't remove the super-triangle (id 0); it will be done later
        for(let j=0; j<badTriangles.length; j++) {
            delete triangles[badTriangles[j]];
        }
        //// or it's edges (id 0, 1, 2)
        for(let j=0; j<innerEdges.length; j++) {
            delete edges[innerEdges[j]];
        }
    }


//   for each triangle in triangulation // done inserting points, now clean up
//      if triangle contains a vertex from original super-triangle
//         remove triangle from triangulation

    // edges
    var superEdges = [];
    for(key in edges) {
        for(let i=0; i<superPoints.length; i++) {
            if(edges[key].includes(superPoints[i])) {
                superEdges.push(parseInt(key));
                delete edges[key];
                break;
            }
        }
    }

    // triangles
    for(key in triangles) {
        for(let i=0; i<superEdges.length; i++) {
            if(triangles[key].includes(superEdges[i])) {
                delete triangles[key];
                break;
            }
        }
    }


//   return triangulation

    return [edges, triangles];
}


// map generation

function createDungeon(width, height, roomCmds, tileCosts=undefined) {
    function roomPlacementCheck(x, y, w, h) {
        // pad the edges, to separate rooms
        x -= 1;
        y -= 1;
        w += 2;
        h += 2;

        if(x < 0 || x+w > width || y < 0 || y+h > height) {
            return false;
        }

        for(let i=x; i<x+w; i++) {
            for(let j=y; j<y+h; j++) {
                if(map[i][j] == "room") {
                    return false;
                }
            }
        }
        return true;
    }

    function attemptRoomPlacement(x, y, w, h) {
        if(roomPlacementCheck(x, y, w, h)) {
            for(let i=x; i<x+w; i++) {
                for(let j=y; j<y+h; j++) {
                    map[i][j] = "room";
                }
            }
            return true;
        }
        return false;
    }

    function addRooms(minW, maxW, minH, maxH, count, maxAttemptsEach=50) {
        var rooms = [];
        for(let i=0; i<count; i++) {
            var w = randInt(minW, maxW + 1);
            var h = randInt(minH, maxH + 1);

            for(let j=0; j<maxAttemptsEach; j++) {
                var x = randInt(0, width - w);
                var y = randInt(0, height - h);
                if(attemptRoomPlacement(x, y, w, h, true)) {
                    rooms.push([x, y, w, h]);
                    break;
                }
            }
        }
        return rooms;
    }


    if(tileCosts === undefined) {
        var tileCosts = {
            "corridor": 1,
            "stone": 5,
            "room": 10
        };
    }

    var map = createTileSpace(width, height, "stone");


    // add rooms

    var rooms = [];
    for(let i=0; i<roomCmds.length; i++) {
        rooms.push(...addRooms(...roomCmds[i]));
    }


    //// triangulate rooms

    var delaunayPoints = [];
    for(let i=0; i<rooms.length; i++) {
        delaunayPoints.push([
            Math.floor(rooms[i][0] + rooms[i][2]/2),
            Math.floor(rooms[i][1] + rooms[i][3]/2)
        ]);
    }

    var [edges, triangles] = delaunayTriangulation(delaunayPoints);


    // here is where I would remove extraneous edges, via MST, if I want


    // create corridors

    var edgesArray = [];
    for(key in edges) {
        edgesArray.push(edges[key]);
    }
    shuffle(edgesArray);

    for(let i=0; i<edgesArray.length; i++) {
        var path = tiledAStar(map, ...edgesArray[i][0], ...edgesArray[i][1], tileCosts);
        for(let j=0; j<path.length; j++) {
            var [x, y] = path[j];
            if(map[x][y] == "stone") {
                map[x][y] = "corridor";
            }
        }
    }

    
    return [map, rooms];
}


// colors

var WHITE = "#ffffff";
var BLACK = "#000000";

var GREY = "#808080";

var DARK_GREY = "#404040";
var LIGHT_GREY = "#b0b0b0";

var RED = "#ff0000";
var GREEN = "#00ff00";
var BLUE = "#0000ff";

var YELLOW = "#ffff00";
var CYAN = "#00ffff";
var PURPLE = "#ff00ff";


// basic canvas

function drawLine(ctx, p1, p2, color) {
    ctx.beginPath();
    ctx.moveTo(...p1);
    ctx.lineTo(...p2);
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();
}

function drawCircle(ctx, pos, radius, fillColor, edgeColor=null) {
    ctx.beginPath();
    ctx.arc(...pos, radius, 0, Math.PI*2);
    if(fillColor !== null) {
        ctx.fillStyle = fillColor;
        ctx.fill();
    }
    if(edgeColor !== null) {
        ctx.strokeStyle = edgeColor;
        ctx.stroke();
    }
    ctx.closePath();
}

function drawRectangle(ctx, pos, size, fillColor, edgeColor=null) {
    ctx.beginPath();
    ctx.rect(...pos, ...size);
    if(fillColor !== null) {
        ctx.fillStyle = fillColor;
        ctx.fill();
    }
    if(edgeColor !== null) {
        ctx.strokeStyle = edgeColor;
        ctx.stroke();
    }
    ctx.closePath();
}

function drawPolygon(ctx, points, fillColor, edgeColor=null) {
    ctx.beginPath();
    ctx.moveTo(...points[0]);
    for(let i=0; i<points.length; i++) {
        ctx.lineTo(...points[i]);
    }
    ctx.lineTo(...points[0]);
    if(fillColor !== null) {
        ctx.fillStyle = fillColor;
        ctx.fill();
    }
    if(edgeColor !== null) {
        ctx.strokeStyle = edgeColor;
        ctx.stroke();
    }
    ctx.closePath();
}

function fillCanvas(ctx, canvas, fillColor) {
    drawRectangle(ctx, [0, 0], [canvas.width, canvas.height], fillColor);
}

//function fillOutsideCircle(ctx, pos, radius, fillColor) {
//    ctx.fillStyle = fillColor;
//    ctx.fillRect(0, 0, canvas.width, canvas.height);
//    ctx.globalCompositeOperation = "destination-out";
//    ctx.fillStyle = "rgba(255, 255, 255, 1)";
//    ctx.arc(...pos, radius, 0, Math.PI*2);
//    ctx.fill();
//}


// advanced canvas

//function drawMap(ctx, map, tileSize, tileColors={}, gridColor=GREY) {
//    var width = map.length;
//    var height = map[0].length;
//    var size = [tileSize, tileSize]

//    for(let i=0; i<width; i++) {
//        for(let j=0; j<height; j++) {
//            if(map[i][j] !== null) {
//                var color = tileColors[map[i][j]];
//                if(color === null) {
//                    color = PURPLE;
//                }
//                drawRectangle(ctx, [i*tileSize, j*tileSize], size, color, gridColor);
//            }
//        }
//    }
//}


// other idk

function isString(x) {
    return typeof x === "string" || x instanceof String;
}
