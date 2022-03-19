import {rad2deg, deg2rad} from "./math.js";

class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  rotate(angle, degrees = true) {
    if (degrees) {
      angle = deg2rad(angle);
    }
    const x = Math.cos(angle) * this.x - Math.sin(angle) * this.y;
    const y = Math.sin(angle) * this.x + Math.cos(angle) * this.y;
    return new Vector2(x, y);
  }

  rotate_ip(angle, degrees = true) {
    if (degrees) {
      angle = deg2rad(angle);
    }
    const x1 = this.x;
    const y1 = this.y;
    this.x = Math.cos(angle) * x1 - Math.sin(angle) * y1;
    this.y = Math.sin(angle) * x1 + Math.cos(angle) * y1;
  }

  scale(alpha) {
    return new Vector2(this.x * alpha, this.y * alpha);
  }

  scale_ip(alpha) {
    this.x *= alpha;
    this.y *= alpha;
  }

  unitize() {
    const x0 = this.x / this.magnitude;
    const y0 = this.y / this.magnitude;
    return new Vector2(x0, y0);
  }

  unitize_ip() {
    const x0 = this.x / this.magnitude;
    const y0 = this.y / this.magnitude;
    [this.x, this.y] = [x0, y0];
  }

  get magnitude() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  set magnitude(mag) {
    const unit = Vector2.unit(this.x, this.y);
    const x = unit.x * mag;
    const y = unit.y * mag;
    this.x = x;
    this.y = y;
  }

  get theta() {
    return Math.atan2(this.y, this.x);
  }

  static distance(v1, v2) {
    return Math.sqrt(Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2));
  }

  static unit(x, y) {
    const mag = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    const x0 = x / mag;
    const y0 = y / mag;
    return new Vector2(x0, y0);
  }

  static dot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
  }

  static add(...vectors) {
    let x = 0, y = 0;
    for (let vector of vectors) {
      x += vector.x;
      y += vector.y;
    }
    return new Vector2(x, y);
  }

  static fromPoints(x1, y1, x2, y2, unit = false) {
    const x = x2 - x1;
    const y = y2 - y1;
    const vector = unit ? Vector2.unit(x, y) : new Vector2(x, y);
    return vector;
  }
}
export default Vector2;