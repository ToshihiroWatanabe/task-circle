import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import { ContextProvider } from "./contexts/Context";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { CssBaseline, MuiThemeProvider } from "@material-ui/core";
import { theme } from "./theme";

ReactDOM.render(
  <BrowserRouter>
    <ContextProvider>
      <MuiThemeProvider theme={theme}>
        <CssBaseline>
          <App />
        </CssBaseline>
      </MuiThemeProvider>
    </ContextProvider>
  </BrowserRouter>,
  document.getElementById("app")
);

serviceWorkerRegistration.unregister();

reportWebVitals();
