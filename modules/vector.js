import {rad2deg, deg2rad} from "./utils.js";

class Vector2D {
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
    return new Vector2D(this.x * alpha, this.y * alpha);
  }

  scale_ip(alpha) {
    this.x *= alpha;
    this.y *= alpha;
  }

  unitize() {
    let x0 = this.x / this.magnitude;
    let y0 = this.y / this.magnitude;
    return new Vector2D(x0, y0);
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
    let unit = Vector2D.unit(this.x, this.y);
    let x = unit.x * mag;
    let y = unit.y * mag;
    this.x = x;
    this.y = y;
  }

  get theta() {
    return Math.atan2(this.y, this.x);
  }

  static unit(x, y) {
    let mag = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    let x0 = x / mag;
    let y0 = y / mag;
    return new Vector2D(x0, y0);
  }

  static add(v1, v2) {
    return new Vector2D(v1.x + v2.x, v1.y + v2.y);
  }
}
export default Vector2D;