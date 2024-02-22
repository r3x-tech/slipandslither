import { create } from "zustand";

type GameSettingsState = {
  defaultAppleImage: string;
  appleImage: string;
  appleGenerationPrompt: string;
  defaultBombImage: string;
  bombImage: string;
  bombGenerationPrompt: string;
  defaultSnakeBodyImage: string;
  snakeBodyImage: string;
  snakeBodyGenerationPrompt: string;
  setAppleImage: (appleImage: string) => void;
  setAppleGenerationPrompt: (appleGenerationPrompt: string) => void;
  setBombImage: (bombImage: string) => void;
  setBombGenerationPrompt: (bombGenerationPrompt: string) => void;
  setSnakeBodyImage: (snakeBodyImage: string) => void;
  setSnakeBodyGenerationPrompt: (snakeBodyGenerationPrompt: string) => void;
};

export const useGameSettingsStore = create<GameSettingsState>((set) => ({
  defaultAppleImage: "/assets/ball.png",
  appleImage: "/assets/ball.png",
  appleGenerationPrompt: "",
  defaultBombImage: "/assets/barrier.png",
  bombImage: "/assets/barrier.png",
  bombGenerationPrompt: "",
  defaultSnakeBodyImage: "/assets/barrier.png",
  snakeBodyImage: "/assets/barrier.png",
  snakeBodyGenerationPrompt: "",
  setAppleImage: (appleImage: string) => set({ appleImage }),
  setAppleGenerationPrompt: (appleGenerationPrompt: string) =>
    set({ appleGenerationPrompt }),
  setBombImage: (bombImage: string) => set({ bombImage }),
  setBombGenerationPrompt: (bombGenerationPrompt: string) =>
    set({ bombGenerationPrompt }),
  setSnakeBodyImage: (snakeBodyImage: string) => set({ snakeBodyImage }),
  setSnakeBodyGenerationPrompt: (snakeBodyGenerationPrompt: string) =>
    set({ snakeBodyGenerationPrompt }),
}));
