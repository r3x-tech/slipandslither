import { useScoreStore } from "../../stores/useScoreStore";
import { saveHighScore } from "../../utils/supabase";
import { useGameOverModalStore } from "../../stores/useGameOverModalStore";
import { useLoadingStore } from "../../stores/useLoadingStore";
import MainScene from "./MainScene";
import userStore from "@/stores/userStore";

class GameOverScene extends Phaser.Scene {
  private restartButton!: Phaser.GameObjects.Sprite;

  constructor() {
    super({ key: "GameOverScene" });
  }

  preload() {
    this.load.image("gameover", "../assets/gameover.svg");
    this.load.image("playagain", "../assets/playagain.svg");
    this.load.image("savegame", "../assets/savenewhighscore.svg");
    this.load.image("loginsavegame", "../assets/loginsavegame.svg");
    this.load.image("background2", "../assets/bg.svg");
  }

  create(data: any) {
    const bg = this.add.image(0, 0, "background2").setOrigin(0, 0);
    bg.displayWidth = this.sys.canvas.width;
    bg.displayHeight = this.sys.canvas.height;

    const width = this.sys.game.config.width as number;
    const height = this.sys.game.config.height as number;

    const gameoverSprite = this.add.sprite(width / 2, height / 3, "gameover");
    gameoverSprite.setScale(0.5, 0.5);

    this.restartButton = this.add.sprite(
      width / 2,
      3 * (height / 4),
      "playagain"
    );
    this.restartButton.setInteractive();
    // Change cursor to pointer when hovering over the restartButton
    this.restartButton.on("pointerover", () => {
      this.game.canvas.style.cursor = "pointer";
    });

    // Change cursor back to default when pointer leaves the restartButton
    this.restartButton.on("pointerout", () => {
      this.game.canvas.style.cursor = "default";
    });

    this.restartButton.on("pointerdown", () => {
      var mainScene = this.scene.get("MainScene");
      mainScene.scene.restart();
      this.scene.start("MainScene");
    });

    // Listen for the custom event from React component
    this.game.events.on(
      "toggleRestartButton",
      this.toggleRestartButtonInteractive,
      this
    );

    useScoreStore.getState().setScore(data.score);
    useGameOverModalStore.getState().setShowGameOverModal(true);

    // if (
    //   userStore.getState().solana_wallet_address ||
    //   userStore.getState().solana_wallet_address.trim() == ""
    // ) {

    // } else {
    //   useLoadingStore.getState().setLoadingStatus(true);
    //   console.log("else running");
    //   // saveHighScore(data.score).then(() => {
    //   //   console.log("saved score");
    //   //   useLoadingStore.getState().setLoadingStatus(true);

    //   // });
    // }
  }

  toggleRestartButtonInteractive(active: boolean) {
    if (active) {
      this.restartButton.setInteractive();
    } else {
      this.restartButton.disableInteractive();
    }
  }
}

export default GameOverScene;
