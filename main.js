import {Spaceship, Bullet} from "./models.js";
import {round} from "./utils.js";
import Vector2D from "./vector.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let spaceship = null;
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

  if (elapsed >= fpsInterval && spaceship.sprite) {
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

    // Update spaceship data display
    spaceshipPosition.innerText = `position: ${round(spaceship.position.x, 2)}, ${round(spaceship.position.y, 2)}`;
    spaceshipVelocity.innerText = `velocity:${round(spaceship.velocity.x, 2)}, ${round(spaceship.velocity.y, 2)}`;
    spaceshipDirection.innerText = `direction: ${round(spaceship.direction.x, 2)}, ${round(spaceship.direction.y, 2)}`;

    // Draw frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    spaceship.move();
    spaceship.draw();

    // Update last frame time
    lastFrameTime = currentFrameTime;
  }

  // Request next frame
  requestAnimationFrame(game);
}

function start() {
  spaceship = new Spaceship(canvas, ctx,
                            new Vector2D(0.5 * canvas.width, 0.5 * canvas.height));
  currentFrameTime = Date.now();
  lastFrameTime = currentFrameTime;
  game();
}

start();

window.spaceship = spaceship;
