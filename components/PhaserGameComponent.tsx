// import React, { useEffect, useRef, useState } from "react";
// import Phaser from "phaser";
// import MainScene from "./scenes/MainScene";
// import WebFont from "webfontloader";
// import GameOverScene from "./scenes/GameOverScene";
// import StartScene from "./scenes/StartScene";
// import { useGameSettingsStore } from "@/stores/useGameSettingsStore";
// import { useGameOverModalStore } from "@/stores/useGameOverModalStore";

// const PhaserGameComponent = () => {
//   const gameRef = useRef<Phaser.Game | null>(null);
//   const { snakeBodyImage, appleImage, bombImage } = useGameSettingsStore();
//   const [currentSnakeBodyImage, setCurrentSnakeBodyImage] =
//     useState<string>(snakeBodyImage);
//   const [currentAppleImage, setCurrentAppleImage] =
//     useState<string>(appleImage);
//   const [currentBombImage, setCurrentBombImage] = useState<string>(bombImage);

//   const { showGameOverModal } = useGameOverModalStore();

//   function base64ToBlob(base64: string, mimeType: string): Blob {
//     console.log("base64: ", base64);

//     // Split the base64 string and get the data part after the comma.
//     const splitBase64 = base64.split(",");

//     // Check if the data part exists. If not, assume the entire string is the data.
//     const base64Data =
//       splitBase64.length > 1 ? splitBase64[1].trim() : splitBase64[0].trim();

//     // Decode the base64 string to byte characters.
//     const byteCharacters = atob(base64Data);
//     const byteArrays: Uint8Array[] = [];

//     // Convert the byte characters to a Blob as before.
//     for (let offset = 0; offset < byteCharacters.length; offset += 512) {
//       const slice = byteCharacters.slice(offset, offset + 512);
//       const byteNumbers = new Array(slice.length);

//       for (let i = 0; i < slice.length; i++) {
//         byteNumbers[i] = slice.charCodeAt(i);
//       }

//       const byteArray = new Uint8Array(byteNumbers);
//       byteArrays.push(byteArray);
//     }

//     return new Blob(byteArrays, { type: mimeType });
//   }

//   useEffect(() => {
//     WebFont.load({
//       google: {
//         families: ["Montserrat:100,200,300,400,500,600,700,800,900"],
//       },
//       active: () => {
//         const mainScene = new MainScene(
//           currentAppleImage,
//           currentBombImage,
//           currentSnakeBodyImage
//         );

//         const config: Phaser.Types.Core.GameConfig = {
//           type: Phaser.AUTO,
//           parent: "phaser-game",
//           width: 360,
//           height: 360,
//           backgroundColor: "#ababab",
//           physics: {
//             default: "arcade",
//             arcade: {
//               debug: false,
//             },
//           },
//           scene: [StartScene, mainScene, GameOverScene],
//         };

//         gameRef.current = new Phaser.Game(config);
//       },
//     });

//     return () => {
//       gameRef.current?.destroy(true);
//     };
//   }, [currentAppleImage, currentBombImage, currentSnakeBodyImage]);

//   useEffect(() => {
//     if (appleImage && appleImage != "/assets/apple.png") {
//       const appleBlob = base64ToBlob(appleImage, "image/png");
//       const appleBlobUrl = URL.createObjectURL(appleBlob);
//       setCurrentAppleImage(appleBlobUrl);
//     }
//   }, [appleImage]);

//   useEffect(() => {
//     if (bombImage && bombImage != "/assets/bomb.png") {
//       const bombBlob = base64ToBlob(bombImage, "image/png");
//       const bombBlobUrl = URL.createObjectURL(bombBlob);
//       setCurrentBombImage(bombBlobUrl);
//     }
//   }, [bombImage]);

//   useEffect(() => {
//     if (snakeBodyImage && snakeBodyImage != "/assets/snakebody.png") {
//       const snakeBodyBlob = base64ToBlob(snakeBodyImage, "image/png");
//       const snakeBodyBlobUrl = URL.createObjectURL(snakeBodyBlob);
//       setCurrentSnakeBodyImage(snakeBodyBlobUrl);
//     }
//   }, [snakeBodyImage]);

//   useEffect(() => {
//     if (gameRef.current) {
//       gameRef.current.events.emit("toggleRestartButton", !showGameOverModal);
//     }
//   }, [showGameOverModal]);

//   return <div id="phaser-game" style={{ border: "2px solid white" }}></div>;
// };

// export default PhaserGameComponent;
