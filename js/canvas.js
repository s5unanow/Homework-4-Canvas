"use strict";

const ACTOR_TYPES = {
  CIRCLE: "circle",
  SQUARE: "square"
};
const SCALE = 30;
const MAX_SIZE_DEVIATION = 0.4;
const MAX_VELOCITY_DEVIATION = 0.6;
const SPEED = 2;


function halfChance() {
  return Math.random() > 0.5
}

function randInt(maxNumber) {
  return Math.floor(Math.random() * maxNumber)
}

function randRGBcolor() {
  let red = randInt(255);
  let green = randInt(255);
  let blue = 100;
  if (Math.abs(red - green) < 100) {
    if (red > 127) blue = red - 100;
    else blue = red + 100;
  }
  return `rgb(${red}, ${green}, ${blue})`
}

function randMultiplier(maxDeviation) {
  return 1 + (2 * Math.random() - 1) * maxDeviation //returns number in range [1 - maxDeviationCoefficient, 1 + maxDeviationCoefficient)
}

class Vec {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  sum(another) {
    return new Vec(this.x + another.x, this.y + another.y);
  }
  multiply(multiplier) {
    return new Vec(this.x * multiplier, this.y * multiplier);
  }
  static randomVec(defaultValue = 1) {
    let x = defaultValue * randMultiplier(MAX_VELOCITY_DEVIATION);
    let y = defaultValue * randMultiplier(MAX_VELOCITY_DEVIATION);
    return new Vec(x, y);
  }
}

class Figure {
  constructor(pos, velocity, color, type, number) {
    this.pos = pos;
    this.velocity = velocity;
    this.color = color;
    this.type = type;
    this.number = number;
  }
}

class Circle extends Figure {
  constructor(pos, velocity, color, type, number, radius) {
    super(pos, velocity, color, type, number);
    this.radius = radius;
    this.area = Math.PI * radius ** 2;
  }
}

class Square extends Figure{
  constructor(pos, velocity, color, type, number, side) {
    super(pos, velocity, color, type, number);
    this.side = side;
    this.area = side ** 2;
    this.center;
  }
  get center() {
    return new Vec(this.pos.sum(this.side / 2));
  }
}

class ActorGenerator {
  static generateCircle(number) {
    let color = randRGBcolor();
    let radius = (SCALE / 2) * randMultiplier(MAX_SIZE_DEVIATION);
    let pos = new Vec(radius, radius);
    let velocity = Vec.randomVec().multiply(SPEED);
    return new Circle(pos, velocity, color, ACTOR_TYPES.CIRCLE, number, radius)
  }
  static generateSquare(number) {
    let color = randRGBcolor();
    let pos = new Vec(1, 1);
    let velocity = Vec.randomVec().multiply(SPEED);
    let side = SCALE;
    return new Square(pos, velocity, color, ACTOR_TYPES.SQUARE, number, side)
  }
  static generateActor(type, number) {
    if (type === ACTOR_TYPES.CIRCLE) return ActorGenerator.generateCircle(number);
    if (type === ACTOR_TYPES.SQUARE) return ActorGenerator.generateSquare(number);
  }
}

class Actors {
  constructor(numOfCircles, numOfSquares, generatingDelay) {
    this.actors = [];
    this.maxNumOfCircles = numOfCircles;
    this.maxNumOfSquares = numOfSquares;
    this.counter = this.initializeCounter();
    this.maxSize = numOfCircles + numOfSquares;
    this.delay = generatingDelay;
  }
  initializeCounter() {
    let counter = {};
    for (let type in ACTOR_TYPES) {
      counter[ACTOR_TYPES[type]] = 0;
    }
    return counter
  }
  addActor(type) {
    if(Object.values(ACTOR_TYPES).includes(type)) {
      let actorNumber = this.actors.length + 1;
      let actor = ActorGenerator.generateActor(type, actorNumber);
      this.logGeneratedActor(actor);
      this.counter[type]++;
      this.actors.push(actor);
    }
  }
  logGeneratedActor(actor) {
    console.log(`Number: ${actor.number}, Type: ${actor.type}, Color: ${actor.color}, Area: ${actor.area}`);
  }
  runAutoAddFlow() {
    if (this.actors.length < this.maxSize) {

      if (this.counter[ACTOR_TYPES.CIRCLE] < this.maxNumOfCircles && this.counter[ACTOR_TYPES.SQUARE] < this.maxNumOfSquares) {
        if (halfChance()) {
          this.addActor(ACTOR_TYPES.CIRCLE);
        } else {
          this.addActor(ACTOR_TYPES.SQUARE);
        }

      } else if (this.counter[ACTOR_TYPES.CIRCLE] < this.maxNumOfCircles) {
        this.addActor(ACTOR_TYPES.CIRCLE);
      } else if (this.counter[ACTOR_TYPES.SQUARE] < this.maxNumOfSquares) {
        this.addActor(ACTOR_TYPES.SQUARE);
      }

      setTimeout(() => this.runAutoAddFlow(), this.delay);
    }
  }
}

class Engine {
  static updateState(actors, width, height) {
    Engine.checkAndUpdateIfWallCollision(actors, width, height);
    Engine.checkAndUpdateIfElementsCollide(actors);
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
    circle.pos.x += circle.velocity.x;
    circle.pos.y += circle.velocity.y;
  }
  static wallCollisionSquare(square, width, height) {

  }
  static checkAndUpdateIfElementsCollide(actors) {

  }
}

class Render {
  constructor(canvasID, actors) {
    this.canvas = document.getElementById(canvasID);
    this.cx = this.canvas.getContext("2d");
    this.canvasWidth = this.canvas.width;
    this.canvasHeight = this.canvas.height;
    this.actors = actors.actors;
  }
  drawActor(actor) {
    this.cx.beginPath();
    if (actor.type === ACTOR_TYPES.CIRCLE) {
      this.cx.arc(actor.pos.x, actor.pos.y, actor.radius, 0, 2 * Math.PI);
    }
    if (actor.type === ACTOR_TYPES.SQUARE) {
      this.cx.rect(actor.pos.x, actor.pos.y, actor.side, actor.side);
    }
    this.cx.fillStyle = actor.color;
    this.cx.fill();
  }
  drawScene() {
    this.cx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.actors.forEach(actor => this.drawActor(actor));
  }
  renderView() {
    Engine.updateState(this.actors, this.canvasWidth, this.canvasHeight);
    this.drawScene();
    window.requestAnimationFrame(time => this.renderView());
  }
}

let actors = new Actors(10, 10, 5000);
let render = new Render("canvas-view", actors);

actors.addActor("circle");
actors.addActor("circle");
actors.addActor("circle");
actors.addActor("circle");
actors.addActor("circle");
actors.addActor("circle");
actors.addActor("circle");
actors.addActor("circle");
actors.addActor("circle");
actors.addActor("circle");
actors.addActor("circle");
actors.addActor("circle");
actors.addActor("circle");
actors.addActor("circle");
actors.addActor("circle");
actors.addActor("circle");
actors.addActor("circle");
actors.addActor("circle");
actors.addActor("circle");
actors.addActor("circle");
actors.addActor("circle");
actors.addActor("circle");
actors.addActor("circle");
actors.addActor("circle");
actors.addActor("circle");
actors.addActor("circle");
actors.addActor("circle");
actors.addActor("circle");
actors.addActor("circle");
actors.addActor("circle");
actors.addActor("circle");
actors.addActor("circle");

render.renderView();