class Circle {
  constructor(radius) {
    this.radius = radius;
  }

  get area() {
    return Math.PI * Math.pow(this.radius, 2);
  }

  get diameter() {
    return 2 * this.radius;
  }

  get circumference() {
    return 2 * Math.PI * this.radius;
  }
}

class IsoTriangle {
  constructor(leg, base) {
    this.leg = leg;
    this.base = base;
  }

  get perimeter() {
    return 2 * this.leg + this.base;
  }

  get area() {
    return 0.5 * this.base * this.height;
  }

  get height() {
    return Math.sqrt(Math.pow(this.leg, 2) - Math.pow(this.base / 2, 2));
  }
}

class Rectangle {
  constructor(length, width) {
    this.length = length;
    this.width = width;
  }

  get area() {
    return this.length * this.width;
  }

  get perimeter() {
    return 2 * this.length + 2 * this.width;
  }
}

export {Circle, IsoTriangle, Rectangle};
