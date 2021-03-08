import "./index.css"
import "./i18n"
import "@fontsource/roboto"

import { Web3ReactProvider, createWeb3ReactRoot } from "@web3-react/core"
import { logError, sendWebVitalsToGA } from "./utils/googleAnalytics"

import App from "./pages/App"
import { rockyTheme } from "./components/material/RockyTheme"
import { NetworkContextName } from "./constants"
import { Provider } from "react-redux"
import React, { Suspense } from "react"
import ReactDOM from "react-dom"
import { HashRouter as Router } from "react-router-dom"
import getLibrary from "./utils/getLibrary"
import reportWebVitals from "./reportWebVitals"
import store from "./state"
import { ThemeProvider } from "@material-ui/core"

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

if (window && window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false
}

window.addEventListener("error", logError)

ReactDOM.render(
  <>
    <React.StrictMode>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3ProviderNetwork getLibrary={getLibrary}>
          <Provider store={store}>
            <Suspense fallback={null}>
              <ThemeProvider theme={rockyTheme}>
                <Router>
                  <App />
                </Router>
              </ThemeProvider>
            </Suspense>
          </Provider>
        </Web3ProviderNetwork>
      </Web3ReactProvider>
    </React.StrictMode>
  </>,
  document.getElementById("root"),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(sendWebVitalsToGA)
