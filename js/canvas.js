"use strict";

const ACTOR_TYPES = {
  CIRCLE: "circle",
  SQUARE: "square",
  HEART: "heart"
};
const SCALE = 40;
const MAX_SIZE_DEVIATION = 0.2;
const MAX_VELOCITY_DEVIATION = 0.4;
const SPEED = 5;
const MAX_NUM_OF_CIRCLES = 5;
const MAX_NUM_OF_SQUARES = 5;
const MAX_NUM_OF_HEARTS = 10;
const GENERATING_DELAY = 5000; // in ms


function halfChance() {
  return Math.random() > 0.5
}

class ActorGenerator {
  static generateCircle(number) {
    let color = randRGBcolor();
    let radius = (SCALE / 2) * randMultiplier(MAX_SIZE_DEVIATION);
    let pos = new Vec(radius, radius);
    let velocity = Vec.randomVec();
    return new Circle(pos, velocity, color, ACTOR_TYPES.CIRCLE, number, radius)
  }
  static generateSquare(number) {
    let color = randRGBcolor();
    let pos = new Vec(1, 1);
    let velocity = Vec.randomVec();
    let side = SCALE * randMultiplier(MAX_SIZE_DEVIATION);
    return new Square(pos, velocity, color, ACTOR_TYPES.SQUARE, number, side)
  }
  static generateHeart(number) {
    let color = randRGBcolor();
    let radius = (SCALE / 2) * randMultiplier(MAX_SIZE_DEVIATION);
    let pos = new Vec(radius, radius);
    let velocity = Vec.randomVec();
    return new Circle(pos, velocity, color, ACTOR_TYPES.HEART, number, radius)
  }
  static generateActor(type, number) {
    if (type === ACTOR_TYPES.CIRCLE) return ActorGenerator.generateCircle(number);
    if (type === ACTOR_TYPES.SQUARE) return ActorGenerator.generateSquare(number);
    if (type === ACTOR_TYPES.HEART) return ActorGenerator.generateHeart(number);
  }
}

class Actors {
  constructor(numOfCircles, numOfSquares, numOfHearts, generatingDelay) {
    this.actors = [];
    this.maxNumOfCircles = numOfCircles;
    this.maxNumOfSquares = numOfSquares;
    this.maxNumOfHearts = numOfHearts;
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
  addRandomActor() {
    if (halfChance()) {
      this.addActor(ACTOR_TYPES.HEART);
    } else if (halfChance()) {
      this.addActor(ACTOR_TYPES.SQUARE);
    } else {
      this.addActor(ACTOR_TYPES.CIRCLE);
    }
  }
  logGeneratedActor(actor) {
    console.log(`Number: ${actor.number}, Type: ${actor.type}, Color: ${actor.color}, Area: ${actor.area.toFixed(1)}`);
  }
  runAutoAddFlow() {
    if (this.actors.length < this.maxSize) {
      if(Engine.isStartingAreaClear(this.actors)) {

        if (this.isFreeRoomForActor()) {
          this.addRandomActor();
        } else if (this.counter[ACTOR_TYPES.CIRCLE] < this.maxNumOfCircles) {
          this.addActor(ACTOR_TYPES.CIRCLE);}
        else if (this.counter[ACTOR_TYPES.HEART] < this.maxNumOfHearts) {
          this.addActor(ACTOR_TYPES.HEART);
        } else if (this.counter[ACTOR_TYPES.SQUARE] < this.maxNumOfSquares) {
          this.addActor(ACTOR_TYPES.SQUARE);
        }

        setTimeout(() => this.runAutoAddFlow(), this.delay);
      } else {
        setTimeout(() => this.runAutoAddFlow(), 100);
      }
    }
  }
  isFreeRoomForActor() {
    return this.counter[ACTOR_TYPES.CIRCLE] < this.maxNumOfCircles &&
      this.counter[ACTOR_TYPES.SQUARE] < this.maxNumOfSquares &&
      this.counter[ACTOR_TYPES.HEART] < this.maxNumOfHearts
  }
}

class Render {
  constructor(canvasID, actors) {
    this.canvas = document.getElementById(canvasID);
    this.cx = this.canvas.getContext("2d");
    this.canvasWidth = this.canvas.width;
    this.canvasHeight = this.canvas.height;
    this.actors = actors.actors;
    this.fpsON = true;
    this.FPS = 0;
    this.shownFPS = 0;
    this.lastTime = +(new Date());
    this.lastTimeFPSshown = 0;
  }
  initialise() {
    this.cx.font = '20px serif';
    let checkBoxFPS = document.getElementById("showFPS");
    this.fpsON = checkBoxFPS.checked;
    checkBoxFPS.addEventListener("change", () => this.fpsON = !this.fpsON);
  }
  calcFPS(now) {
    this.FPS = Math.round(1000 / (now - this.lastTime));
    this.lastTime = now;
  }
  showFPS() {
    let now = +(new Date());
    this.calcFPS(now);
    if (now - this.lastTimeFPSshown > 1000) {
      this.shownFPS = this.FPS;
      this.lastTimeFPSshown = now;
    }
    this.cx.fillStyle = 'cornflowerblue';
    this.cx.fillText(this.shownFPS + " fps", this.canvasWidth - 60, 20);
  }
  drawActor(actor) {
    this.cx.beginPath();
    if (actor.type === ACTOR_TYPES.CIRCLE) {
      this.cx.arc(actor.pos.x, actor.pos.y, actor.radius, 0, 2 * Math.PI);
    }
    if (actor.type === ACTOR_TYPES.SQUARE) {
      this.cx.rect(actor.pos.x, actor.pos.y, actor.side, actor.side);
    }
    if (actor.type === ACTOR_TYPES.HEART) {
      this.drawHeart(actor);
    }
    this.cx.fillStyle = actor.color;
    this.cx.fill();
  }
  drawHeart(actor) {
    let x = actor.pos.x - 25;
    let y = actor.pos.y - 25;
    let mult = .4;
    this.cx.beginPath();
    this.cx.moveTo(x, y - 15);
    this.cx.moveTo(x + 75 * mult, y + 40 * mult);
    bezierToXandY(this.cx, 75, 37, 70, 25, 50, 25, x, y, mult);
    bezierToXandY(this.cx, 20, 25, 20, 62.5, 20, 52.5, x, y, mult);
    bezierToXandY(this.cx, 20, 80, 40, 102, 75, 120, x, y, mult);
    bezierToXandY(this.cx, 110, 102, 130, 80, 130, 52.5, x, y, mult);
    bezierToXandY(this.cx, 130, 62.5, 130, 25, 100, 25, x, y, mult);
    bezierToXandY(this.cx, 85, 25, 75, 37, 75, 40, x, y, mult);
    function bezierToXandY(cx, cp1x, cp1y, cp2x, cp2y, endx, endy, x, y, mult = 1) {
      cx.bezierCurveTo(cp1x * mult  + x, cp1y * mult + y, cp2x * mult + x, cp2y * mult + y, endx * mult + x, endy * mult + y);
    }
  }
  drawScene() {
    this.cx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.actors.forEach(actor => this.drawActor(actor));
  }
  renderView() {
    Engine.updateState(this.actors, this.canvasWidth, this.canvasHeight);
    this.drawScene();
    if (this.fpsON) this.showFPS();
    window.requestAnimationFrame(time => this.renderView());
  }
}

let actors = new Actors(MAX_NUM_OF_CIRCLES, MAX_NUM_OF_SQUARES, MAX_NUM_OF_HEARTS, GENERATING_DELAY);
let render = new Render("canvas-view", actors);

render.initialise();

actors.runAutoAddFlow();
// actors.addActor("heart");

render.renderView();


