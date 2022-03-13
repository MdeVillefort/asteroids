class Timer {

  #currentFrameTime;
  #lastFrameTime;

  constructor(fps) {
    this.fps = fps;
    this.#currentFrameTime = Date.now();
    this.#lastFrameTime = this.#currentFrameTime;
  }

  frameReady() {
    return this.timeSinceLastFrameMS > this.frameIntervalMS;
  }

  get frameIntervalMS() {
    return 1000 / this.fps;
  }

  get timeSinceLastFrameMS() {
    return this.#currentFrameTime - this.#lastFrameTime;
  }

  get currentFrameTime() {
    return this.#currentFrameTime;
  }

  set currentFrameTime(time) {
    this.#lastFrameTime = this.#currentFrameTime;
    this.#currentFrameTime = time;
  }

  get lastFrameTime() {
    return this.#lastFrameTime;
  }
}

export default Timer;