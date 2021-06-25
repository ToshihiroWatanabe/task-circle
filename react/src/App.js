import React, { useContext, useEffect } from "react";
import { Switch, Route, useLocation } from "react-router-dom";
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
import { SettingsContext } from "contexts/SettingsContext";
import { DRAWER_WIDTH } from "utils/constant";
import { StatisticsContext } from "contexts/StatisticsContext";

// 開発中はページタイトルを変更
if (
  process.env.NODE_ENV === "development" &&
  !document.title.match(/.*開発中.*/)
) {
  document.title += "(開発中)";
}

/** ローカルストレージから日報を取得します。 */
const localStorageGetItemReports = localStorage.getItem("reports")
  ? JSON.parse(localStorage.getItem("reports"))
  : [];

/** ローカルストレージから設定を取得します。 */
const localStorageGetItemSettings = localStorage.getItem("settings")
  ? JSON.parse(localStorage.getItem("settings"))
  : {};

/** ローカルストレージから統計を取得します。 */
const localStorageGetItemStatistics = localStorage.getItem("statistics")
  ? JSON.parse(localStorage.getItem("statistics"))
  : {};

const useStyles = makeStyles((theme) => ({
  main: {
    marginTop: "5rem",
    paddingLeft: theme.spacing(2),
    [theme.breakpoints.down("xs")]: {
      marginTop: "4rem",
    },
    [theme.breakpoints.down("sm")]: {
      paddingLeft: theme.spacing(0),
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
  const [settings, setSettings] = useContext(SettingsContext);
  const [statistics, setStatistics] = useContext(StatisticsContext);
  const location = useLocation();

  useEffect(() => {
    // 初期値とローカルストレージからの値を統合
    setState((state) => {
      return {
        ...state,
        reports: localStorageGetItemReports,
      };
    });
    setSettings((settings) => {
      return { ...settings, ...localStorageGetItemSettings };
    });
    setStatistics((statistics) => {
      return { ...statistics, ...localStorageGetItemStatistics };
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
            {/* タスク＆タイマー */}
            <div
              style={{
                display: location.pathname === "/" ? "" : "none",
              }}
            >
              <TaskAndTimer />
            </div>
            <Switch>
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
