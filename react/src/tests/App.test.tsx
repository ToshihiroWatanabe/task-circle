import React from "react";
import { render } from "@testing-library/react";
import App from "App";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { GlobalStateContextProvider } from "contexts/GlobalStateContext";

const history = createMemoryHistory();
history.push("/");

test("Appコンポーネントが描画される事", () => {
  render(
    <Router history={history}>
      <GlobalStateContextProvider>
        <App />
      </GlobalStateContextProvider>
    </Router>
  );
});
