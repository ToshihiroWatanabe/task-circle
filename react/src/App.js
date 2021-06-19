import React, { Fragment, useContext, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import ResponsiveDrawer from "components/header/ResponsiveDrawer";
import ReportAnalytics from "components/ReportAnalytics";
import Settings from "components/Settings";
import Login from "components/Login";
import Signup from "components/Signup";
import { Context } from "contexts/Context";
import Portfolio from "components/Portfolio";
import About from "components/About";
import Reports from "components/reports/Reports";
import TaskAndTimer from "components/TaskAndTimer/TaskAndTimer";

/** ドロワーの横幅 */
const DRAWER_WIDTH = "15rem";

// 開発中はページタイトルを変更
if (
  process.env.NODE_ENV === "development" &&
  !document.title.match(/.*開発中.*/)
) {
  document.title += "(開発中)";
}

const localStorageGetItemReports = localStorage.getItem("reports")
  ? JSON.parse(localStorage.getItem("reports"))
  : [];

const useStyles = makeStyles((theme) => ({
  main: {
    marginTop: "5rem",
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
    },
    [theme.breakpoints.up("lg")]: {
      width: `calc(100% - ${DRAWER_WIDTH}px)`,
      marginLeft: DRAWER_WIDTH,
    },
  },
}));

/**
 * Appコンポーネントです。
 */
const App = () => {
  const classes = useStyles();
  const [state, setState] = useContext(Context);

  useEffect(() => {
    setState((state) => {
      const newState = { ...state, reports: localStorageGetItemReports };
      return newState;
    });
  }, []);

  return (
    <>
      {window.location.href.match(/.*\/portfolio\/.*/) && <Portfolio />}
      {!window.location.href.match(/.*\/portfolio\/.*/) && (
        <>
          {/* ドロワー */}
          <ResponsiveDrawer />
          <main className={classes.main}>
            <Switch>
              {/* タスク＆タイマー */}
              <Route exact path="/">
                <TaskAndTimer />
              </Route>
              {/* 日報管理 */}
              <Route exact path="/reports">
                <Reports />
              </Route>
              {/* 分析レポート */}
              <Route exact path="/analytics">
                <ReportAnalytics reports={state.reports} />
              </Route>
              {/* 設定 */}
              <Route exact path="/settings">
                <Settings />
              </Route>
              {/* について */}
              <Route exact path="/about">
                <About />
              </Route>
              {/* ログイン */}
              <Route exact path="/login">
                <Login />
              </Route>
              {/* 新規登録 */}
              <Route exact path="/signup">
                <Signup />
              </Route>
            </Switch>
          </main>
        </>
      )}
    </>
  );
};

export default App;
