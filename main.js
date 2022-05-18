import Game from './modules/game.js';

const menu = {
  title : document.querySelector(".game-title"),
  play : document.querySelector("#play"),
  continue : document.querySelector("#continue"),
  controls : document.querySelector("#controls"),
  controlsImg : document.querySelector("#controls-img"),
  winMsg : document.querySelector("#win-msg"),
  lossMsg : document.querySelector("#loss-msg"),
  backToMenu : document.querySelector("#back-to-menu")
};

const canvas = document.querySelector("#game-canvas");
const game = new Game(canvas, menu);
window.game = game;
window.menu = menu;