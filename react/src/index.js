import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "App";
import "index.css";
import { theme } from "theme";
import * as serviceWorkerRegistration from "serviceWorkerRegistration";
import reportWebVitals from "reportWebVitals";
import { CssBaseline, MuiThemeProvider } from "@material-ui/core";
import ErrorBoundary from "components/ErrorBoundary";
import { StateContextProvider } from "contexts/StateContext";
import { SettingsContextProvider } from "contexts/SettingsContext";
import { StatisticsContextProvider } from "contexts/StatisticsContext";
import { SessionsContextProvider } from "contexts/SessionsContext";
import { ColumnsContextProvider } from "contexts/ColumnsContext";

ReactDOM.render(
  <ErrorBoundary>
    <BrowserRouter>
      <StateContextProvider>
        <SessionsContextProvider>
          <ColumnsContextProvider>
            <SettingsContextProvider>
              <StatisticsContextProvider>
                <MuiThemeProvider theme={theme}>
                  <CssBaseline>
                    <App />
                  </CssBaseline>
                </MuiThemeProvider>
              </StatisticsContextProvider>
            </SettingsContextProvider>
          </ColumnsContextProvider>
        </SessionsContextProvider>
      </StateContextProvider>
    </BrowserRouter>
  </ErrorBoundary>,
  document.getElementById("app")
);

serviceWorkerRegistration.unregister();

reportWebVitals();
