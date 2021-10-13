import {Spaceship, Bullet} from "./modules/models.js";
import {round, isInCanvas, loadSprite} from "./modules/utils.js";
import Vector2D from "./modules/vector.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let spaceshipObj = null;
let bulletObj = null;
let spaceship = null;
let bullets = [];
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
    loadSprite("./assets/sprites/bullet.png")
  ]).then(([spaceshipBlob, bulletBlob]) => {
    spaceshipObj = {w : 30, h : 30, url : URL.createObjectURL(spaceshipBlob)};
    bulletObj = {w : 5, h : 5, url : URL.createObjectURL(bulletBlob)};
    spaceship = new Spaceship(new Vector2D(0.5 * canvas.width, 0.5 * canvas.height),
                              spaceshipObj,
                              bullet => bullets.push(bullet));
    window.spaceship = spaceship;
    window.bulletObj = bulletObj;
    window.spaceshipObj = spaceshipObj;
    window.bullets = bullets;
    game();
  }).catch(err => {
    console.log(`Failed to load sprites: ${err.message}`);
  });
}

start();
