import Vector2D from "./vector.js";
import {rad2deg, deg2rad, wrapPosition} from "./utils.js";

const UP = Vector2D.unit(0, -1);

class GameObject {
  constructor(position, velocity, spriteObj) {
    this.position = position;
    this.velocity = velocity;
    this.sprite = new Image(spriteObj.w, spriteObj.h);
    this.sprite.src = spriteObj.url;
  }

  draw(canvas, ctx) {
    ctx.drawImage(
      this.sprite,
      this.position.x - 0.5 * this.sprite.width, this.position.y - 0.5 * this.sprite.height,
      this.sprite.width, this.sprite.height
    );
  }

  move(canvas) {
    this.position = Vector2D.add(this.position, this.velocity);
    this.position = wrapPosition(this.position, canvas);
  }
}

class Spaceship extends GameObject {
  constructor(position, spriteObj, createBulletCallback) {
    super(position,
          new Vector2D(0, 0),
          spriteObj);
    this.direction = UP;
    this.acceleration = 0.25;
    this.maneuverability = 3;
    this.bulletSpeed = 4;
    this.createBulletCallback = createBulletCallback;
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

  shoot(spriteObj) {
    let bullet_velocity = Vector2D.add(this.velocity,
                                       this.direction.scale(this.bulletSpeed));
    let bullet_position = Vector2D.add(this.position,
                                       this.direction.scale(0.5 * this.sprite.height));
    let bullet = new Bullet(bullet_position, bullet_velocity, spriteObj);
    this.createBulletCallback(bullet);
  }

  draw(canvas, ctx) {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.direction.theta + Math.PI / 2);
    ctx.translate(-this.position.x, -this.position.y);
    ctx.drawImage(
      this.sprite,
      this.position.x - 0.5 * this.sprite.width, this.position.y - 0.5 * this.sprite.height,
      this.sprite.width, this.sprite.height
    );
    ctx.restore();
  }
}

class Bullet extends GameObject {
  constructor(position, velocity, spriteObj) {
    super(position, velocity, spriteObj);
  }

  move(canvas) {
    this.position =  Vector2D.add(this.position, this.velocity);
  }
}

class Asteroid extends GameObject {
  constructor() {
    ;
  }
}

export {Spaceship, Bullet};