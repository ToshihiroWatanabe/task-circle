import React, { memo, useContext, useEffect, useRef } from "react";
import { Switch, Route, useLocation } from "react-router-dom";
import { makeStyles, MuiThemeProvider } from "@material-ui/core/styles";
import { theme } from "theme";
import uuid from "uuid/v4";
import SockJsClient from "react-stomp";
import { SOCKET_URL } from "utils/constant";
import ResponsiveDrawer from "components/header/ResponsiveDrawer";
import TaskAndTimer from "components/TaskAndTimer/TaskAndTimer";
import Settings from "components/Settings";
import About from "components/About";
import { StateContext } from "contexts/StateContext";
import { SettingsContext } from "contexts/SettingsContext";
import { StatisticsContext } from "contexts/StatisticsContext";
import { SessionsContext } from "contexts/SessionsContext";
import { ColumnsContext } from "contexts/ColumnsContext";

// 開発中はページタイトルを変更
if (
  process.env.NODE_ENV === "development" &&
  !document.title.match(/.*開発中.*/)
) {
  document.title += "(開発中)";
}

const sessionFindAllTopicsId = uuid();

/** ローカルストレージから設定を取得します。 */
const localStorageGetItemSettings = localStorage.getItem("settings")
  ? JSON.parse(localStorage.getItem("settings"))
  : {};

/** ローカルストレージから統計を取得します。 */
const localStorageGetItemStatistics = localStorage.getItem("statistics")
  ? JSON.parse(localStorage.getItem("statistics"))
  : {};

/** ローカルストレージからTodoリストを取得します。 */
const localStorageGetItemColumns = localStorage.getItem("columns")
  ? JSON.parse(localStorage.getItem("columns"))
  : {
      [uuid()]: {
        name: "リスト1",
        items: [
          {
            id: uuid(),
            category: "",
            content: "タスク",
            spentSecond: 0,
            estimatedSecond: 3600,
            isSelected: true,
            achievedThenStop: false,
          },
        ],
      },
    };

const useStyles = makeStyles((theme) => ({
  main: {
    marginTop: "5rem",
    paddingLeft: theme.spacing(1),
    width: "100vw",
    maxWidth: "100vw",
    height: "calc(100vh - 5rem)",
    overflow: "auto",
    [theme.breakpoints.up("md")]: {},
    [theme.breakpoints.down("xs")]: {
      marginRight: theme.spacing(1),
      marginTop: "4rem",
    },
  },
}));

/**
 * Appコンポーネントです。
 */
const App = memo(() => {
  const classes = useStyles();
  const [state, setState] = useContext(StateContext);
  const [settings, setSettings] = useContext(SettingsContext);
  const [statistics, setStatistics] = useContext(StatisticsContext);
  const [sessions, setSessions] = useContext(SessionsContext);
  const [columns, setColumns] = useContext(ColumnsContext);
  const location = useLocation();
  const $websocket = useRef(null);

  useEffect(() => {
    // 初期値とローカルストレージからの値を統合
    setColumns((columns) => {
      return { ...columns, ...localStorageGetItemColumns };
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
    console.info("サーバーに接続しました。");
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
      return { ...state, isAfk: false };
    });
    setSessions([]);
    $websocket.current.sendMessage("/session/leave", JSON.stringify({}));
  };

  /**
   * セッションのメッセージを受信したときの処理です。
   * @param {*} message
   */
  const onSessionMessageReceived = (message) => {
    console.log(message);
    setSessions((sessions) => {
      let newSessions = [
        ...sessions,
        {
          sessionId: message.sessionId,
          userName: message.userName,
          sessionType: message.sessionType,
          content: message.content,
          isTimerOn: message.isTimerOn,
          startedAt: message.startedAt,
          finishAt: message.finishAt,
        },
      ];
      // sessionIdの重複を削除(後に出てきたほうが消える)
      newSessions = newSessions
        .slice()
        .reverse()
        .filter(
          (v, i, a) => a.findIndex((t) => t.sessionId === v.sessionId) === i
        )
        .reverse();
      return newSessions;
    });
  };

  /**
   * 退室メッセージを受信したときの処理です。
   * @param {*} message
   */
  const onLeaveMessageReceived = (message) => {
    console.log(message);
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
  const onFindAllMessageReceived = (message) => {
    console.log(message);
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
  const sendMessage = (messageType) => {
    if (!state.isConnected && messageType !== "enter") {
      console.error("接続されていません");
      return;
    } else if (!state.isInRoom && messageType !== "enter") {
      return;
    }
    setState((state) => {
      const selectedTask =
        Object.values(columns).filter((column, index) => {
          return (
            column.items.filter((item, index) => {
              return item.isSelected;
            })[0] !== undefined
          );
        }).length > 0
          ? Object.values(columns)
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

  return (
    <>
      <MuiThemeProvider theme={theme}>
        {/* ドロワー */}
        <ResponsiveDrawer sendMessage={sendMessage} />
        <main className={classes.main}>
          {/* タスク＆タイマー */}
          <div
            style={{
              display: location.pathname === "/" ? "" : "none",
            }}
          >
            <TaskAndTimer
              sendMessage={sendMessage}
              onEnter={onEnter}
              onLeave={onLeave}
            />
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
          </Switch>
        </main>
        <SockJsClient
          url={SOCKET_URL}
          topics={["/topic/session"]}
          onConnect={onConnected}
          onDisconnect={onDisconnected}
          onMessage={(msg) => onSessionMessageReceived(msg)}
          ref={$websocket}
        />
        <SockJsClient
          url={SOCKET_URL}
          topics={["/topic/session/leave"]}
          onMessage={(msg) => onLeaveMessageReceived(msg)}
        />
        <SockJsClient
          url={SOCKET_URL}
          topics={["/topic/session/findall/" + sessionFindAllTopicsId]}
          onMessage={(msg) => onFindAllMessageReceived(msg)}
        />
      </MuiThemeProvider>
    </>
  );
});

export default App;
