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
import { GlobalStateContext } from "contexts/GlobalStateContext";
import React, { memo, useContext, useEffect, useRef, useState } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
//@ts-ignore
import SockJsClient from "react-stomp";
import { themeTemplate } from "theme";
import { SOCKET_URL } from "utils/constant";
//@ts-ignore
import uuid from "uuid/v4";
import { DEFAULT_TITLE } from "utils/constant";

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
  const { globalState, setGlobalState } = useContext(GlobalStateContext);
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
    setGlobalState((globalState: any) => {
      return {
        ...globalState,
        pomodoroTimeLeft: globalState.settings.workTimerLength,
        todoLists: localStorageGetItemTodoLists,
        statistics: {
          ...globalState.statistics,
          ...localStorageGetItemStatistics,
        },
        settings: { ...globalState.settings, ...localStorageGetItemSettings },
      };
    });
  }, []);

  /**
   * WebSocketで接続されたときの処理です。
   */
  const onConnected = () => {
    setGlobalState((globalState: any) => {
      return { ...globalState, isConnected: true };
    });
    console.info("ルームサーバーに接続しました。");
    if (globalState.isInRoom) {
      sendMessage("enter");
    }
  };

  /**
   * WebSocketが切断されたときの処理です。
   */
  const onDisconnected = () => {
    setGlobalState((globalState: any) => {
      return { ...globalState, isConnected: false, sessions: [] };
    });
    console.info("サーバーとの接続が切れました。");
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
    setGlobalState((globalState: any) => {
      // 離席中ならfaviconとタイトルを元に戻す
      if (globalState.isAfk) {
        const link: any = document.querySelector("link[rel*='icon']");
        link.href = "/favicon.ico";
        document.title = DEFAULT_TITLE;
      }
      if (globalState.isConnected) {
        // @ts-ignore
        $websocket.current.sendMessage("/session/leave", JSON.stringify({}));
      }
      return {
        ...globalState,
        isAfk: false,
        isInRoom: false,
        nameInRoom: "",
        sessions: [],
      };
    });
  };

  /**
   * セッションのメッセージを受信したときの処理です。
   * @param {*} message
   */
  const onSessionMessageReceived = (message: any) => {
    if (!globalState.isInRoom) {
      return;
    }
    setGlobalState((globalState: any) => {
      let sessionUpdated = false;
      let newSessions = globalState.sessions.map((session: any) => {
        if (session.sessionId === message.sessionId) {
          sessionUpdated = true;
          return message;
        }
        return session;
      });
      if (!sessionUpdated) {
        newSessions = [...newSessions, message];
      }
      return { ...globalState, sessions: newSessions };
    });
  };

  /**
   * 退室メッセージを受信したときの処理です。
   * @param {*} message
   */
  const onLeaveMessageReceived = (message: any) => {
    if (!globalState.isInRoom) {
      return;
    }
    setGlobalState((globalState: any) => {
      const newSessions = globalState.sessions.filter((session: any) => {
        return session.sessionId !== message.sessionId;
      });
      return { ...globalState, sessions: newSessions };
    });
  };

  /**
   * findAllのメッセージを受信したときの処理です。
   */
  const onFindAllMessageReceived = (message: any) => {
    setGlobalState((globalState: any) => {
      let newSessions = [...globalState.sessions, ...message];
      newSessions = newSessions.map((session) => {
        return {
          ...session,
          startedAt: (session.startedAt = new Date(
            session.startedAt
          ).getTime()),
          finishAt: (session.finishAt = new Date(session.finishAt).getTime()),
        };
      });
      return { ...globalState, sessions: newSessions };
    });
  };

  /**
   * WebSocketのメッセージを送信します。
   */
  const sendMessage = (messageType: string) => {
    setGlobalState((globalState: any) => {
      if (!globalState.isConnected && messageType !== "enter") {
        console.error("接続されていません");
        return globalState;
      } else if (!globalState.isInRoom && messageType !== "enter") {
        return globalState;
      }
      const selectedTask =
        Object.values(globalState.todoLists).filter((column: any) => {
          return (
            column.items.filter((item: any) => {
              return item.isSelected;
            })[0] !== undefined
          );
        }).length > 0
          ? // @ts-ignore
            Object.values(globalState.todoLists)
              .filter((column: any) => {
                return (
                  column.items.filter((item: any) => {
                    return item.isSelected;
                  })[0] !== undefined
                );
              })[0]
              .items.filter((item: any) => {
                return item.isSelected;
              })[0]
          : null;
      if (messageType === "enter") {
        // @ts-ignore
        $websocket.current.sendMessage(
          "/session/findall",
          sessionFindAllTopicsId
        );
      }
      // @ts-ignore
      $websocket.current.sendMessage(
        messageType !== undefined ? "/session/" + messageType : "/session",
        JSON.stringify({
          userName: localStorage.getItem("nameInRoom"),
          sessionType: globalState.isAfk
            ? "afk"
            : globalState.settings.isPomodoroEnabled
            ? globalState.pomodoroTimerType
            : "normalWork",
          content: selectedTask !== null ? selectedTask.content : "",
          isTimerOn: globalState.isTimerOn,
          startedAt:
            globalState.isTimerOn || globalState.isAfk ? Date.now() : 0,
          finishAt:
            globalState.settings.isPomodoroEnabled && globalState.isTimerOn
              ? Date.now() + globalState.pomodoroTimeLeft * 1000
              : selectedTask && selectedTask.estimatedSecond > 0
              ? Date.now() +
                (selectedTask.estimatedSecond - selectedTask.spentSecond) * 1000
              : 0,
        })
      );
      return globalState;
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
              sendMessage={sendMessage}
              onEnter={onEnter}
              onLeave={onLeave}
            />
            {/* ボトムナビゲーション */}
            {useMediaQueryThemeBreakpointsDownXs && (
              <LabelBottomNavigation
                todoLists={globalState.todoLists}
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
