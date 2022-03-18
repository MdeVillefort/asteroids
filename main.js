import Game from './modules/game.js';

const canvas = document.querySelector("#game-canvas");
const game = new Game(canvas);
window.game = game;
