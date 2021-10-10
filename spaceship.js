import Vector2D from "./vector.js";
import {rad2deg, deg2rad, wrapPosition} from "./utils.js";

const UP = Vector2D.UnitVector(0, -1);

class Spaceship {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.sprite = new Image(30, 33);
    this.sprite.src = "./spaceship.png";
    this.sprite.addEventListener('load', () => {
      this.draw();
    }, {once : true});
    this.direction = UP;
    this.position = new Vector2D(0.5 * this.canvas.width, 0.5 * this.canvas.height);
    this.velocity = new Vector2D(0, 0);
    this.acceleration = 0.25;
    this.maneuverability = 3;
  }

  move() {
    this.position = Vector2D.add(this.position, this.velocity);
    this.position = wrapPosition(this.position, this.canvas);
  }

  accelerate() {
    this.velocity = Vector2D.add(this.velocity, this.direction.scale(this.acceleration));
    // Set max speed
    if (this.velocity.magnitude >= 15) {
      this.velocity.magnitude = 15;
    }
  }

  rotate(clockwise = true) {
    let sign = clockwise ? 1 : -1;
    let angle = this.maneuverability * sign;
    this.direction.rotate(angle);
  }

  draw() {
    this.ctx.save();
    this.ctx.translate(this.position.x, this.position.y);
    this.ctx.rotate(this.direction.theta + Math.PI / 2);
    this.ctx.translate(-this.position.x, -this.position.y);
    this.ctx.drawImage(
      this.sprite,
      this.position.x - 0.5 * this.sprite.width, this.position.y - 0.5 * this.sprite.height,
      this.sprite.width, this.sprite.height
    );
    this.ctx.restore();
  }
}
export default Spaceship;