"use strict";

class Engine {
  static updateState(actors, width, height) {
    Engine.checkAndUpdateIfElementsCollide(actors);
    Engine.checkAndUpdateIfWallCollision(actors, width, height);
    Engine.makeMove(actors);
  }
  static checkAndUpdateIfWallCollision(actors, width, height) {
    for (let actor of actors) {
      if (actor.type === ACTOR_TYPES.CIRCLE) Engine.wallCollisionCircle(actor, width, height);
      if (actor.type === ACTOR_TYPES.SQUARE) Engine.wallCollisionSquare(actor, width, height);
    }
  }
  static wallCollisionCircle(circle, width, height) {
    if (circle.pos.x + circle.radius + circle.velocity.x > width ||
      circle.pos.x - circle.radius + circle.velocity.x < 0) {
      circle.velocity.x = -circle.velocity.x;
    }
    if (circle.pos.y + circle.radius + circle.velocity.y > height ||
      circle.pos.y - circle.radius + circle.velocity.y < 0) {
      circle.velocity.y = -circle.velocity.y;
    }
  }
  static wallCollisionSquare(square, width, height) {
    if (square.pos.x + square.side + square.velocity.x > width ||
      square.pos.x + square.velocity.x < 0) {
      square.velocity.x = - square.velocity.x;
    }
    if (square.pos.y + square.side + square.velocity.y > height ||
      square.pos.y + square.velocity.y < 0) {
      square.velocity.y = - square.velocity.y;
    }
  }
  static checkAndUpdateIfElementsCollide(actors) {
    let collided = new Array(actors.length).fill(false);
    let maxSafeDistance = SCALE * 2; //may be a problem with high speed; replace "2" with SPEED?

    actors.forEach((curActor, index) => {
      if (!collided[index] && index !== actors.length - 1) {
        for (let next = index + 1; next < actors.length; next++) {
          //light check for the collision
          let nextActor = actors[next];
          if (Math.abs(curActor.center.x - nextActor.center.x) > maxSafeDistance ||
            Math.abs(curActor.center.y - nextActor.center.y) > maxSafeDistance) {
            // nothing here
          } else if (curActor.radius + nextActor.radius > calcDistance(curActor, nextActor)) { //hard check for the collision
            collided[index] = true;
            collided[next] = true;
            swapVelocity(curActor, nextActor);
          }
        }
      }
    });
    function calcDistance(actor1, actor2) {
      return Math.sqrt(((actor1.center.x + actor1.velocity.x) - (actor2.center.x + actor2.velocity.x)) ** 2 +
        ((actor1.center.y + actor1.velocity.y) - (actor2.center.y + actor2.velocity.y)) ** 2)
    }
    function swapVelocity(actor1, actor2) {
      [actor1.velocity.x, actor2.velocity.x] = [actor2.velocity.x, actor1.velocity.x];
      [actor1.velocity.y, actor2.velocity.y] = [actor2.velocity.y, actor1.velocity.y]
    }
  }
  static makeMove(actors) {
    actors.forEach(actor => {
      actor.pos.x += actor.velocity.x;
      actor.pos.y += actor.velocity.y;
    });
  }
  static isStartingAreaClear(actors) {
    return actors.every(actor => actor.pos.x > (1.1 + MAX_SIZE_DEVIATION) * SCALE  && actor.pos.y > (1.1 + MAX_SIZE_DEVIATION) * SCALE)
  }
}