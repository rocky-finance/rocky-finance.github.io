import React, { ReactElement } from "react"
import { Link, useLocation } from "react-router-dom"

import { makeStyles, useTheme } from "@material-ui/core/styles"
import AppBar from "@material-ui/core/AppBar"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import Grid from "@material-ui/core/Grid"
import Toolbar from "@material-ui/core/Toolbar"
import IconButton from "@material-ui/core/IconButton"
import Typography from "@material-ui/core/Typography"
import { useTranslation } from "react-i18next"
import logo from "../../assets/icons/logo.svg"
import Web3Status from "../../components/material/Web3Status"

const useStyles = makeStyles((theme) => ({
  root: {
    alignSelf: "stretch",
    "& div.MuiTabs-scroller": {
      display: "inline-flex",
      justifyContent: "center",
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
}))

interface AppbarProps {
  onToggleDark: (() => void)
}

export default function Appbar(props:AppbarProps): ReactElement<AppbarProps> {
  const classes = useStyles()
  const theme = useTheme()
  const { t } = useTranslation()
  const location = useLocation()
  const currentTab = location.pathname

  return (
    <AppBar position="relative">
      <Grid container component={Toolbar} direction="row" wrap="nowrap">
        <Grid item>
          <Grid container alignItems="center" wrap="nowrap">
            <IconButton edge="start" color="inherit" aria-label="menu">
              <img className="logo" alt="logo" src={logo} />
            </IconButton>
            <Typography variant="h6" color="inherit">
              rocky.finance
            </Typography>
          </Grid>
        </Grid>
        <Grid
          container
          alignItems="stretch"
          value={currentTab}
          centered
          component={Tabs}
          className={classes.root}
        >
          <Tab
            label={t("swap")}
            component={Link}
            to="/"
            value="/"
            centerRipple
          />
          <Tab
            label={t("deposit")}
            component={Link}
            to="deposit"
            value="/deposit"
            centerRipple
          />
          <Tab
            label={t("withdraw")}
            component={Link}
            to="withdraw"
            value="/withdraw"
            centerRipple
          />
          <Tab
            label={t("risk")}
            component={Link}
            to="risk"
            value="/risk"
            centerRipple
          />
        </Grid>
        <Grid item>
          <Grid container alignItems="center" wrap="nowrap">
            <Web3Status />
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={props.onToggleDark}
            >
              {theme.palette.type === "dark" ? "☾" : "☀"}
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
    </AppBar>
  )
}
