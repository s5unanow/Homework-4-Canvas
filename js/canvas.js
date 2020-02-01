const ACTOR_TYPES = {
  CIRCLE: "circle",
  SQUARE: "square"
};
const scale = 20;
const speed = 10;
const maxSizeDeviation = 0.4;


function halfChance() {
  return Math.random() > 0.5
}

function randNumber(maxNumber) {
  return Math.floor(Math.random() * maxNumber)
}

function randRGBcolor() {
  let red = randNumber(255);
  let green = randNumber(255);
  let blue = 100;
  if (Math.abs(red - green) < 100) {
    if (red > 127) blue = red - 100;
    else blue = red + 100;
  }
  return `rgb(${red}${green}${blue})`
}

function randDeviation(maxDeviationCoefficient) {
  return 1 + (2 * Math.random() - 1) * maxDeviationCoefficient
}

function randStartDirection() {

}

class Figure {
  constructor(pos, speed, color, type, number) {
    this.pos = pos;
    this.speed = speed;
    this.color = color;
    this.type = type;
    this.number = number;
  }
}

class Circle extends Figure {
  constructor(pos, speed, color, type, number, radius) {
    super(pos, speed, color, type, number);
    this.radius = radius;
    this.area = Math.PI * radius ** 2;
  }
}

class Square extends Figure{
  constructor(pos, speed, color, type, number, side) {
    super(pos, speed, color, type, number);
    this.side = side;
    this.area = side ** 2;
  }
}

class ActorGenerator {
  static generateCircle(number) {
    let radius =
    let circle
    return circle
  }
  static generateSquare(number) {

  }
  static generateActor(type, number) {
    if (type === ACTOR_TYPES.CIRCLE) return ActorGenerator.generateCircle();
    if (type === ACTOR_TYPES.SQUARE) return ActorGenerator.generateSquare();
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
    if(ACTOR_TYPES[type]) {
      let actorNumber = this.actors.length + 1;
      let actor = ActorGenerator.generateActor(type, actorNumber);
      this.logGeneratedActor(actor);
      this.counter[type]++;
      this.actors.push();
    }
  }
  logGeneratedActor(actor) {
    console.log(`Number: ${actor.number}, type: ${actor.type}, color: ${actor.color}, area: ${actor.area}`);
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
  static updateState(actors) {

  }
}

class Render {
  constructor(canvasID, actors) {
    this.canvas = document.getElementById(canvasID);
    this.cx = this.canvas.getContext("2d");
    this.actors = actors;
  }
  drawActor(actor) {
    if (actor.type === ACTOR_TYPES.CIRCLE) {
      this.cx.beginPath();
      this.cx.arc(actor.pos.x, actor.pos.y, actor.radius, 0, 2 * Math.PI);
      this.cx.fillStyle = actor.color;
      this.cx.fill();
    }
    if (actor.type === ACTOR_TYPES.SQUARE) {
      this.cx.beginPath();
      this.cx.rect(actor.pos.x, actor.pos.y, actor.side, actor.side);
      this.cx.fillStyle = actor.color;
      this.cx.fill();
    }
  }
  drawScene() {
    this.cx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.actors.forEach(actor => this.drawActor(actor));
  }
  renderView() {
    Engine.updateState(this.actors);
    this.drawScene();
    window.requestAnimationFrame(this.renderView);
  }
}

let actors = new Actors(10, 10, 5000);
let render = new Render("canvas-view", actors);