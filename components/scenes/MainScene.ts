import Phaser from "phaser";

export default class MainScene extends Phaser.Scene {
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
  private calculateSwipeDirection() {
    const dx = this.touchEnd.x - this.touchStart.x;
    const dy = this.touchEnd.y - this.touchStart.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (absDx > absDy) {
      this.direction.x = dx > 0 ? 0.1 : -0.1;
      this.direction.y = 0;
    } else {
      this.direction.x = 0;
      this.direction.y = dy > 0 ? 0.1 : -0.1;
    }
  }

  constructor() {
    super("MainScene");
    this.touchStart = new Phaser.Math.Vector2();
    this.touchEnd = new Phaser.Math.Vector2();
    this.direction = new Phaser.Math.Vector2();
  }

  init() {
    this.snake = this.add.group();
    this.score = 0;
    this.gameOver = false;
    this.paused = false;
  }

  preload() {
    this.load.image("apple", "../assets/apple.png");
    this.load.image("bomb", "../assets/bomb.png");
    this.load.image("body", "../assets/snakebody.png");
  }

  create() {
    this.cameras.main.setBackgroundColor("#000000"); // Set the camera background to black

    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    }
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      this.touchStart.set(pointer.x, pointer.y);
    });

    this.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
      this.touchEnd.set(pointer.x, pointer.y);
      this.calculateSwipeDirection();
    });

    this.createSnake();
    this.createApple();
    this.createBomb();
    this.scoreText = this.add.text(16, 16, "SCORE: 0", {
      fontSize: "16px",
      color: "#fff",
      fontStyle: "400",
      fontFamily: "Montserrat",
    });

    this.pauseButton = this.add.image(30, 16, "PAUSE");
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
    // Choose a random start direction
    const directions = [
      { x: 0, y: -0.1 }, // Up
      { x: 0, y: 0.1 }, // Down
      { x: -0.1, y: 0 }, // Left
      { x: 0.1, y: 0 }, // Right
    ];
    const startDirection =
      directions[Math.floor(Math.random() * directions.length)];
    this.direction.x = startDirection.x;
    this.direction.y = startDirection.y;

    // Continuously move the snake
    this.time.addEvent({
      delay: 20,
      callback: this.moveSnake,
      args: [this.direction.x, this.direction.y],
      callbackScope: this,
      loop: true,
    });
  }

  update() {
    if (this.cursors.left.isDown && this.direction.x === 0) {
      this.direction.x = -0.1;
      this.direction.y = 0;
    } else if (this.cursors.right.isDown && this.direction.x === 0) {
      this.direction.x = 0.1;
      this.direction.y = 0;
    } else if (this.cursors.up.isDown && this.direction.y === 0) {
      this.direction.x = 0;
      this.direction.y = -0.1;
    } else if (this.cursors.down.isDown && this.direction.y === 0) {
      this.direction.x = 0;
      this.direction.y = 0.1;
    }
  }

  togglePause() {
    if (this.gameOver) return;

    this.paused = !this.paused;

    if (this.paused) {
      this.physics.pause();
      // this.pausedText.setVisible(true);
      this.pauseButton.setTexture("play");
    } else {
      this.physics.resume();
      // this.pausedText.setVisible(false);
      this.pauseButton.setTexture("pause");
    }
  }

  createSnake() {
    const head = this.physics.add.sprite(160, 160, "body").setOrigin(0);
    head.setDisplaySize(15, 15); // Scales the sprite visually to 15x15
    // Adjust the physics body to match the new display size.
    // The setSize parameters are the new width and height for the body.
    // The final two parameters (offsetX and offsetY) adjust the body's position relative to the sprite's anchor.
    head.body.setSize(15, 15, false);
    this.snake.add(head);
  }

  createApple() {
    this.apple = this.physics.add
      .sprite(
        Phaser.Math.Between(10, 300),
        Phaser.Math.Between(10, 300),
        "apple"
      )
      .setOrigin(0);

    this.apple.setDisplaySize(15, 15); // Set display size
    // Optionally adjust the physics body size if necessary
    this.apple.body!.setSize(15, 15);
  }

  createBomb() {
    this.bomb = this.physics.add
      .sprite(
        Phaser.Math.Between(10, 300),
        Phaser.Math.Between(10, 300),
        "bomb"
      )
      .setOrigin(0);
    this.bomb.setDisplaySize(15, 15); // Set display size
    // Optionally adjust the physics body size if necessary
    this.bomb.body!.setSize(15, 15);
  }

  moveSnake() {
    let oldHead = this.snake.getChildren()[0] as Phaser.Physics.Arcade.Sprite;
    let newX = oldHead.x + this.direction.x * 15; // Assuming each segment is 15x15 pixels
    let newY = oldHead.y + this.direction.y * 15;

    // Ensure the game config dimensions are treated as numbers
    let gameWidth = Number(this.sys.game.config.width);
    let gameHeight = Number(this.sys.game.config.height);

    // Check collision with world bounds using the coerced number types
    if (newX < 0 || newX >= gameWidth || newY < 0 || newY >= gameHeight) {
      this.endGame();
      return;
    }

    // Check collision with the snake's own body
    let hitBody = this.snake.getChildren().some((segment, index) => {
      if (index === 0) return false; // Skip the head
      let s = segment as Phaser.Physics.Arcade.Sprite; // Type assertion
      return s.x === newX && s.y === newY;
    });

    if (hitBody) {
      this.endGame();
      return;
    }

    // Prepare new positions for all segments
    let newPositions = this.snake.getChildren().map((segment) => {
      return {
        x: (segment as Phaser.Physics.Arcade.Sprite).x,
        y: (segment as Phaser.Physics.Arcade.Sprite).y,
      };
    });

    // Shift positions for all segments to the next one in the array
    for (let i = this.snake.getChildren().length - 1; i > 0; i--) {
      (this.snake.getChildren()[i] as Phaser.Physics.Arcade.Sprite).setPosition(
        newPositions[i - 1].x,
        newPositions[i - 1].y
      );
    }

    // Move the head to the new position
    oldHead.setPosition(newX, newY);

    // Handle apple collision here if needed
    // Handle bomb collision here if needed
  }

  checkCollision(newHead: Phaser.GameObjects.Sprite) {
    return (
      newHead.x < 0 ||
      newHead.x >= 400 ||
      newHead.y < 0 ||
      newHead.y >= 300 ||
      Phaser.Actions.GetFirst(
        this.snake.getChildren(),
        { x: newHead.x, y: newHead.y },
        1
      )
    );
  }
  eatApple(
    player: Phaser.Physics.Arcade.Sprite,
    apple: Phaser.Physics.Arcade.Sprite
  ) {
    this.score += 1;
    this.scoreText.setText("Score: " + this.score);
    this.apple.destroy();
    this.createApple();

    let tail = this.snake.getChildren()[
      this.snake.getChildren().length - 1
    ] as Phaser.Physics.Arcade.Sprite;

    let newSegment = this.physics.add
      .sprite(tail.x, tail.y, "body")
      .setOrigin(0);
    newSegment.setDisplaySize(15, 15);
    newSegment.body.setSize(15, 15, false);

    this.snake.add(newSegment);
  }

  hitBomb(
    player: Phaser.Physics.Arcade.Sprite,
    bomb: Phaser.Physics.Arcade.Sprite
  ) {
    this.endGame();
  }

  endGame() {
    this.gameOver = true;
    this.physics.pause();
    this.snake
      .getChildren()
      .forEach((part) => (part as Phaser.GameObjects.Sprite).setVisible(false));
    if (this.input.keyboard) {
      this.input.keyboard.shutdown();
    }
    this.scene.start("GameOverScene", { score: this.score });
  }
}
