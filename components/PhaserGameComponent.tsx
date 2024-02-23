import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import MainScene from "./scenes/MainScene";
import WebFont from "webfontloader";
import GameOverScene from "./scenes/GameOverScene";
import StartScene from "./scenes/StartScene";
import { useGameSettingsStore } from "@/stores/useGameSettingsStore";
import { useGameOverModalStore } from "@/stores/useGameOverModalStore";

const PhaserGameComponent = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const { appleImage, bombImage } = useGameSettingsStore();
  const [currentAppleImage, setCurrentAppleImage] =
    useState<string>(appleImage);
  const [currentBombImage, setCurrentBombImage] = useState<string>(bombImage);

  const { showGameOverModal } = useGameOverModalStore();

  function base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64.split(",")[1]);
    const byteArrays: Uint8Array[] = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mimeType });
  }

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Montserrat:100,200,300,400,500,600,700,800,900"],
      },
      active: () => {
        // const mainScene = new MainScene();

        const config: Phaser.Types.Core.GameConfig = {
          type: Phaser.AUTO,
          parent: "phaser-game",
          width: 360,
          height: 360,
          backgroundColor: "#ababab",
          physics: {
            default: "arcade",
            arcade: {
              debug: false,
            },
          },
          scene: [StartScene, GameOverScene],
        };

        gameRef.current = new Phaser.Game(config);
      },
    });

    return () => {
      gameRef.current?.destroy(true);
    };
  }, [bombImage, currentBombImage]);

  useEffect(() => {
    if (appleImage && appleImage != "/assets/ball.png") {
      const appleBlob = base64ToBlob(appleImage, "image/png");
      const appleBlobUrl = URL.createObjectURL(appleBlob);
      setCurrentAppleImage(appleBlobUrl);
    }
  }, [appleImage]);

  useEffect(() => {
    if (bombImage && bombImage != "/assets/barrier.png") {
      const bombBlob = base64ToBlob(bombImage, "image/png");
      const bombBlobUrl = URL.createObjectURL(bombBlob);
      setCurrentBombImage(bombBlobUrl);
    }
  }, [bombImage]);

  useEffect(() => {
    if (gameRef.current) {
      gameRef.current.events.emit("toggleRestartButton", !showGameOverModal);
    }
  }, [showGameOverModal]);

  return <div id="phaser-game" style={{ border: "2px solid white" }}></div>;
};

export default PhaserGameComponent;
