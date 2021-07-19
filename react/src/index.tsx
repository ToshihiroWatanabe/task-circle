import { CssBaseline } from "@material-ui/core";
import App from "App";
import ErrorBoundary from "components/ErrorBoundary";
import { GlobalStateContextProvider } from "contexts/GlobalStateContext";
import "index.css";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from "reportWebVitals";
import * as serviceWorkerRegistration from "serviceWorkerRegistration";

ReactDOM.render(
  <BrowserRouter>
    <GlobalStateContextProvider>
      <ErrorBoundary>
        <CssBaseline>
          <App />
        </CssBaseline>
      </ErrorBoundary>
    </GlobalStateContextProvider>
  </BrowserRouter>,
  document.getElementById("app")
);

serviceWorkerRegistration.register();

reportWebVitals();
