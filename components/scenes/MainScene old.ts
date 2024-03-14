import Phaser from "phaser";

export default class OldMainScene extends Phaser.Scene {
  private ballImage: string;
  private barrierImage: string;
  private ball!: Phaser.Physics.Arcade.Sprite;
  private score: number = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private scoreValueText!: Phaser.GameObjects.Text;
  private level: number = 1;
  private levelText!: Phaser.GameObjects.Text;
  private levelValueText!: Phaser.GameObjects.Text;
  private ballVelocityX: number = 150;
  private gameOver: boolean = false;
  private paused: boolean = false;
  private pauseButton!: Phaser.GameObjects.Image;
  // private leftBarriers: Phaser.Physics.Arcade.Sprite[] = [];
  // private rightBarriers: Phaser.Physics.Arcade.Sprite[] = [];
  private lastWallHit: "left" | "right" | null = null;
  private canIncrementScore: boolean = true;

  constructor(ballImage: string, barrierImage: string) {
    super({ key: "MainScene" });
    this.ballImage = ballImage;
    this.barrierImage = barrierImage;
    this.score = 0;
    this.level = 1;
  }

  resetValues() {
    this.score = 0;
    this.level = 1;
    this.gameOver = false;
    this.paused = false;
  }

  preload() {
    this.load.image("ball", this.ballImage);
    this.load.image("barrier", this.barrierImage);
    this.load.image("pause", "../assets/pause.svg");
    this.load.image("play", "../assets/play.svg");
  }

  create() {
    this.resetValues();

    this.cameras.main.setBackgroundColor("#000000");
    this.physics.world.setBounds(0, 5, 360, 360);
    this.physics.world.gravity.y = 500;

    // Add a red rectangle at the top (ceiling)
    let ceiling = this.add.rectangle(0, 0, 360, 5, 0xff1644).setOrigin(0, 0);
    ceiling.setDepth(1); // Ensure it's rendered above other objects

    // Add a red rectangle at the bottom (floor)
    let floor = this.add.rectangle(0, 355, 360, 5, 0xff1644).setOrigin(0, 0);
    floor.setDepth(1);

    this.ball = this.physics.add.sprite(175, 175, "ball").setCircle(15);
    this.ball.displayWidth = 12;
    this.ball.displayHeight = 12;
    this.ball.setSize(5, 5);
    this.ball.setBounce(0, 0);
    this.ball.setCollideWorldBounds(true, 1, 1, true);

    // Set initial horizontal velocity
    this.ball.setVelocityX(this.ballVelocityX);

    this.input.on("pointerdown", this.flap, this);
    this.scoreText = this.add.text(10, 15, "SCORE:", {
      fontSize: "16px",
      color: "#fff",
      fontStyle: "400",
      fontFamily: "Montserrat",
    });

    this.scoreValueText = this.add.text(80, 15, "0", {
      fontSize: "16px",
      color: "#fff",
      fontFamily: "Montserrat",
    });

    this.levelText = this.add.text(300, 15, "LVL:", {
      fontSize: "16px",
      color: "#fff",
      fontFamily: "Montserrat",
    });

    this.levelValueText = this.add.text(340, 15, "1", {
      fontSize: "16px",
      color: "#fff",
      fontFamily: "Montserrat",
    });
    this.setupLevel();

    this.physics.world.on("worldbounds", this.handleWorldBoundsCollision, this);

    this.pauseButton = this.add.image(180, 10, "pause");
    this.pauseButton.setScale(0.05);
    this.pauseButton.setDepth(1);
    this.pauseButton.setOrigin(0, 0);

    this.pauseButton.setInteractive();
    this.pauseButton.on("pointerdown", this.togglePause, this);

    // this.pausedText = this.add.text(100, 100, "PAUSED", {
    //   fontSize: "24px",
    //   color: "#fff",
    //   fontFamily: "Hitchcut",
    // });
    // this.pausedText.setVisible(false);
    // this.pausedText.setDepth(1);

    // Phaser.Display.Align.In.Center(
    //   this.pausedText,
    //   this.add.zone(180, 320, 360, 640)
    // );
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

  setupLevel() {
    const minY = 55;
    const maxY = 295;

    // Start adding barriers from level 2 onwards
    if (this.level >= 2) {
      // Determine the side for the barrier
      // Level 2 -> left, Level 3 -> right, and so on
      const isLeftSide = this.level % 2 === 0;
      const xPosition = isLeftSide ? 5 : 355;

      this.createBarrier(xPosition, Phaser.Math.Between(minY, maxY));
    }
  }

  createBarrier(x: number, y: number) {
    let barrier = this.physics.add.staticSprite(x, y, "barrier");
    barrier.setSize(10, 50);
    barrier.setDisplaySize(10, 50);
    barrier.setOrigin(0.5, 0.5);
    // Delayed call to enable collider
    this.time.delayedCall(500, () => {
      this.physics.add.collider(this.ball, barrier, () => {
        console.log(`Collision with barrier at (${x}, ${y}) detected`);
        this.endGame();
      });
    });
  }

  handleBarrierCollision(
    ball: Phaser.GameObjects.GameObject,
    barrier: Phaser.GameObjects.GameObject
  ) {
    // Handle collision between ball and barrier
    console.log("Collision with barrier detected");
    this.endGame();
  }

  handleWorldBoundsCollision(
    body: Phaser.Physics.Arcade.Body,
    up: boolean,
    down: boolean,
    left: boolean,
    right: boolean
  ) {
    // Increment score and change direction when hitting left or right walls
    if (!this.gameOver && (left || right)) {
      if (this.canIncrementScore) {
        this.score += 1;
        this.scoreValueText.setText(`${this.score}`);
        this.canIncrementScore = false; // Reset the flag after incrementing the score

        // Increase the level every three scores
        if (this.score % 3 === 0) {
          this.level++;
          this.levelValueText.setText(`${this.level}`);
          this.setupLevel();
        }
      }

      this.ballVelocityX *= -1;
      this.ball.setVelocityX(this.ballVelocityX);
    }

    console.log("World bounds collision: ", { up, down, left, right });

    // End the game only if the ball touches the top or bottom bounds
    if ((up || down) && !this.gameOver) {
      this.endGame();
    }
  }

  flap(pointer: Phaser.Input.Pointer) {
    if (this.ball.body) {
      // Move up
      this.ball.setVelocityY(-350);

      // Determine tap position relative to the ball
      const tapPosition = pointer.x;
      const ballPosition = this.ball.x;

      // Move to the right if tapped on the left of the ball, and to the left if tapped on the right of the ball
      if (tapPosition < ballPosition) {
        // Ensure positive velocity to move right
        this.ball.setVelocityX(Math.abs(this.ballVelocityX));
      } else {
        // Ensure negative velocity to move left
        this.ball.setVelocityX(-Math.abs(this.ballVelocityX));
      }
      this.canIncrementScore = true; // Allow score increment on next collision
    }
  }

  endGame() {
    this.gameOver = true;
    this.physics.pause();
    this.ball.setVelocity(0, 0);
    this.ball.setVisible(false);

    // Transition to Game Over Scene
    this.scene.start("GameOverScene", { score: this.score });
  }

  update() {
    if (this.gameOver) return;

    // Additional logic can be added here if needed
  }
}
