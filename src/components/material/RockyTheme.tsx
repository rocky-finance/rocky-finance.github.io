import { ThemeOptions } from "@material-ui/core/styles"

/** @see https://github.com/creativesuraj/react-material-ui-dark-mode */
/*
declare module "@material-ui/core/styles/createMuiTheme" {
  interface Theme {
    status: {
      danger: string
    }
  }
  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    status?: {
      danger?: string
    }
  }
}
*/

export const lightTheme: ThemeOptions = {
  palette: {
    type: "light",
    background: {
      paper: "#fafafa",
      default: "#fafafa",
    },
    text: {
      primary: "rgba(0, 0, 0, 1)",
      secondary: "rgba(0, 0, 0, 0.54)",
      disabled: "rgba(0, 0, 0, 0.38)",
      hint: "rgba(0, 0, 0, 0.38)",
    },
  },
}

export const darkTheme: ThemeOptions = {
  palette: {
    type: "dark",
    background: {
      paper: "#303030",
      default: "#303030",
    },
    text: {
      primary: "rgba(255, 255, 255, 1)",
      secondary: "rgba(255, 255, 255, 0.54)",
      disabled: "rgba(255, 255, 255, 0.38)",
      hint: "rgba(255, 255, 255, 0.38)",
    },
  },
}
