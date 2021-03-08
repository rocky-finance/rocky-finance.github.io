import React, { ReactElement } from "react"
import { Link, useLocation } from "react-router-dom"

import { makeStyles, withStyles } from "@material-ui/core/styles"
import AppBar from "@material-ui/core/AppBar"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import Toolbar from "@material-ui/core/Toolbar"
import IconButton from "@material-ui/core/IconButton"
import { useTranslation } from "react-i18next"
import logo from "../../assets/icons/logo.svg"
import Web3Status from "../../components/material/Web3Status"
import ThemeChanger from "../../components/material/ThemeChanger"

const useStyles = makeStyles((theme) => ({
  root: {
    alignItems: "stretch",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
}))

const StyledTabs = withStyles({
  root: {
    flexGrow: 1,
    "& div.MuiTabs-scroller": {
      display: "inline-flex",
      justifyContent: "center",
    },
  },
})(Tabs)

export default function Appbar(): ReactElement {
  const classes = useStyles()
  const { t } = useTranslation()
  const location = useLocation()
  const currentTab = location.pathname

  return (
    <AppBar position="static">
      <Toolbar className={classes.root}>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
        >
          <img className="logo" alt="logo" src={logo} />
        </IconButton>
        <StyledTabs value={currentTab} centered scrollButtons="off">
          <Tab label={t("swap")} component={Link} to="/" value="/" />
          <Tab
            label={t("deposit")}
            component={Link}
            to="deposit"
            value="/deposit"
          />
          <Tab
            label={t("withdraw")}
            component={Link}
            to="withdraw"
            value="/withdraw"
          />
          <Tab label={t("risk")} component={Link} to="risk" value="/risk" />
        </StyledTabs>
        <Web3Status />
        <ThemeChanger />
      </Toolbar>
    </AppBar>
  )
}
