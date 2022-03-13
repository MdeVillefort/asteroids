import {Spaceship, Bullet, Asteroid} from "./models.js";
import Timer from "./timer.js"
import {round} from "./math.js";
import {isInCanvas, loadSprite,
        getRandomPosition, getRandomVelocity} from "./utils.js";
import Vector2 from "./vectors.js";

class Game {

  constructor(canvas) {

    // Initialize some stuff
    this.timer = new Timer(120);
    this.asteroids = [];
    this.bullets = [];
    this.gameState = {
      assetsLoaded : false,
      gameReady : false,
      gamePaused : true,
    }

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

    // Load the game assets
    this._loadAssets().then(assets => {
      this.assets = assets;
      this.gameState.assetsLoaded = true;
      this.gameState.gameReady = true;
    }).catch(err => {
      console.log("Failed to load game assets.");
      console.log(`ERROR: ${err.message}`)
    });
  }

  start() {

    // Only start when ready
    if (!this.gameState.gameReady) {
      console.log("Game not ready!");
      return;
    }

    // Set timer to manage fps
    this.timer.currentFrameTime = Date.now();

    // Set keyboard input event listeners
    window.addEventListener('keydown', this._handleKeyPress.bind(this));
    window.addEventListener('keyup', this._handleKeyPress.bind(this));

    // Create the spaceship
    this.spaceship = new Spaceship(new Vector2(0.5 * this.canvas.width, 0.5 * this.canvas.height),
                                   this.assets.spaceship,
                                   bullet => this.bullets.push(bullet));

    // Create asteroids...away from spaceship!
    for (let i = 0; i < 6; i++) {
      let asteroid_position, asteroid_velocity, asteroid;
      do {
        asteroid_position = getRandomPosition(canvas);
        asteroid_velocity = getRandomVelocity(1, 5);
      } while (Vector2.distance(asteroid_position, this.spaceship.position) < 100);
      asteroid = new Asteroid(asteroid_position, asteroid_velocity,
                              this.assets.asteroid,
                              roid => this.asteroids.push(roid));
      this.asteroids.push(asteroid);
    }

    // Call loop here?
    this.loop();
  }

  loop() {

    // Set current frame time
    this.timer.currentFrameTime = Date.now();

    // Process player input if ready for next frame
    if (this.timer.frameReady()) {

      this._handlePlayerInput();
      this._processGameLogic();
      this._updateFrame();

      // Update spaceship data display
      /*
      spaceshipPosition.innerText = `position: ${round(spaceship.position.x, 2)}, ${round(spaceship.position.y, 2)}`;
      spaceshipVelocity.innerText = `velocity:${round(spaceship.velocity.x, 2)}, ${round(spaceship.velocity.y, 2)}`;
      spaceshipDirection.innerText = `direction: ${round(spaceship.direction.x, 2)}, ${round(spaceship.direction.y, 2)}`;
      numberOfAsteroids.innerText = `asteroids remaining: ${asteroids.length}`;
      */
    }

    // Request next frame
    requestAnimationFrame(this.loop.bind(this));
  }

  _handleKeyPress(e) {
    /*
    Callback for keydown/keyup events.
    Changes Game object keyPressed state.
    */

    if (this.keysPressed.hasOwnProperty(e.code)) {
      e.preventDefault();
      if (e.type === "keydown")
        this.keysPressed[e.code] = true;
      else if (e.type === "keyup")
        this.keysPressed[e.code] = false;
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
      this.spaceship.move(this.canvas);
      this.spaceship.draw(this.canvas, this.ctx);
  }

  _handlePlayerInput() {
    /*
    Handle player input.  Move player object logic here.
    */

    if (this.keysPressed.KeyA) {
      this.spaceship.rotate(false);
    }
    if (this.keysPressed.KeyD) {
      this.spaceship.rotate(true);
    }
    if (this.keysPressed.KeyW) {
      this.spaceship.accelerate()
    }
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
        loadSprite("./assets/sprites/spaceship.png"),
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