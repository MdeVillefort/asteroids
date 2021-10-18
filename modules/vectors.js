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
    let x1 = this.x;
    let y1 = this.y;
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
    let x0 = this.x / this.magnitude;
    let y0 = this.y / this.magnitude;
    return new Vector2(x0, y0);
  }

  unitize_ip() {
    let x0 = this.x / this.magnitude;
    let y0 = this.y / this.magnitude;
    [this.x, this.y] = [x0, y0];
  }

  get magnitude() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  set magnitude(mag) {
    let unit = Vector2.unit(this.x, this.y);
    let x = unit.x * mag;
    let y = unit.y * mag;
    this.x = x;
    this.y = y;
  }

  get theta() {
    return Math.atan2(this.y, this.x);
  }

  static distance(v1, v2) {
    return Math.sqrt(Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2))
  }

  static unit(x, y) {
    let mag = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    let x0 = x / mag;
    let y0 = y / mag;
    return new Vector2(x0, y0);
  }

  static dot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
  }

  static add(v1, v2) {
    return new Vector2(v1.x + v2.x, v1.y + v2.y);
  }

  static fromPoints(x1, y1, x2, y2, unit = false) {
    let x = x2 - x1;
    let y = y2 - y1;
    let vector = unit ? Vector2.unit(x, y) : new Vector2(x, y);
    return vector;
  }
}
export default Vector2;