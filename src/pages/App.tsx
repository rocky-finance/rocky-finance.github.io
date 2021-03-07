import "../styles/global.scss"

import React, { ReactElement, useCallback } from "react"
import { Route, Switch, Link, useLocation } from "react-router-dom"

import { AppDispatch } from "../state"
import { BLOCK_TIME } from "../constants"
import DepositBTC from "./DepositBTC"
import Risk from "./Risk"
import SwapBTC from "./SwapBTC"
import ToastsProvider from "../providers/ToastsProvider"
import Web3ReactManager from "../components/Web3ReactManager"
import WithdrawBTC from "./WithdrawBTC"
import fetchGasPrices from "../utils/updateGasPrices"
import fetchTokenPricesUSD from "../utils/updateTokenPrices"
import { useDispatch } from "react-redux"
import usePoller from "../hooks/usePoller"
import { makeStyles, withStyles } from "@material-ui/core/styles"
import AppBar from "@material-ui/core/AppBar"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import Toolbar from "@material-ui/core/Toolbar"
import IconButton from "@material-ui/core/IconButton"
import { useTranslation } from "react-i18next"
import logo from "../assets/icons/logo.svg"
import Web3Status from "../components/material/Web3Status"
import ThemeChanger from "../components/material/ThemeChanger"

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

export default function App(): ReactElement {
  const classes = useStyles()
  const { t } = useTranslation()
  const location = useLocation()
  const currentTab = location.pathname

  const dispatch = useDispatch<AppDispatch>()

  const fetchAndUpdateGasPrice = useCallback(() => {
    void fetchGasPrices(dispatch)
  }, [dispatch])
  const fetchAndUpdateTokensPrice = useCallback(() => {
    fetchTokenPricesUSD(dispatch)
  }, [dispatch])
  usePoller(fetchAndUpdateGasPrice, BLOCK_TIME)
  usePoller(fetchAndUpdateTokensPrice, BLOCK_TIME * 3)

  return (
    <Web3ReactManager>
      <ToastsProvider>
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
        <Switch>
          <Route exact path="/" component={SwapBTC} />
          <Route exact path="/deposit" component={DepositBTC} />
          <Route exact path="/withdraw" component={WithdrawBTC} />
          <Route exact path="/risk" component={Risk} />
        </Switch>
      </ToastsProvider>
    </Web3ReactManager>
  )
}
