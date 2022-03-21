import {Spaceship, Bullet, Asteroid} from "./models.js";
import Timer from "./timer.js";
import GameDataDisplay from "./display.js";
import {round} from "./math.js";
import {isInCanvas, loadSprite,
        getRandomPosition, getRandomVelocity} from "./utils.js";
import Vector2 from "./vectors.js";

class Game {

  constructor(canvas) {

    // Initialize some stuff
    this.timer = new Timer(120);
    this.gameDataDisplay = new GameDataDisplay();
    this.spaceship = null;
    this.asteroids = [];
    this.bullets = [];
    this.gameState = {
      assetsLoaded : false,
      paused : false,
      screensaver : false,
    };

    // Set up the canvas
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    // Setup keyboard input
    this.keysPressed = {
      KeyW : false,
      KeyA : false,
      KeyD : false,
      Space : false,
      Escape : false,
    };
    this._boundHandleKeyPress = this._handleKeyPress.bind(this);

    // Load the game assets
    this._loadAssets().then(assets => {

      // Set game state
      this.assets = assets;
      this.gameState.assetsLoaded = true;
      this.gameState.screensaver = true;

      // Create the spaceship
      this.spaceship = new Spaceship(new Vector2(0.5 * this.canvas.width, 0.5 * this.canvas.height),
                                     this.assets.spaceship,
                                     bullet => this.bullets.push(bullet));
      
      // Start the default screen
      this.displayScreensaver();

    }).catch(err => {
      console.log("Failed to load game assets.");
      console.log(`ERROR: ${err}`);
    });
  }

  start() {

    // Only start when ready
    if (!this.gameState.assetsLoaded) {
      console.log("Game not ready!");
      return;
    }
    
    this._clearGameObjects();
    this.gameState.screensaver = false;

    // Set timer to manage fps
    this.timer.currentFrameTime = performance.now();

    // Set keyboard input event listeners
    window.addEventListener('keydown', this._boundHandleKeyPress);
    window.addEventListener('keyup', this._boundHandleKeyPress);

    // Create asteroids...away from spaceship!
    this._createAsteroids(6);

    // Call loop here?
    this.loop();
  }

  loop() {

    // Create local binding to `this`
    const that = this;

    function frame(timestamp) {
      /*
      Inner function to create closure with `this` bound to the Game
      object in the enclosing scope to be passed to requestAnimationFrame.
      */

      // Set current frame time
      that.timer.currentFrameTime = timestamp;

      // Only update game state when game is in progress and not paused
      if (that.gameState.screensaver) {

        that._updateFrame();

      } else if (!that.gameState.paused) {

        // Process player input if ready for next frame
        if (that.timer.frameReady()) {

          that._handlePlayerInput();
          that._processGameLogic();
          that._updateFrame();
          that._updateDisplay();

        }
      }

      // Request next frame
      requestAnimationFrame(frame);
    }

    // Request first frame
    requestAnimationFrame(frame);
  }

  displayScreensaver() {
    /*
    Creates assets to float around before the game is started.
    */

    // Clear existing game objects
    this._clearGameObjects();

    // Create asteroids.
    this._createAsteroids(6, 0);

    // Start game loop
    this.loop();
  }

  _clearGameObjects() {
    this.asteroids = [];
    this.bullets = [];
    this.spaceship = new Spaceship(new Vector2(0.5 * this.canvas.width, 0.5 * this.canvas.height),
                                   this.assets.spaceship,
                                   bullet => this.bullets.push(bullet));
  }

  _createAsteroids(number, threshold = 100) {
    /*
    Create `number` of asteroid objects with random positions and velocities.
    The variable `threshold` controls how close the initial position of each
    asteroid can be to the spaceship's position.
    */

    for (let i = 0; i < number; i++) {
      let asteroid_position, asteroid_velocity, asteroid;
      do {
        asteroid_position = getRandomPosition(this.canvas);
        asteroid_velocity = getRandomVelocity(1, 5);
      } while (Vector2.distance(asteroid_position, this.spaceship.position) < threshold);
      asteroid = new Asteroid(asteroid_position, asteroid_velocity,
                              this.assets.asteroid,
                              roid => this.asteroids.push(roid));
      this.asteroids.push(asteroid);
    }
  }

  _handleKeyPress(e) {
    /*
    Callback for keydown/keyup events.
    Changes Game object keyPressed state.
    */

    if (this.keysPressed.hasOwnProperty(e.code)) {
      e.preventDefault();
      if (e.type === "keydown") {
        this.keysPressed[e.code] = true;
        if (e.code === "Escape") this._togglePause();
      }
      else if (e.type === "keyup") {
        this.keysPressed[e.code] = false;
      }
    }
  }

  _togglePause() {
    /*
    Change game's paused state.
    TODO: Remove keyboard event listeners here?
    */

    this.gameState.paused = !this.gameState.paused;
  }

  _updateDisplay() {
    /*
    Update spaceship data display.
    */

    const spaceshipPosition = `position: ${round(this.spaceship.position.x, 2)}, ${round(this.spaceship.position.y, 2)}`;
    const spaceshipVelocity = `velocity: ${round(this.spaceship.velocity.x, 2)}, ${round(this.spaceship.velocity.y, 2)}`;
    const spaceshipDirection = `direction: ${round(this.spaceship.direction.x, 2)}, ${round(this.spaceship.direction.y, 2)}`;
    const numberOfAsteroids = `asteroids remaining: ${this.asteroids.length}`;
    const displayText = [spaceshipPosition, spaceshipVelocity, spaceshipDirection, numberOfAsteroids];

    let x = 5, y = 10;
    for (let text of displayText) {
      this.gameDataDisplay.draw(this.canvas, this.ctx, x, y, text);
      y += 10;
    }
  }

  _processGameLogic() {
    /*
    Collision logic here.
    */

    // Remove bullets that are out of frame
    this.bullets = this.bullets.filter(bullet => {
      return isInCanvas(bullet.position.x, bullet.position.y, this.canvas);
    });

    // Check collisions
    for (let bullet of this.bullets.slice()) {
      for (let asteroid of this.asteroids.slice()) {
        if (asteroid.collidesWithBullet(bullet)) {
          console.log('Collision detected');
          this.asteroids.splice(this.asteroids.indexOf(asteroid), 1);
          this.bullets.splice(this.bullets.indexOf(bullet), 1);
          asteroid.split(bullet);
        }
      }
    }
  }

  _updateFrame() {
    /*
    Update the positions of the sprites on the canvas.
    */

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let bullet of this.bullets) {
      bullet.move(this.canvas);
      bullet.draw(this.canvas, this.ctx);
    }
    for (let asteroid of this.asteroids) {
      asteroid.move(this.canvas);
      asteroid.draw(this.canvas, this.ctx);
    }

    if (!this.gameState.screensaver) {
      this.spaceship.move(this.canvas);
      this.spaceship.draw(this.canvas, this.ctx);
    }
  }

  _handlePlayerInput() {
    /*
    Handle player input.  Move player object logic here.
    */

    // Update player position
    if (this.keysPressed.KeyA) {
      this.spaceship.rotate(false);
    }
    if (this.keysPressed.KeyD) {
      this.spaceship.rotate(true);
    }
    if (this.keysPressed.KeyW) {
      this.spaceship.accelerate();
    }

    // Create bullets
    if (this.keysPressed.Space) {
      this.spaceship.shoot(this.assets.bullet);
    }
  }

  _loadAssets() {
    /*
    Load the game assets asynchronously.
    */

    // Load all sprites
    return Promise.all([
        loadSprite("./assets/sprites/spaceship-circular.png"),
        loadSprite("./assets/sprites/bullet.png"),
        loadSprite("./assets/sprites/asteroid.png")
    ]).then(([spaceshipBlob, bulletBlob, asteroidBlob]) => {

      // Create sprite objects
      const spaceshipObj = {width : 30, height : 30,
                            url : URL.createObjectURL(spaceshipBlob)};
      const bulletObj = {width : 5, height : 5,
                         url : URL.createObjectURL(bulletBlob)};
      const asteroidObj = {width : 75, height : 75,
                           url : URL.createObjectURL(asteroidBlob)};

      return {spaceship : spaceshipObj,
              bullet : bulletObj,
              asteroid : asteroidObj};
    });
  }
}

export default Game;