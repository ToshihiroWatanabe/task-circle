import { CssBaseline } from "@material-ui/core";
import App from "App";
import ErrorBoundary from "components/ErrorBoundary";
import { SessionsContextProvider } from "contexts/SessionsContext";
import { SettingsContextProvider } from "contexts/SettingsContext";
import { StateContextProvider } from "contexts/StateContext";
import { StatisticsContextProvider } from "contexts/StatisticsContext";
import { TodoListsContextProvider } from "contexts/TodoListsContext";
import "index.css";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from "reportWebVitals";
import * as serviceWorkerRegistration from "serviceWorkerRegistration";

ReactDOM.render(
  <ErrorBoundary>
    <BrowserRouter>
      <StateContextProvider>
        <SessionsContextProvider>
          <TodoListsContextProvider>
            <SettingsContextProvider>
              <StatisticsContextProvider>
                <CssBaseline>
                  <App />
                </CssBaseline>
              </StatisticsContextProvider>
            </SettingsContextProvider>
          </TodoListsContextProvider>
        </SessionsContextProvider>
      </StateContextProvider>
    </BrowserRouter>
  </ErrorBoundary>,
  document.getElementById("app")
);

serviceWorkerRegistration.register();

reportWebVitals();
