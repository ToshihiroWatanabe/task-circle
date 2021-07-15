// @ts-nocheck
import { useMediaQuery, useTheme } from "@material-ui/core";
import {
  createMuiTheme,
  makeStyles,
  MuiThemeProvider,
} from "@material-ui/core/styles";
import About from "components/About";
import ResponsiveDrawer from "components/header/ResponsiveDrawer";
import Home from "components/home/Home";
import LabelBottomNavigation from "components/home/LabelBottomNavigation";
import PrivacyPolicy from "components/PrivacyPolicy";
import Settings from "components/Settings";
import { SessionsContext } from "contexts/SessionsContext";
import { SettingsContext } from "contexts/SettingsContext";
import { StateContext } from "contexts/StateContext";
import { StatisticsContext } from "contexts/StatisticsContext";
import { TodoListsContext } from "contexts/TodoListsContext";
import React, { memo, useContext, useEffect, useRef, useState } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
//@ts-ignore
import SockJsClient from "react-stomp";
import { themeTemplate } from "theme";
import { SOCKET_URL } from "utils/constant";
//@ts-ignore
import uuid from "uuid/v4";

const sessionFindAllTopicsId = uuid();

/** ローカルストレージから取得した設定 */
const localStorageGetItemSettings = localStorage.getItem("settings")
  ? //@ts-ignore
    JSON.parse(localStorage.getItem("settings"))
  : {};

/** ローカルストレージから取得した統計 */
const localStorageGetItemStatistics = localStorage.getItem("statistics")
  ? //@ts-ignore
    JSON.parse(localStorage.getItem("statistics"))
  : {};

/** ローカルストレージから取得したTodoリスト */
const localStorageGetItemTodoLists = localStorage.getItem("todoLists")
  ? //@ts-ignore
    JSON.parse(localStorage.getItem("todoLists"))
  : {
      [uuid()]: {
        name: "リスト1",
        items: [
          {
            id: uuid(),
            category: "",
            content: "タスク1",
            spentSecond: 0,
            estimatedSecond: 3600,
            isSelected: true,
            achievedThenStop: false,
          },
        ],
      },
    };

/** ローカルストレージから取得したダークモードがオンかどうか */
const localStorageGetItemIsDarkModeOn = localStorage.getItem("isDarkModeOn")
  ? localStorage.getItem("isDarkModeOn") === "true"
  : false;

const useStyles = makeStyles((theme) => ({
  main: {
    paddingTop: "5rem",
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    width: "100vw",
    maxWidth: "100vw",
    height: "100vh",
    overflow: "auto",
    [theme.breakpoints.up("md")]: {},
    [theme.breakpoints.down("xs")]: {
      paddingTop: "4rem",
    },
  },
}));

/**
 * Appコンポーネントです。
 */
const App: React.FC = memo(() => {
  const classes = useStyles();
  const theme = useTheme();
  const { state, setState } = useContext(StateContext);
  const { settings, setSettings } = useContext(SettingsContext);
  const { statistics, setStatistics } = useContext(StatisticsContext);
  const { sessions, setSessions } = useContext(SessionsContext);
  const { todoLists, setTodoLists } = useContext(TodoListsContext);
  const [isDarkModeOn, setIsDarkModeOn] = useState(
    localStorageGetItemIsDarkModeOn
  );
  const location = useLocation();
  const $websocket = useRef(null);
  /** ボトムナビゲーションの値 */
  const [bottomNavigationValue, setBottomNavigationValue] = useState("list1");

  const darkTheme = createMuiTheme({
    ...themeTemplate,
    palette: {
      ...themeTemplate.palette,
      type: isDarkModeOn ? "dark" : "light",
    },
  });
  const useMediaQueryThemeBreakpointsDownXs = useMediaQuery(
    theme.breakpoints.down("xs")
  );

  useEffect(() => {
    // 初期値とローカルストレージからの値を統合
    setTodoLists((todoLists) => {
      return { ...todoLists, ...localStorageGetItemTodoLists };
    });
    setStatistics((statistics) => {
      return { ...statistics, ...localStorageGetItemStatistics };
    });
    setTimeout(() => {
      setSettings((settings) => {
        const newSettings = { ...settings, ...localStorageGetItemSettings };
        setState((state) => {
          return {
            ...state,
            pomodoroTimeLeft: newSettings.workTimerLength,
          };
        });
        return newSettings;
      });
    }, 1);
  }, []);

  /**
   * WebSocketで接続されたときの処理です。
   */
  const onConnected = () => {
    setState((state) => {
      return { ...state, isConnected: true };
    });
    console.info("ルームサーバーに接続しました。");
    if (state.isInRoom) {
      sendMessage("enter");
    }
  };

  /**
   * WebSocketが切断されたときの処理です。
   */
  const onDisconnected = () => {
    setState((state) => {
      return { ...state, isConnected: false };
    });
    console.info("サーバーとの接続が切れました。");
    setSessions([]);
  };

  /**
   * 入室時の処理です。
   */
  const onEnter = () => {
    sendMessage("enter");
  };

  /**
   * 退室時の処理です。
   */
  const onLeave = () => {
    setState((state) => {
      // 離席中ならfaviconを元に戻す
      if (state.isAfk) {
        const link: any = document.querySelector("link[rel*='icon']");
        link.href = "/favicon.ico";
      }
      if (state.isConnected) {
        // @ts-ignore
        $websocket.current.sendMessage("/session/leave", JSON.stringify({}));
      }
      return { ...state, isAfk: false, isInRoom: false, nameInRoom: "" };
    });
    setSessions([]);
  };

  /**
   * セッションのメッセージを受信したときの処理です。
   * @param {*} message
   */
  const onSessionMessageReceived = (message: any) => {
    if (!state.isInRoom) {
      return;
    }
    setSessions((sessions) => {
      let sessionUpdated = false;
      let newSessions = sessions.map((session, index) => {
        if (session.sessionId === message.sessionId) {
          sessionUpdated = true;
          return message;
        }
        return session;
      });
      if (!sessionUpdated) {
        newSessions = [...newSessions, message];
      }
      return newSessions;
    });
  };

  /**
   * 退室メッセージを受信したときの処理です。
   * @param {*} message
   */
  const onLeaveMessageReceived = (message: any) => {
    if (!state.isInRoom) {
      return;
    }
    setSessions((sessions) => {
      const newSessions = sessions.filter((session, index) => {
        return session.sessionId !== message.sessionId;
      });
      return [...newSessions];
    });
  };

  /**
   * findAllのメッセージを受信したときの処理です。
   */
  const onFindAllMessageReceived = (message: any) => {
    setSessions((sessions) => {
      let newSessions = [...sessions, ...message];
      newSessions = newSessions.map((session) => {
        return {
          ...session,
          startedAt: (session.startedAt = new Date(
            session.startedAt
          ).getTime()),
          finishAt: (session.finishAt = new Date(session.finishAt).getTime()),
        };
      });
      return newSessions;
    });
  };

  /**
   * WebSocketのメッセージを送信します。
   */
  const sendMessage = (messageType: string) => {
    if (!state.isConnected && messageType !== "enter") {
      console.error("接続されていません");
      return;
    } else if (!state.isInRoom && messageType !== "enter") {
      return;
    }
    setState((state) => {
      const selectedTask =
        Object.values(todoLists).filter((column, index) => {
          return (
            column.items.filter((item, index) => {
              return item.isSelected;
            })[0] !== undefined
          );
        }).length > 0
          ? Object.values(todoLists)
              .filter((column, index) => {
                return (
                  column.items.filter((item, index) => {
                    return item.isSelected;
                  })[0] !== undefined
                );
              })[0]
              .items.filter((item, index) => {
                return item.isSelected;
              })[0]
          : null;
      if (messageType === "enter") {
        $websocket.current.sendMessage(
          "/session/findall",
          sessionFindAllTopicsId
        );
      }
      $websocket.current.sendMessage(
        messageType !== undefined ? "/session/" + messageType : "/session",
        JSON.stringify({
          userName: localStorage.getItem("nameInRoom"),
          sessionType: state.isAfk
            ? "afk"
            : settings.isPomodoroEnabled
            ? state.pomodoroTimerType
            : "normalWork",
          content: selectedTask !== null ? selectedTask.content : "",
          isTimerOn: state.isTimerOn,
          startedAt: state.isTimerOn || state.isAfk ? Date.now() : 0,
          finishAt:
            settings.isPomodoroEnabled && state.isTimerOn
              ? Date.now() + state.pomodoroTimeLeft * 1000
              : selectedTask && selectedTask.estimatedSecond > 0
              ? Date.now() +
                (selectedTask.estimatedSecond - selectedTask.spentSecond) * 1000
              : 0,
        })
      );
      return state;
    });
  };

  /**
   * スクロールされたときの処理です。
   */
  const onScroll = (event: any) => {
    if (location.pathname !== "/" || !useMediaQueryThemeBreakpointsDownXs) {
      return;
    }
    if (
      event.target.scrollLeft >
      event.target.scrollWidth - document.body.scrollWidth * 1.5
    ) {
      setBottomNavigationValue("room");
    } else if (event.target.scrollLeft < document.body.scrollWidth / 2) {
      setBottomNavigationValue("list1");
    } else if (event.target.scrollLeft < document.body.scrollWidth * 1.5) {
      setBottomNavigationValue("list2");
    } else if (event.target.scrollLeft < document.body.scrollWidth * 2.5) {
      setBottomNavigationValue("list3");
    } else if (event.target.scrollLeft < document.body.scrollWidth * 3.5) {
      setBottomNavigationValue("list4");
    }
  };

  return (
    <>
      <MuiThemeProvider theme={darkTheme}>
        {/* ドロワー */}
        <ResponsiveDrawer
          // @ts-ignore
          sendMessage={sendMessage}
          isDarkModeOn={isDarkModeOn}
          setIsDarkModeOn={setIsDarkModeOn}
        />
        <main
          className={classes.main}
          onScroll={onScroll}
          style={{
            backgroundColor: darkTheme.palette.type === "light" ? "" : "#333",
          }}
        >
          {/* ホーム */}
          <div
            style={{
              display: location.pathname === "/" ? "" : "none",
            }}
          >
            <Home
              // @ts-ignore
              sendMessage={sendMessage}
              onEnter={onEnter}
              onLeave={onLeave}
            />
            {/* ボトムナビゲーション */}
            {useMediaQueryThemeBreakpointsDownXs && (
              <LabelBottomNavigation
                // @ts-ignore
                todoLists={todoLists}
                bottomNavigationValue={bottomNavigationValue}
                setBottomNavigationValue={setBottomNavigationValue}
              />
            )}
          </div>
          <Switch>
            {/* 設定 */}
            <Route exact path="/settings">
              <Settings />
            </Route>
            {/* について */}
            <Route exact path="/about">
              <About />
            </Route>
            {/* プライバシーポリシー */}
            <Route exact path="/privacy">
              <PrivacyPolicy />
            </Route>
          </Switch>
        </main>
        <SockJsClient
          url={SOCKET_URL}
          topics={["/topic/session"]}
          onConnect={onConnected}
          onDisconnect={onDisconnected}
          onMessage={(msg: any) => onSessionMessageReceived(msg)}
          ref={$websocket}
        />
        <SockJsClient
          url={SOCKET_URL}
          topics={["/topic/session/leave"]}
          onMessage={(msg: any) => onLeaveMessageReceived(msg)}
        />
        <SockJsClient
          url={SOCKET_URL}
          topics={["/topic/session/findall/" + sessionFindAllTopicsId]}
          onMessage={(msg: any) => onFindAllMessageReceived(msg)}
        />
      </MuiThemeProvider>
    </>
  );
});

export default App;
