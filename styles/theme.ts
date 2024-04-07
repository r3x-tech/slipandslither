import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    primary: "#F8F8F8",
    secondary: "#1B1A1A",
    tertiary: "#4339FF",
    quaternary: "#FF2768",
    black: "#000000",
    white: "#FFFFFF",
    green: "#00BF63",
    red: "#FF0000",
    gray: "#A0A0A0",
    lightGray: "#F5F5F7",
    darkerGray: "#86868B",
    input: "#1B1B1F",
    background: "#000000",
  },
  fonts: {
    body: "Montserrat, sans-serif",
  },
  blacks: {
    400: "#2D2D2D",
    500: "#1B1A1A",
    600: "#151414",
    700: "#0D0D0D",
  },

  green: {
    700: "#00BF63",
  },
  red: {
    700: "#FF3131",
  },
  rex: {
    pink: "#FF2F61",
    blue: "#01BDF6",
    green: "#16F89C",
  },
});

export default theme;
