import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "App";
import "index.css";
import * as serviceWorkerRegistration from "serviceWorkerRegistration";
import reportWebVitals from "reportWebVitals";
import { CssBaseline } from "@material-ui/core";
import ErrorBoundary from "components/ErrorBoundary";
import { StateContextProvider } from "contexts/StateContext";
import { SettingsContextProvider } from "contexts/SettingsContext";
import { StatisticsContextProvider } from "contexts/StatisticsContext";
import { SessionsContextProvider } from "contexts/SessionsContext";
import { TodoListsContextProvider } from "contexts/TodoListsContext";

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

serviceWorkerRegistration.unregister();

reportWebVitals();
