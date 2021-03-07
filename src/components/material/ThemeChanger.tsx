import "./ThemeChanger.scss"

import { AppDispatch, AppState } from "../../state"
import React, { ReactElement, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { makeStyles } from "@material-ui/core/styles"
import IconButton from "@material-ui/core/IconButton"

import { updateDarkMode } from "../../state/user"
import { useColorMode } from "@chakra-ui/react"

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}))

const ThemeChanger = (): ReactElement => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { colorMode, toggleColorMode } = useColorMode()
  const { userDarkMode } = useSelector((state: AppState) => state.user)

  useEffect(() => {
    if (userDarkMode) {
      document.body.classList.add("dark")
    } else {
      document.body.classList.remove("dark")
    }
  }, [userDarkMode])

  return (
    <IconButton
      edge="end"
      className={classes.menuButton}
      color="inherit"
      aria-label="menu"
      onClick={(): void => {
        dispatch(updateDarkMode(!userDarkMode))
        if (
          (userDarkMode && colorMode === "dark") ||
          (!userDarkMode && colorMode === "light")
        ) {
          toggleColorMode()
        }
      }}
    >
      {userDarkMode ? "☾" : "☀"}
    </IconButton>
  )
}

export default ThemeChanger
