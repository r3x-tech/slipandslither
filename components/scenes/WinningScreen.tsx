import { useGameOverModalStore } from "../../stores/useGameOverModalStore";
import { saveHighScore } from "../../utils/supabase";
import { useLoadingStore } from "../../stores/useLoadingStore";
import { useScoreStore } from "../../stores/useScoreStore";
import userStore from "@/stores/userStore";

class WinningScene extends Phaser.Scene {
  constructor() {
    super({ key: "WinningScene" });
  }

  preload() {
    // Loading the image for the button
    this.load.image("youwon", "../assets/youwon.png");
    this.load.image("playagain", "../assets/playagain.svg");
    this.load.image("savegame", "../assets/savegame.svg");
  }

  create() {
    this.add.sprite(400, 200, "youwon");

    const restartButton = this.add.sprite(400, 300, "playagain");
    restartButton.setInteractive();

    // Change cursor to pointer when hovering over the restartButton
    restartButton.on("pointerover", () => {
      this.game.canvas.style.cursor = "pointer";
    });

    // Change cursor back to default when pointer leaves the restartButton
    restartButton.on("pointerout", () => {
      this.game.canvas.style.cursor = "default";
    });

    restartButton.on("pointerdown", () => {
      this.scene.start("MainScene");
    });

    if (userStore.getState().solana_wallet_address.trim() !== "") {
      console.log();
      const saveGameButton = this.add.sprite(400, 380, "savegame");
      saveGameButton.setInteractive();

      // Change cursor to pointer when hovering over the saveGameButton
      saveGameButton.on("pointerover", () => {
        this.game.canvas.style.cursor = "pointer";
      });

      // Change cursor back to default when pointer leaves the saveGameButton
      saveGameButton.on("pointerout", () => {
        this.game.canvas.style.cursor = "default";
      });

      saveGameButton.on("pointerdown", () => {
        const currentScore = useScoreStore.getState().score;
        useLoadingStore.getState().setLoadingStatus(true);
        saveHighScore(currentScore).then(() => {
          console.log("saved score");
        });
      });
    } else {
      useGameOverModalStore.getState().setShowGameOverModal(true);
    }
  }
}

export default WinningScene;
