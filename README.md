# coolmath-game

## Responsibilities
### Eric
 - programming
 - game testing
 - spell checking (lol)
### Elliott
 - design
 - art
 - sound
 - game testing
 - balancing

## Description
A tower defense game, where you build a castle and defend it from enemies.

Options we chose from:
 - roguelike
   - turn-based
   - requires many items and enemies, and much balancing
 - platformer
   - easy physics with verlet
   - easy manual level creation
   - complex procedural generation
 - bullet hell
   - verlet bullets would be cool, but difficult to make bounce
   - point (no radius) bullets are easy
   - enemy pathfinding is easy with A*
   - aiming can either point at the player, or where he will be (long math, and I can't find the code I wrote for it :( )
 - **tower defense**
   - would be very easy to port to js, if I could find my BTD pygame project
   - if implemented on a grid, players could build a little base in a dungeon
 - puzzle
   - we would need to think one up lol
   - needs to have simple rules, but be challenging to solve
 - aiming
   - top down, such as mini golf
   - side view, such as basketball
selected:
 - tower defense
   - players can add obstacles to the path, which the enemies will attack
   - towers are placed on the path similarly

## Resources
### HTML / Javascript
 - [Dungeon generator](https://github.com/ericl16384/dungeon-generator)
   - Tiled A* pathfinding
   - Delaunay triangulation
 - [Verlet physics](https://github.com/ericl16384/verlet-physics)
   - Circle-based physics (may be able to be more general with more time)
 - [Wheel simulation](https://github.com/ericl16384/js-repls/tree/main/wheelSimulation)
   - Friction
### Python / Pygame
 - [Pygame spaceship](https://github.com/ericl16384/pygame-spaceship)
   - Rigidbody physics (no collisions)
 - Bloons TD clone
   - I can't find, but I remember it was a pygame repl from a while back
