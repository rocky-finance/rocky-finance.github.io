import "../styles/global.scss"

import React, { ReactElement, useCallback, useState } from "react"
import { Redirect, Route, Switch } from "react-router-dom"

import { AppDispatch } from "../state"
import { BLOCK_TIME } from "../constants"
import DepositStable from "./DepositStable"
import Risk from "./Risk"
import Stake from "./Stake"
import SwapStable from "./SwapStable"
import Web3ReactManager from "../components/Web3ReactManager"
import WithdrawStable from "./WithdrawStable"
import fetchGasPrices from "../utils/updateGasPrices"
import fetchTokenPricesUSD from "../utils/updateTokenPrices"
import { useDispatch, useSelector } from "react-redux"
import usePoller from "../hooks/usePoller"
import Appbar from "../components/material/Appbar"
import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/core"
import { darkTheme, lightTheme } from "../components/material/RockyTheme"
import { MuiThemeProvider } from "@material-ui/core"
import CssBaseline from "@material-ui/core/CssBaseline"
import { createMuiTheme } from "@material-ui/core/styles"
import { updateDarkMode } from "../state/user"
import { AppState } from "../state/index"
import RiskDialog from "../components/material/RiskDialog"
import { SnackbarProvider } from "notistack"

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

  // Read current theme from appState
  const { userDarkMode } = useSelector((state: AppState) => state.user)

  const [theme, setTheme] = useState(userDarkMode ? darkTheme : lightTheme)

  const toggleDarkTheme = () => {
    const newPaletteType =
      theme.palette?.type === "light" ? darkTheme : lightTheme

    dispatch(updateDarkMode(newPaletteType === darkTheme))
    setTheme(newPaletteType)
  }

  const muiTheme = createMuiTheme(theme)

  const routes = [
    {
      id: "swap",
      component: SwapStable,
    },
    {
      id: "deposit",
      component: DepositStable,
    },
    {
      id: "stake",
      component: Stake,
    },
    {
      id: "withdraw",
      component: WithdrawStable,
    },
    {
      id: "risk",
      component: Risk,
    },
  ]

  return (
    <Web3ReactManager>
      <SnackbarProvider>
        <MuiThemeProvider theme={muiTheme}>
          <CssBaseline />
          <Grid direction="column" container>
            <Appbar
              onToggleDark={toggleDarkTheme}
              routes={routes.map((value) => value.id)}
            />
            <Switch>
              <Route exact path="/">
                <Redirect to="/swap" />
              </Route>
              {routes.map((value) => {
                return (
                  <Route
                    key={value.id}
                    exact
                    path={`/${value.id}`}
                    component={value.component}
                  />
                )
              })}
            </Switch>
          </Grid>
          <RiskDialog />
        </MuiThemeProvider>
      </SnackbarProvider>
    </Web3ReactManager>
  )
}
