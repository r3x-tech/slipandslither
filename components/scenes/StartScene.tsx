class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: "StartScene" });
  }

  preload() {
    this.load.image("background", "../assets/home2.png");
  }

  create() {
    const bg = this.add.image(0, 0, "background").setOrigin(0, 0);
    bg.displayWidth = this.sys.canvas.width;
    bg.displayHeight = this.sys.canvas.height;

    this.game.canvas.style.cursor = "pointer";

    this.input.on("pointerdown", () => {
      this.scene.start("MainScene");
    });
  }

  shutdown() {
    this.game.canvas.style.cursor = "default";
  }
}

export default StartScene;
