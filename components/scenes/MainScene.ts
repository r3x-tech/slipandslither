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
  private isMobile!: boolean;

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
    this.load.image("pause", "../assets/pause.svg");
    this.load.image("play", "../assets/play.svg");
  }

  create() {
    this.cameras.main.setBackgroundColor("#000000");

    this.isMobile =
      this.sys.game.device.os.android ||
      this.sys.game.device.os.iOS ||
      this.sys.game.device.os.iPad ||
      this.sys.game.device.os.iPhone;

    this.cursors = this.input.keyboard!.createCursorKeys();

    if (this.isMobile) {
      this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
        this.touchStart.set(pointer.x, pointer.y);
      });

      this.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
        this.touchEnd.set(pointer.x, pointer.y);
        this.calculateSwipeDirection();
      });
    }

    this.createSnake();
    this.createApple();
    this.createBomb();
    this.scoreText = this.add.text(16, 16, "SCORE: 0", {
      fontSize: "16px",
      color: "#fff",
      fontStyle: "400",
      fontFamily: "Montserrat",
    });

    this.pauseButton = this.add.image(160, 16, "pause");
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
      { x: 0, y: -0.1 },
      { x: 0, y: 0.1 },
      { x: -0.1, y: 0 },
      { x: 0.1, y: 0 },
    ];
    const startDirection =
      directions[Math.floor(Math.random() * directions.length)];
    this.direction.x = startDirection.x;
    this.direction.y = startDirection.y;

    this.time.addEvent({
      delay: 20,
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

  update() {
    if (!this.isMobile) {
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
  }

  togglePause() {
    if (this.gameOver) return;

    this.paused = !this.paused;

    if (this.paused) {
      this.physics.pause();
      this.pauseButton.setTexture("play");
    } else {
      this.physics.resume();
      this.pauseButton.setTexture("pause");
    }
  }

  createSnake() {
    const head = this.physics.add.sprite(160, 160, "body").setOrigin(0);
    head.setDisplaySize(15, 15);
    head.body.setSize(500, 500); // Adjust the physics body size
    this.snake.add(head);
  }

  createApple() {
    let newApplePosition: Phaser.Math.Vector2;
    let isPositionOnSnake: boolean;
    do {
      const appleX = Phaser.Math.Between(
        15,
        Number(this.sys.game.config.width) - 15
      );
      const appleY = Phaser.Math.Between(
        15,
        Number(this.sys.game.config.height) - 15
      );
      newApplePosition = new Phaser.Math.Vector2(appleX, appleY);

      isPositionOnSnake = this.snake.getChildren().some((segment) => {
        const seg = segment as Phaser.Physics.Arcade.Sprite;
        return newApplePosition.x === seg.x && newApplePosition.y === seg.y;
      });
    } while (isPositionOnSnake);

    if (this.apple) {
      this.apple.destroy();
    }

    this.apple = this.physics.add
      .sprite(newApplePosition.x, newApplePosition.y, "apple")
      .setOrigin(0);
    this.apple.setDisplaySize(15, 15);
    if (this.apple && this.apple.body) {
      this.apple.body.setSize(500, 500);
    }
  }

  createBomb() {
    this.bomb = this.physics.add
      .sprite(
        Phaser.Math.Between(15, 300),
        Phaser.Math.Between(15, 300),
        "bomb"
      )
      .setOrigin(0);
    this.bomb.setDisplaySize(15, 15);
    if (this.bomb && this.bomb.body) {
      this.bomb.body.setSize(500, 500);
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
    this.score += 1;
    this.scoreText.setText("SCORE: " + this.score);

    // Find a new position for the apple that is not occupied by the snake
    let newApplePosition: Phaser.Math.Vector2;
    let isPositionOnSnake: boolean;
    do {
      const appleX = Phaser.Math.Between(
        15,
        Number(this.sys.game.config.width) - 15
      );
      const appleY = Phaser.Math.Between(
        15,
        Number(this.sys.game.config.height) - 15
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
      newSegmentX -= 500; // Place the new segment to the left of the last segment
      console.log("newSegmentX after: ", newSegmentX);
    } else if (this.direction.x < 0) {
      // Moving left
      console.log("newSegmentX: ", newSegmentX);

      newSegmentX += 500; // Place the new segment to the right of the last segment
      console.log("newSegmentX after: ", newSegmentX);
    } else if (this.direction.y > 0) {
      // Moving down
      console.log("newSegmentY: ", newSegmentY);

      newSegmentY -= 500; // Place the new segment above the last segment
      console.log("newSegmentY after: ", newSegmentY);
    } else if (this.direction.y < 0) {
      // Moving up
      console.log("newSegmentY: ", newSegmentY);

      newSegmentY += 500; // Place the new segment below the last segment
      console.log("newSegmentY after: ", newSegmentY);
    }

    // Create and add the new segment at the calculated position
    const newSegment = this.physics.add
      .sprite(newSegmentX, newSegmentY, "body")
      .setOrigin(0);

    console.log("newSegment: ", newSegment.getCenter);
    newSegment.setDisplaySize(15, 15);
    // Set the physics body size to match the display size or whatever size gives correct physics behavior
    newSegment.body.setSize(500, 500); // Adjust if necessary based on actual behavior
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
