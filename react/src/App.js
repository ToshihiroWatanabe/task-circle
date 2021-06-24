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
import uuid from "uuid/v4";

/** ドロワーの横幅 */
const DRAWER_WIDTH = "15rem";

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

/** デフォルトTodoリスト */
const defaultColumns = {
  [uuid()]: {
    name: "タスク",
    items: [],
  },
};

/** デフォルト設定 */
const defaultSettings = {
  isPomodoroEnabled: false,
  isBreakAutoStart: true,
  workTimerLength: 25 * 60,
  breakTimerLength: 5 * 60,
  workVideoUrl: "",
  workVideoVolume: 100,
  breakVideoUrl: "",
  breakVideoVolume: 100,
  tickVolume: 10,
  volume: 100,
};

const useStyles = makeStyles((theme) => ({
  main: {
    marginTop: "5rem",
    paddingLeft: theme.spacing(2),
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
  const location = useLocation();

  useEffect(() => {
    setState((state) => {
      const newState = {
        ...state,
        reports: localStorageGetItemReports,
      };
      return newState;
    });
    setSettings((settings) => {
      return { ...defaultSettings, ...localStorageGetItemSettings };
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
