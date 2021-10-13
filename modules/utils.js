import Vector2D from "./vector.js";

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function rad2deg(rad) {
  return rad * (180 / Math.PI);
}

function wrapPosition(position, canvas) {
  let x = position.x % canvas.width;
  let y = position.y % canvas.height;
  x = x >= 0 ? x : x + canvas.width;
  y = y >= 0 ? y : y + canvas.height;
  return new Vector2D(x, y);
}

function round(num, decimals) {
  let power = Math.pow(10, decimals);
  return Math.round(num * power) / power;
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
export {deg2rad, rad2deg, wrapPosition, round, isInCanvas, loadSprite};