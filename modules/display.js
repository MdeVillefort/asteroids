class GameDataDisplay {

  constructor() {
    this.font = "Arial";
    this.fontSize = "10px";
  }

  draw(canvas, ctx, x, y, text) {
    const prevFont = ctx.font;
    ctx.font = `${this.fontSize} ${this.font}`;
    ctx.fillText(text, x, y);
    ctx.font = prevFont;
  }
}

export default GameDataDisplay;