import "../styles/global.scss"

import React, { ReactElement, useCallback, useState } from "react"
import { Route, Switch } from "react-router-dom"

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
import Appbar from "../components/material/Appbar"
import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/core/styles"
import { darkTheme, lightTheme } from "../components/material/RockyTheme"
import { MuiThemeProvider } from "@material-ui/core"
import CssBaseline from "@material-ui/core/CssBaseline"
import { createMuiTheme } from "@material-ui/core/styles"

const useStyles = makeStyles((theme) => ({
  offset: theme.mixins.toolbar,
}))

export default function App(): ReactElement {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()

  const fetchAndUpdateGasPrice = useCallback(() => {
    void fetchGasPrices(dispatch)
  }, [dispatch])
  const fetchAndUpdateTokensPrice = useCallback(() => {
    fetchTokenPricesUSD(dispatch)
  }, [dispatch])
  usePoller(fetchAndUpdateGasPrice, BLOCK_TIME)
  usePoller(fetchAndUpdateTokensPrice, BLOCK_TIME * 3)

  const [theme, setTheme] = useState(lightTheme)

  const toggleDarkTheme = () => {
    const newPaletteType =
      theme.palette?.type === "light" ? darkTheme : lightTheme
    setTheme(newPaletteType)
  }

  const muiTheme = createMuiTheme(theme)

  return (
    <Web3ReactManager>
      <ToastsProvider>
        <MuiThemeProvider theme={muiTheme}>
          <CssBaseline />
          <Grid direction="column">
            <Appbar onToggleDark={toggleDarkTheme} />
            <div className={classes.offset} />
            <Switch>
              <Route exact path="/" component={SwapBTC} />
              <Route exact path="/deposit" component={DepositBTC} />
              <Route exact path="/withdraw" component={WithdrawBTC} />
              <Route exact path="/risk" component={Risk} />
            </Switch>
          </Grid>
        </MuiThemeProvider>
      </ToastsProvider>
    </Web3ReactManager>
  )
}
