import {Spaceship, Bullet, Asteroid} from "./modules/models.js";
import {round} from "./modules/math.js";
import {isInCanvas, loadSprite,
        getRandomPosition, getRandomVelocity} from "./modules/utils.js";
import Vector2 from "./modules/vectors.js";
import {Circle, Triangle} from "./modules/shapes.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let spaceshipObj = null;
let bulletObj = null;
let asteroidObj = null;
let spaceship = null;
let bullets = [];
let asteroids = [];
const spaceshipPosition = document.querySelector("#spaceship-position");
const spaceshipVelocity = document.querySelector("#spaceship-velocity");
const spaceshipDirection = document.querySelector("#spaceship-direction");

const fps = 120;
const fpsInterval = 1000 / fps;
let lastFrameTime = null;
let currentFrameTime = null;

const keysPressed = {
  65 : false,  // left
  68 : false,  // right
  87 : false,  // forward
  32 : false,  // space
}
window.addEventListener('keydown', (e) => {
  keysPressed[e.keyCode] = true;
});
window.addEventListener('keyup', (e) => {
  keysPressed[e.keyCode] = false;
});

function game() {
  // Calculate time since last frame
  currentFrameTime = Date.now();
  let elapsed = currentFrameTime - lastFrameTime;

  // Process player input
  if (elapsed >= fpsInterval) {
    // Process key presses
    if (keysPressed[65]) {
      spaceship.rotate(false);
    }
    if (keysPressed[68]) {
      spaceship.rotate(true);
    }
    if (keysPressed[87]) {
      spaceship.accelerate()
    }
    if (keysPressed[32]) {
      spaceship.shoot(bulletObj);
    }

    // Update spaceship data display
    spaceshipPosition.innerText = `position: ${round(spaceship.position.x, 2)}, ${round(spaceship.position.y, 2)}`;
    spaceshipVelocity.innerText = `velocity:${round(spaceship.velocity.x, 2)}, ${round(spaceship.velocity.y, 2)}`;
    spaceshipDirection.innerText = `direction: ${round(spaceship.direction.x, 2)}, ${round(spaceship.direction.y, 2)}`;

    // Remove bullets that are out of frame
    bullets = bullets.filter(bullet => {
      return isInCanvas(bullet.position.x, bullet.position.y, canvas);
    });

    // Draw frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let bullet of bullets) {
      bullet.move(canvas);
      bullet.draw(canvas, ctx);
    }
    for (let asteroid of asteroids) {
      asteroid.move(canvas);
      asteroid.draw(canvas, ctx);
    }
    spaceship.move(canvas);
    spaceship.draw(canvas, ctx);

    // Update last frame time
    lastFrameTime = currentFrameTime;
  }

  // Request next frame
  requestAnimationFrame(game);
}

function start() {
  // Set timer to manage fps
  currentFrameTime = Date.now();
  lastFrameTime = currentFrameTime;

  // Load all sprites then launch game
  Promise.all([
    loadSprite("./assets/sprites/spaceship.png"),
    loadSprite("./assets/sprites/bullet.png"),
    loadSprite("./assets/sprites/asteroid.png")
  ]).then(([spaceshipBlob, bulletBlob, asteroidBlob]) => {

    // Create sprite objects
    spaceshipObj = {width : 30, height : 30,
                    hitbox : new Triangle(Math.sqrt(Math.pow(30, 2) + Math.pow(15, 2)), 30),
                    url : URL.createObjectURL(spaceshipBlob)};
    bulletObj = {width : 5, height : 5,
                 hitbox : new Circle(5),
                 url : URL.createObjectURL(bulletBlob)};
    asteroidObj = {width : 50, height : 50,
                   hitbox : new Circle(50),
                   url : URL.createObjectURL(asteroidBlob)};

    // Create spaceship
    spaceship = new Spaceship(new Vector2(0.5 * canvas.width, 0.5 * canvas.height),
                              spaceshipObj,
                              bullet => bullets.push(bullet));

    // Create asteroids...away from spaceship!
    for (let i = 0; i < 6; i++) {
      let asteroid_position, asteroid;
      do {
        asteroid_position = getRandomPosition(canvas);
      } while (Vector2.distance(asteroid_position, spaceship.position) < 100);
      asteroid = new Asteroid(asteroid_position,
                              asteroidObj,
                              roid => asteroids.push(roid));
      asteroids.push(asteroid);
    }

    game();

  }).catch(err => {
    console.log(`Failed to load sprites: ${err.message}`);
  });
}

start();
