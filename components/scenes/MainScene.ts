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
      this.direction.x = dx > 0 ? 1 : -1;
      this.direction.y = 0;
    } else {
      this.direction.x = 0;
      this.direction.y = dy > 0 ? 1 : -1;
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
  }

  preload() {
    this.load.image("apple", "../assets/apple.png");
    this.load.image("bomb", "../assets/bomb.png");
    this.load.image("body", "../assets/snakebody.png");
  }

  create() {
    this.physics.world.createDebugGraphic();

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

    this.pauseButton = this.add.image(180, 10, "pause");
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
  }

  update() {
    if (this.cursors.left.isDown || this.direction.x === -1) {
      this.moveSnake(-10, 0);
      this.direction.set(0);
    } else if (this.cursors.right.isDown || this.direction.x === 1) {
      this.moveSnake(10, 0);
      this.direction.set(0);
    } else if (this.cursors.up.isDown || this.direction.y === -1) {
      this.moveSnake(0, -10);
      this.direction.set(0);
    } else if (this.cursors.down.isDown || this.direction.y === 1) {
      this.moveSnake(0, 10);
      this.direction.set(0);
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

  moveSnake(x: number, y: number) {
    let oldHead = this.snake.getChildren()[0] as Phaser.Physics.Arcade.Sprite;
    let newHead = this.physics.add
      .sprite(oldHead.x + x, oldHead.y + y, "body")
      .setOrigin(0);

    if (this.checkCollision(newHead)) {
      this.endGame();
      return;
    }

    this.snake.add(newHead);
    oldHead.destroy();

    if (newHead.x === this.apple.x && newHead.y === this.apple.y) {
      this.eatApple(newHead, this.apple);
    } else if (newHead.x === this.bomb.x && newHead.y === this.bomb.y) {
      this.hitBomb(newHead, this.bomb);
    }
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
    this.physics.pause();
    this.snake
      .getChildren()
      .forEach((part) => (part as Phaser.GameObjects.Sprite).setVisible(false));
    this.add.text(100, 150, "Game Over", { fontSize: "32px", color: "#FFF" });
    if (this.input.keyboard) {
      this.input.keyboard.shutdown();
    }
  }
}
