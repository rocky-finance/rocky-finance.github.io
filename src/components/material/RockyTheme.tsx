import { createMuiTheme, ThemeOptions } from "@material-ui/core/styles"
// import { ThemeOptions } from "@material-ui/core/styles"
// import { green, orange } from "@material-ui/core/colors"
// import { orange } from "@material-ui/core/colors"

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
/*
const options: ThemeOptions = {
  status: {
    danger: orange[400],
  },
  palette: {
    type: "light",
    primary: {
      main: "#FFF",
      light: "#FF0000",
      dark: "#000",
    },
    secondary: {
      main: green[500],
    },
    text: {
      primary: "rgba(0, 0, 0, 1)",
      secondary: "rgba(0, 0, 0, 0.54)",
      disabled: "rgba(0, 0, 0, 0.38)",
      hint: "rgba(0, 0, 0, 0.38)",
    },
  },
  overrides: {
    MuiAppBar: {
      root: {
        boxShadow: "none",
      },
    },
    MuiTabs: {
      indicator: {
        backgroundColor: "#000",
        height: "3px",
      },
      fixed: {
        borderBottom: "black 1px dashed",
      },
    },
    MuiTab: {
      textColorInherit: {
        color: "rgba(0, 0, 0, 0.7)",
        fontWeight: "normal",
        "&.Mui-selected": {
          fontWeight: "bold",
        },
      },
    },
    MuiIconButton: {
      root: {
        "&:hover": {
          backgroundColor: "transparent",
        },
      },
    },
  },
}
*/
export const lightTheme: ThemeOptions = {
  palette: {
    type: "light",
    background: {
      default: "#FFF",
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
  ...lightTheme,
  palette: {
    type: "dark",
    background: {
      default: "#000",
    },
    text: {
      primary: "rgba(255, 255, 255, 1)",
      secondary: "rgba(255, 255, 255, 0.54)",
      disabled: "rgba(255, 255, 255, 0.38)",
      hint: "rgba(255, 255, 255, 0.38)",
    },
  },
}

export const rockyTheme = createMuiTheme(darkTheme)
// export const darkTheme = createMuiTheme(dark)
// export const lightTheme = createMuiTheme(lightTheme)
// export const oT = createMuiTheme(options)
