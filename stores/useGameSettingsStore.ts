import { create } from "zustand";

type GameSettingsState = {
  defaultBallImage: string;
  ballImage: string;
  ballGenerationPrompt: string;
  defaultBarrierImage: string;
  barrierImage: string;
  barrierGenerationPrompt: string;
  mechanics: {};
  setBallImage: (ballImage: string) => void;
  setBallGenerationPrompt: (ballGenerationPrompt: string) => void;
  setBarrierImage: (barrierImage: string) => void;
  setBarrierGenerationPrompt: (barrierGenerationPrompt: string) => void;
  setMechanics: (mechanics: string) => void;
};

export const useGameSettingsStore = create<GameSettingsState>((set) => ({
  defaultBallImage: "/assets/ball.png",
  ballImage: "/assets/ball.png",
  ballGenerationPrompt: "",
  defaultBarrierImage: "/assets/barrier.png",
  barrierImage: "/assets/barrier.png",
  barrierGenerationPrompt: "",
  mechanics: {},
  setBallImage: (ballImage: string) => set({ ballImage }),
  setBallGenerationPrompt: (ballGenerationPrompt: string) =>
    set({ ballGenerationPrompt }),
  setBarrierImage: (barrierImage: string) => set({ barrierImage }),
  setBarrierGenerationPrompt: (barrierGenerationPrompt: string) =>
    set({ barrierGenerationPrompt }),
  setMechanics: (mechanics: string) => set({ mechanics }),
}));
