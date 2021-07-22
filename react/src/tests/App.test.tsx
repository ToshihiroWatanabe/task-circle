import React from "react";
import { render } from "@testing-library/react";
import App from "App";
import About from "components/About";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { GlobalStateContextProvider } from "contexts/GlobalStateContext";

const history = createMemoryHistory();

test("Appコンポーネントが描画される事", () => {
  history.push("/");
  const { getByText } = render(
    <Router history={history}>
      <GlobalStateContextProvider>
        <App />
      </GlobalStateContextProvider>
    </Router>
  );
  expect(getByText("TaskCircle")).toBeInTheDocument();
});

test("「このアプリについて」が描画される事", () => {
  history.push("/about");
  const { container } = render(
    <Router history={history}>
      <GlobalStateContextProvider>
        <About />
      </GlobalStateContextProvider>
    </Router>
  );
  expect(container).toHaveTextContent("ビルド時刻");
});
