import Vector2 from "./vectors.js";
import {wrapPosition, getRandomDirectionalVelocity} from "./utils.js";
import {Circle, IsoTriangle} from "./shapes.js";

const UP = Vector2.unit(0, -1);

class GameObject {

  constructor(position, velocity, spriteObj) {
    this.position = position;
    this.velocity = velocity;
    this.spriteObj = spriteObj;
    this.sprite = new Image(spriteObj.width, spriteObj.height);
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
    this.position = Vector2.add(this.position, this.velocity);
    this.position = wrapPosition(this.position, canvas);
  }
}

class Spaceship extends GameObject {

  constructor(position, spriteObj, createBulletCallback) {
    super(position,
          new Vector2(0, 0),
          spriteObj);
    this.direction = Vector2.unit(0, -1);
    this.acceleration = 0.25;
    this.maneuverability = 3;
    this.bulletSpeed = 8;
    this.createBulletCallback = createBulletCallback;
    this.isReloading = false;
    // this.hitbox = new IsoTriangle(33.5, 30);
    this.hitbox = new Circle(15);
  }

  accelerate() {
    this.velocity = Vector2.add(this.velocity, this.direction.scale(this.acceleration));
    // Set max speed
    if (this.velocity.magnitude >= 15) {
      this.velocity.magnitude = 15;
    }
  }

  rotate(clockwise = true) {
    const sign = clockwise ? 1 : -1;
    const angle = this.maneuverability * sign;
    this.direction.rotate_ip(angle);
  }

  shoot(spriteObj) {
    if (!this.isReloading) {
      const bullet_velocity = Vector2.add(this.velocity,
                                          this.direction.scale(this.bulletSpeed));
      const bullet_position = Vector2.add(this.position,
                                          this.direction.scale(0.5 * this.sprite.height));
      const bullet = new Bullet(bullet_position, bullet_velocity, spriteObj);
      this.createBulletCallback(bullet);

      this.isReloading = !this.isReloading;
      setTimeout(() => {
        this.isReloading = !this.isReloading;
      }, 200);
    }
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

  drawVertices(canvas, ctx) {
    /*
    A method to test the location of the computed vertices.
    */

    const prevFont = ctx.font;
    const prevAlign = ctx.textAlign;
    ctx.font = "10px Arial";
    ctx.textAlign = "center";
    const vertices = this.vertices;
    console.log(vertices);
    let counter = 1;
    for (let vertex of vertices) {
      ctx.fillText(`V${counter}`, vertex.x, vertex.y);
      counter++;
    }
    ctx.font = prevFont;
    ctx.textAlign = prevAlign;
  }

  collidesWithAsteroidCircle(asteroid) {
    /*
    Circle/Circle collision detection.
    Spaceship hitbox is a circle.
    */

    const distance = Vector2.distance(this.position, asteroid.position);
    return distance < this.hitbox.radius + asteroid.hitbox.radius;
  }

  collidesWithAsteroid(asteroid) {
    /*
    NOTE: Incomplete!
    Circle/Triangle collision detection algorithm:
      Case 1: Vertex within radius of circle
        1. Calculate vertices of spaceship triangle
        2. Check if their distance to circle center is < radius
      Case 2: Circle center within triangle
        1.
      Case 3: Circle intersects triangle edge
        1.

    Resources:
      1. http://www.phatcode.net/articles.php?id=459
      2. http://jeffreythompson.org/collision-detection/
    */

    const vertices = this.vertices;
    for (let vertex of vertices) {
      if (Vector2.distance(vertex, asteroid.position) < asteroid.hitbox.radius) {
        return true;
      }
    }
    return false;
  }

  get vertices() {
    /*
    FIXME.
    */

    const rBaseVector = this.direction.rotate(90).scale(0.5);
    console.log(rBaseVector);
    const v1 = Vector2.add(this.position,
                           this.direction.scale(0.5 * this.hitbox.height));
    const v2 = Vector2.add(this.position,
                           this.direction.scale(-0.5 * this.hitbox.height),
                           rBaseVector);
    const v3 = Vector2.add(this.position,
                           this.direction.scale(-0.5 * this.hitbox.height),
                           rBaseVector.scale(-1));
    return [v1, v2, v3];
  }
}

class Bullet extends GameObject {

  constructor(position, velocity, spriteObj) {
    super(position, velocity, spriteObj);
    this.hitbox = new Circle(2.5);
  }

  move(canvas) {
    this.position =  Vector2.add(this.position, this.velocity);
  }
}

class Asteroid extends GameObject {

  constructor(position, velocity, spriteObj, createAsteroidCallback, size = 3) {
    const spriteScale = Asteroid.sizes_to_scale[size];
    const scaledWidth = spriteScale * spriteObj.width;
    const scaledHeight = spriteScale * spriteObj.height;
    super(position, velocity, {width : scaledWidth, height : scaledHeight, url : spriteObj.url});
    this.size = size;
    this.hitbox = new Circle(0.5 * scaledWidth);
    this.createAsteroidCallback = createAsteroidCallback;
  }

  split(by) {
    if (this.size > 1) {
      const direction = by.velocity;
      for (let i = 0; i < 2; i++) {
        const velocity = getRandomDirectionalVelocity(1, 5, direction);
        const asteroid = new Asteroid(this.position, velocity, this.spriteObj,
                                      this.createAsteroidCallback, this.size - 1);
        this.createAsteroidCallback(asteroid);
      }
    }
  }

  collidesWithBullet(bullet) {
    const distance = Vector2.distance(this.position, bullet.position);
    return distance < this.hitbox.radius + bullet.hitbox.radius;
  }

  static sizes_to_scale = {
    1 : 0.50,
    2 : 0.75,
    3 : 1.00
  }
}

export {Spaceship, Bullet, Asteroid};