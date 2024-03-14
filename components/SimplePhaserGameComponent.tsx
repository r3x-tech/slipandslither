import React, { useEffect, useRef } from "react";
import Phaser from "phaser";

const SimplePhaserGameComponent = () => {
  const phaserGameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const touchStart = (e: any) => {
      console.log("Touch start detected outside Phaser", e);
    };

    document.addEventListener("touchstart", touchStart);
    return () => document.removeEventListener("touchstart", touchStart);
  }, []);

  useEffect(() => {
    if (phaserGameRef.current) {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 360,
        height: 360,
        parent: phaserGameRef.current,
        backgroundColor: "#ff0000", // Directly set the background color here
        scene: {
          create: function () {
            // Now, there's no need to preload a sky image
            const text = this.add.text(0, 0, "Hello, Phaser!", {
              font: "40px Arial",
              color: "#ffffff",
            });
            Phaser.Display.Align.In.Center(
              text,
              this.add.zone(180, 180, 360, 360)
            );
          },
        },
      };

      const game = new Phaser.Game(config);

      return () => {
        game.destroy(true);
      };
    }
  }, []);

  const handleButtonClick = () => {
    alert("Button clicked!");
    console.log("Button clicked!");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "20px",
      }}
    >
      {/* Apply touch-action CSS property here */}
      <div
        ref={phaserGameRef}
        style={{
          zIndex: 0,
          position: "relative",
          touchAction: "pan-y pinch-zoom",
        }}
      />
      <button
        onClick={handleButtonClick}
        style={{ marginTop: "20px", color: "green" }}
      >
        Click Me!
      </button>
    </div>
  );
};

export default SimplePhaserGameComponent;
