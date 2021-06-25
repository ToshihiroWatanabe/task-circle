import React from "react";
import ReactDOM from "react-dom";
import App from "App";
import * as serviceWorkerRegistration from "serviceWorkerRegistration";
import reportWebVitals from "reportWebVitals";
import { ContextProvider } from "contexts/Context";
import { BrowserRouter } from "react-router-dom";
import "index.css";
import { CssBaseline, MuiThemeProvider } from "@material-ui/core";
import ErrorBoundary from "components/ErrorBoundary";
import { theme } from "theme";
import { SettingsContextProvider } from "contexts/SettingsContext";
import { StatisticsContextProvider } from "contexts/StatisticsContext";

ReactDOM.render(
  <ErrorBoundary>
    <BrowserRouter>
      <ContextProvider>
        <SettingsContextProvider>
          <StatisticsContextProvider>
            <MuiThemeProvider theme={theme}>
              <CssBaseline>
                <App />
              </CssBaseline>
            </MuiThemeProvider>
          </StatisticsContextProvider>
        </SettingsContextProvider>
      </ContextProvider>
    </BrowserRouter>
  </ErrorBoundary>,
  document.getElementById("app")
);

serviceWorkerRegistration.unregister();

reportWebVitals();
