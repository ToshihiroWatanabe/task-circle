import { CssBaseline } from "@material-ui/core";
import App from "App";
import ErrorBoundary from "components/ErrorBoundary";
import { SessionsContextProvider } from "contexts/SessionsContext.tsx";
import { SettingsContextProvider } from "contexts/SettingsContext.tsx";
import { StateContextProvider } from "contexts/StateContext.tsx";
import { StatisticsContextProvider } from "contexts/StatisticsContext.tsx";
import { TodoListsContextProvider } from "contexts/TodoListsContext.tsx";
import "index.css";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from "reportWebVitals.ts";
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
