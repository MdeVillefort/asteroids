import Vector2D from "./vector.js";
import {rad2deg, deg2rad, wrapPosition, loadSprite} from "./utils.js";

const UP = Vector2D.unit(0, -1);

class GameObject {
  constructor(canvas, ctx, position, spriteObj, velocity) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.position = position;
    this.velocity = velocity;
    loadSprite(spriteObj.w, spriteObj.h, spriteObj.url)
    .then((sprite) => {
      this.sprite = sprite;
    });
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

  move() {
    this.position = Vector2D.add(this.position, this.velocity);
    this.position = wrapPosition(this.position, this.canvas);
  }
}

class Spaceship extends GameObject {
  constructor(canvas, ctx, position) {
    super(canvas, ctx,
          position,
          {w : 30, h : 33, url : "./spaceship.png"},
          new Vector2D(0, 0));
    this.direction = UP;
    this.acceleration = 0.25;
    this.maneuverability = 3;
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
}

class Bullet extends GameObject {
  constuctor() {
    ;
  }
}

export {Spaceship, Bullet};