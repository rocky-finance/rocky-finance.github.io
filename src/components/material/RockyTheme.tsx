import { createMuiTheme } from "@material-ui/core/styles"
import { green, orange } from "@material-ui/core/colors"

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

export const rockyTheme = createMuiTheme({
  status: {
    danger: orange[400],
  },
  palette: {
    primary: {
      main: "#FFF",
    },
    secondary: {
      main: green[500],
    },
    text: {
      primary: "rgba(244, 0, 0, 0.87)",
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
  },
})
