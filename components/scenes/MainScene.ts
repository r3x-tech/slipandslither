import Phaser from "phaser";

export default class MainScene extends Phaser.Scene {
  private appleImage: string;
  private bombImage: string;
  // private snakeBodyImage: string;
  private snake!: Phaser.GameObjects.Group;
  private apple!: Phaser.Physics.Arcade.Sprite;
  private bomb!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private score: number = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private touchStart: Phaser.Math.Vector2;
  private touchEnd: Phaser.Math.Vector2;
  private direction: Phaser.Math.Vector2;
  private gameOver: boolean = false;
  private paused: boolean = false;
  private pauseButton!: Phaser.GameObjects.Image;
  private isMobile!: boolean;
  private snakeMoveEvent!: Phaser.Time.TimerEvent;
  private appleEaten: boolean = false;

  constructor(appleImage: string, bombImage: string, snakeBodyImage: string) {
    super("MainScene");
    this.appleImage = appleImage;
    this.bombImage = bombImage;
    // this.snakeBodyImage = snakeBodyImage;
    this.touchStart = new Phaser.Math.Vector2();
    this.touchEnd = new Phaser.Math.Vector2();
    this.direction = new Phaser.Math.Vector2();
    this.score = 0;
  }

  // private calculateSwipeDirection() {
  //   const dx = this.touchEnd.x - this.touchStart.x;
  //   const dy = this.touchEnd.y - this.touchStart.y;
  //   const absDx = Math.abs(dx);
  //   const absDy = Math.abs(dy);

  //   if (absDx > absDy) {
  //     this.direction.x = dx > 0 ? 1 : -1;
  //     this.direction.y = 0;
  //   } else {
  //     this.direction.x = 0;
  //     this.direction.y = dy > 0 ? 1 : -1;
  //   }
  // }

  resetValues() {
    this.snake = this.add.group();
    this.score = 0;
    this.gameOver = false;
    this.paused = false;
  }

  preload() {
    this.load.image("apple", this.appleImage);
    this.load.image("bomb", this.bombImage);
    // this.load.image("body", this.snakeBodyImage);
    // this.load.image("apple", "../assets/apple.png");
    // this.load.image("bomb", "../assets/bomb.png");
    this.load.image("body", "../assets/snakebody.png");
    this.load.image("pause", "../assets/pause.svg");
    this.load.image("play", "../assets/play.svg");
  }

  create() {
    this.resetValues();

    this.cameras.main.setBackgroundColor("#000000");

    this.cursors = this.input.keyboard!.createCursorKeys();

    // this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
    //   this.touchStart.set(pointer.x, pointer.y);
    // });

    // this.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
    //   this.touchEnd.set(pointer.x, pointer.y);
    //   this.calculateSwipeDirection();
    // });

    this.createSnake();
    this.createApple();
    this.createBomb();
    this.scoreText = this.add.text(16, 16, "SCORE: 0", {
      fontSize: "16px",
      color: "#fff",
      fontStyle: "400",
      fontFamily: "Montserrat",
    });

    this.pauseButton = this.add.image(320, 16, "pause");
    this.pauseButton.setScale(0.05);
    this.pauseButton.setDepth(1);
    this.pauseButton.setOrigin(0, 0);

    this.pauseButton.setInteractive();
    this.pauseButton.on("pointerdown", this.togglePause, this);

    this.physics.add.collider(
      this.snake.getChildren()[0],
      this.apple,
      (player, apple) => {
        if (
          player instanceof Phaser.Physics.Arcade.Sprite &&
          apple instanceof Phaser.Physics.Arcade.Sprite
        ) {
          this.eatApple(player, apple);
        }
      }
    );

    this.physics.add.collider(
      this.snake.getChildren()[0],
      this.bomb,
      (player, bomb) => {
        if (
          player instanceof Phaser.Physics.Arcade.Sprite &&
          bomb instanceof Phaser.Physics.Arcade.Sprite
        ) {
          this.hitBomb(player, bomb);
        }
      }
    );

    const directions = [
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
    ];
    const startDirection =
      directions[Math.floor(Math.random() * directions.length)];
    this.direction.x = startDirection.x;
    this.direction.y = startDirection.y;

    this.snakeMoveEvent = this.time.addEvent({
      delay: 150,
      callback: this.moveSnake,
      args: [this.direction.x, this.direction.y],
      callbackScope: this,
      loop: true,
    });
    // this.physics.world.createDebugGraphic();

    // // Optionally, for more detailed debug graphics, you can adjust the debug body settings:
    // this.physics.world.drawDebug = true;
    // this.physics.world.debugGraphic.clear(); // Clear previous frames
  }

  private handleKeyboardControls() {
    if (this.cursors.left.isDown && this.direction.x === 0) {
      this.direction.x = -1;
      this.direction.y = 0;
    } else if (this.cursors.right.isDown && this.direction.x === 0) {
      this.direction.x = 1;
      this.direction.y = 0;
    } else if (this.cursors.up.isDown && this.direction.y === 0) {
      this.direction.x = 0;
      this.direction.y = -1;
    } else if (this.cursors.down.isDown && this.direction.y === 0) {
      this.direction.x = 0;
      this.direction.y = 1;
    }
  }

  update() {
    if (this.paused || this.gameOver) return;
    this.handleKeyboardControls();
  }

  togglePause() {
    if (this.gameOver) return;

    this.paused = !this.paused;

    if (this.paused) {
      this.physics.pause();
      this.pauseButton.setTexture("play");

      // Pause the timer event that moves the snake
      this.snakeMoveEvent.paused = true;
    } else {
      this.physics.resume();
      this.pauseButton.setTexture("pause");

      // Resume the timer event
      this.snakeMoveEvent.paused = false;
    }
  }

  createSnake() {
    const head = this.physics.add.sprite(160, 160, "body").setOrigin(0);
    head.setDisplaySize(15, 15);
    head.body.setSize(400, 400); // Adjust the physics body size
    this.snake.add(head);
  }

  createApple() {
    let newApplePosition: Phaser.Math.Vector2;
    let isPositionInvalid: boolean;
    do {
      const appleX = Phaser.Math.Between(
        20,
        Number(this.sys.game.config.width) - 20
      );
      const appleY = Phaser.Math.Between(
        60, // Assuming the pause button and score text are within 50 pixels from the top
        Number(this.sys.game.config.height) - 20
      );

      newApplePosition = new Phaser.Math.Vector2(appleX, appleY);

      // Check if the new position collides with any part of the snake
      isPositionInvalid =
        this.snake.getChildren().some((segment) => {
          const seg = segment as Phaser.Physics.Arcade.Sprite;
          return newApplePosition.x === seg.x && newApplePosition.y === seg.y;
        }) ||
        (this.bomb &&
          Math.abs(newApplePosition.x - this.bomb.x) < 20 &&
          Math.abs(newApplePosition.y - this.bomb.y) < 20); // Ensure apple is not overlapping with bomb
    } while (isPositionInvalid);

    if (this.apple) {
      this.apple.destroy();
    }

    this.apple = this.physics.add
      .sprite(newApplePosition.x, newApplePosition.y, "apple")
      .setOrigin(0);
    this.apple.setDisplaySize(20, 20);
    if (this.apple && this.apple.body) {
      this.apple.body.setSize(350, 350); // Adjust as necessary
    }
  }

  createBomb() {
    this.bomb = this.physics.add
      .sprite(
        Phaser.Math.Between(20, Number(this.sys.game.config.width) - 20),
        Phaser.Math.Between(60, Number(this.sys.game.config.height) - 20),
        "bomb"
      )
      .setOrigin(0);

    this.bomb.setDisplaySize(20, 20);
    if (this.bomb && this.bomb.body) {
      this.bomb.body.setSize(350, 350);
    }
  }

  moveSnake() {
    let oldHead = this.snake.getChildren()[0] as Phaser.Physics.Arcade.Sprite;
    let newX = oldHead.x + this.direction.x * 15;
    let newY = oldHead.y + this.direction.y * 15;

    let gameWidth = Number(this.sys.game.config.width);
    let gameHeight = Number(this.sys.game.config.height);

    if (newX < 0 || newX >= gameWidth || newY < 0 || newY >= gameHeight) {
      this.endGame();
      return;
    }

    let hitBody = this.snake.getChildren().some((segment, index) => {
      if (index === 0) return false;
      let s = segment as Phaser.Physics.Arcade.Sprite;
      return s.x === newX && s.y === newY;
    });

    if (hitBody) {
      this.endGame();
      return;
    }

    let newPositions = this.snake.getChildren().map((segment) => ({
      x: (segment as Phaser.Physics.Arcade.Sprite).x,
      y: (segment as Phaser.Physics.Arcade.Sprite).y,
    }));

    for (let i = this.snake.getChildren().length - 1; i > 0; i--) {
      (this.snake.getChildren()[i] as Phaser.Physics.Arcade.Sprite).setPosition(
        newPositions[i - 1].x,
        newPositions[i - 1].y
      );
    }

    oldHead.setPosition(newX, newY);
  }

  eatApple(
    player: Phaser.Physics.Arcade.Sprite,
    apple: Phaser.Physics.Arcade.Sprite
  ) {
    if (this.appleEaten) return; // Prevent multiple score increases for a single apple

    this.appleEaten = true; // Set the flag to true to indicate the apple is being processed
    this.time.delayedCall(100, () => {
      this.appleEaten = false;
    }); // Reset the flag after a short delay

    this.score += 1;
    this.scoreText.setText("SCORE: " + this.score);

    // Find a new position for the apple that is not occupied by the snake
    let newApplePosition: Phaser.Math.Vector2;
    let isPositionOnSnake: boolean;
    do {
      const appleX = Phaser.Math.Between(
        20,
        Number(this.sys.game.config.width) - 20
      );
      const appleY = Phaser.Math.Between(
        20,
        Number(this.sys.game.config.height) - 20
      );
      newApplePosition = new Phaser.Math.Vector2(appleX, appleY);

      // Check if the new position collides with any part of the snake
      isPositionOnSnake = this.snake.getChildren().some((segment) => {
        const seg = segment as Phaser.Physics.Arcade.Sprite;
        return newApplePosition.x === seg.x && newApplePosition.y === seg.y;
      });
    } while (isPositionOnSnake);

    // Move the apple to the new position
    this.apple.setPosition(newApplePosition.x, newApplePosition.y);

    // Add a new segment to the snake
    this.addSnakeSegment();
  }

  hitBomb(
    player: Phaser.Physics.Arcade.Sprite,
    bomb: Phaser.Physics.Arcade.Sprite
  ) {
    this.endGame();
  }

  addSnakeSegment() {
    // Get the last segment of the snake to determine where to place the new segment
    const lastSegment = this.snake.getChildren()[
      this.snake.getChildren().length - 1
    ] as Phaser.Physics.Arcade.Sprite;

    // Calculate the position of the new segment based on the direction of movement
    let newSegmentX = lastSegment.x;
    let newSegmentY = lastSegment.y;

    // The offset should match the visual size of the segments, i.e., 15 pixels
    if (this.direction.x > 0) {
      // Moving right
      console.log("newSegmentX: ", newSegmentX);
      newSegmentX -= 350; // Place the new segment to the left of the last segment
      console.log("newSegmentX after: ", newSegmentX);
    } else if (this.direction.x < 0) {
      // Moving left
      console.log("newSegmentX: ", newSegmentX);

      newSegmentX += 350; // Place the new segment to the right of the last segment
      console.log("newSegmentX after: ", newSegmentX);
    } else if (this.direction.y > 0) {
      // Moving down
      console.log("newSegmentY: ", newSegmentY);

      newSegmentY -= 350; // Place the new segment above the last segment
      console.log("newSegmentY after: ", newSegmentY);
    } else if (this.direction.y < 0) {
      // Moving up
      console.log("newSegmentY: ", newSegmentY);

      newSegmentY += 350; // Place the new segment below the last segment
      console.log("newSegmentY after: ", newSegmentY);
    }

    // Create and add the new segment at the calculated position
    const newSegment = this.physics.add
      .sprite(newSegmentX, newSegmentY, "body")
      .setOrigin(0);

    console.log("newSegment: ", newSegment.getCenter);
    newSegment.setDisplaySize(15, 15);
    // Set the physics body size to match the display size or whatever size gives correct physics behavior
    newSegment.body.setSize(400, 400); // Adjust if necessary based on actual behavior
    this.snake.add(newSegment);
  }

  endGame() {
    this.gameOver = true;
    this.physics.pause();
    this.snake
      .getChildren()
      .forEach((part) => (part as Phaser.GameObjects.Sprite).setVisible(false));
    this.scene.start("GameOverScene", { score: this.score });
  }
}
