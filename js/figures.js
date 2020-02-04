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
  static randomVec() {
    let x = 0.9 - MAX_VELOCITY_DEVIATION * Math.random();
    let y = Math.sqrt(1 - x ** 2);
    return new Vec(x, y).multiply(SPEED);
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
    this.center;
  }
  get center() {
    return new Vec(this.pos.x, this.pos.y)
  }
}

class Square extends Figure{
  constructor(pos, velocity, color, type, number, side) {
    super(pos, velocity, color, type, number);
    this.side = side;
    this.area = side ** 2;
    this.center;
    this.radiusInner = this.side / 2;
    this.radiusOuter = Math.sqrt(this.radiusInner ** 2 + this.radiusInner ** 2);
    this.radius = (this.radiusInner + this.radiusOuter) / 2;
  }
  get center() {
    return new Vec(this.pos.x + this.radiusInner, this.pos.y + this.radiusInner);
  }
}

class Heart extends Circle {
  constructor(pos, velocity, color, type, number, radius) {
    super(pos, velocity, color, type, number, radius);
    this.radius = radius;
    this.area = Math.PI * radius ** 2;
    this.center;
  }
  get center() {
    return new Vec(this.pos.x, this.pos.y)
  }
}