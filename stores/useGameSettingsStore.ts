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
  defaultAppleImage: "/assets/apple.png",
  appleImage: "/assets/apple.png",
  appleGenerationPrompt: "",
  defaultBombImage: "/assets/bomb.png",
  bombImage: "/assets/bomb.png",
  bombGenerationPrompt: "",
  defaultSnakeBodyImage: "/assets/snakebody.png",
  snakeBodyImage: "/assets/snakebody.png",
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
