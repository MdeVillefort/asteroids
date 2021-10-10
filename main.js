import Spaceship from "./spaceship.js";
import {round} from "./utils.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const spaceship = new Spaceship(canvas, ctx);
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
  lastFrameTime = currentFrameTime;
  currentFrameTime = Date.now();
  let elapsed = currentFrameTime - lastFrameTime;

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

    // Update spaceship data display
    spaceshipPosition.innerText = `position: ${round(spaceship.position.x, 2)}, ${round(spaceship.position.y, 2)}`;
    spaceshipVelocity.innerText = `velocity:${round(spaceship.velocity.x, 2)}, ${round(spaceship.velocity.y, 2)}`;
    spaceshipDirection.innerText = `direction: ${round(spaceship.direction.x, 2)}, ${round(spaceship.direction.y, 2)}`;

    // Draw frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    spaceship.move();
    spaceship.draw();
  }

  // Request next frame
  requestAnimationFrame(game);
}

function start() {
  currentFrameTime = Date.now();
  game();
}

start();

window.spaceship = spaceship;
