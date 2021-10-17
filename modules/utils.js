import Vector2 from "./vectors.js";
import {randrange} from "./math.js";

function wrapPosition(position, canvas) {
  let x = position.x % canvas.width;
  let y = position.y % canvas.height;
  x = x >= 0 ? x : x + canvas.width;
  y = y >= 0 ? y : y + canvas.height;
  return new Vector2(x, y);
}

function getRandomPosition(canvas) {
  return new Vector2(Math.random() * canvas.width,
                     Math.random() * canvas.height);
}

function getRandomVelocity(min, max) {
  let speed = randrange(min, max);
  let angle = randrange(0, 360);
  let velocity =  new Vector2(1, 0);
  velocity.rotate(angle);
  velocity.magnitude = speed;
  return velocity;
}

function isInCanvas(x, y, canvas) {
  return ((x >= 0 && x <= canvas.width) &&
          (y >= 0 && y <= canvas.height));
}

function loadSprite(path) {
  return fetch(path).then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      return response.blob();
    }
  }).catch(err => {
    console.log(`There has been a problem loading ${path}: ${err.message}`);
  });
}

function loadSpriteOld(w, h, path) {
  return new Promise((resolve, reject) => {
    let sprite = new Image(w, h);
    sprite.src = path;
    sprite.addEventListener('load', e => {
      resolve(sprite);
    });
  });
}

export {wrapPosition, getRandomPosition,
        getRandomVelocity, isInCanvas, loadSprite};