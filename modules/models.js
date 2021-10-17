import Vector2 from "./vectors.js";
import {rad2deg, deg2rad} from "./math.js";
import {wrapPosition, getRandomVelocity} from "./utils.js";
import {Circle, IsoTriangle} from "./shapes.js";

const UP = Vector2.unit(0, -1);

class GameObject {
  constructor(position, velocity, spriteObj) {
    this.position = position;
    this.velocity = velocity;
    this.sprite = new Image(spriteObj.width, spriteObj.height);
    this.sprite.src = spriteObj.url;
    this.hitbox = spriteObj.hitbox;
  }

  draw(canvas, ctx) {
    ctx.drawImage(
      this.sprite,
      this.position.x - 0.5 * this.sprite.width, this.position.y - 0.5 * this.sprite.height,
      this.sprite.width, this.sprite.height
    );
  }

  move(canvas) {
    this.position = Vector2.add(this.position, this.velocity);
    this.position = wrapPosition(this.position, canvas);
  }
}

class Spaceship extends GameObject {
  constructor(position, spriteObj, createBulletCallback) {
    super(position,
          new Vector2(0, 0),
          spriteObj);
    this.direction = UP;
    this.acceleration = 0.25;
    this.maneuverability = 3;
    this.bulletSpeed = 4;
    this.createBulletCallback = createBulletCallback;
  }

  accelerate() {
    this.velocity = Vector2.add(this.velocity, this.direction.scale(this.acceleration));
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
    let bullet_velocity = Vector2.add(this.velocity,
                                      this.direction.scale(this.bulletSpeed));
    let bullet_position = Vector2.add(this.position,
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

  collidesWithAsteroid(asteroid) {
    ;
  }
}

class Bullet extends GameObject {
  constructor(position, velocity, spriteObj) {
    super(position, velocity, spriteObj);
  }

  move(canvas) {
    this.position =  Vector2.add(this.position, this.velocity);
  }

  collidesWithAsteroid(asteroid) {
    let distance = Vector2.distance(this.position, asteroid.position);
    return distance < this.hitbox.radius + asteroid.hitbox.radius;
  }
}

class Asteroid extends GameObject {
  constructor(position, spriteObj, createAsteroidCallback, scale = 3) {
    let spriteSize = Asteroid.sizes[scale];
    [spriteObj.w, spriteObj.h] = [spriteSize, spriteSize];
    let velocity = getRandomVelocity(1, 5);
    super(position, velocity, spriteObj);
    this.scale = scale;
  }

  split(spriteObj) {
    if (this.size > 1) {
      for (let i = 0; i < 2; i++) {
        let asteroid = new Asteroid(this.position, spriteObj,
                                    this.createAsteroidCallback, this.scale);
        this.createAsteroidCallback(asteroid);
      }
    }
  }

  static sizes = {
    1 : 25,
    2 : 50,
    3 : 75
  }
}

export {Spaceship, Bullet, Asteroid};