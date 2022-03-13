import Game from './modules/game.js';

const canvas = document.querySelector("canvas");
const spaceshipPosition = document.querySelector("#spaceship-position");
const spaceshipVelocity = document.querySelector("#spaceship-velocity");
const spaceshipDirection = document.querySelector("#spaceship-direction");
const numberOfAsteroids = document.querySelector("#number-asteroids");


const game = new Game(canvas);
window.game = game;

setTimeout(() => {
  game.start();
}, 3000);
