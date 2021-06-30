import React, { memo, useContext, useEffect, useRef, useState } from "react";
import { makeStyles, Typography, useTheme } from "@material-ui/core";
import TodoList from "./TodoList";
import Room from "./Room";
import { Context } from "contexts/Context";
import { SettingsContext } from "contexts/SettingsContext";
import { changeFaviconTo } from "utils/changeFavicon";
import startedAudio from "audio/notification_simple-01.mp3";
import stoppedAudio from "audio/notification_simple-02.mp3";
import achievedAudio from "audio/sound02.mp3";
import tickAudio from "audio/tick.mp3";
import faintTickAudio from "audio/faintTick.mp3";
import YouTube from "react-youtube";
import { secondToHHMMSS } from "utils/convert";
import uuid from "uuid/v4";
import { StatisticsContext } from "contexts/StatisticsContext";
import FloatingTimer from "./FloatingTimer";
import SockJsClient from "react-stomp";
import { SOCKET_URL } from "utils/constant";

/** 一度にカウントする秒数 */
const ONCE_COUNT = 1;
/** カウントの間隔(ミリ秒) */
const COUNT_INTERVAL = 1000;
/** setTimeoutのID */
let timeoutId = null;

/** タイマーを開始した時刻 */
let startedAt = null;
/** 最後にカウントした時刻 */
let lastCountedAt = null;

/**
 * 次にタイマーをカウントするまでの時間(ミリ秒)を返します。
 */
const getTimeout = () => {
  const dateNow = Date.now();
  const timeout =
    // 現在時刻(ミリ秒)の下3桁が開始時刻(ミリ秒)の下3桁以上の場合
    // → 1000 + 開始時刻(ミリ秒)の下3桁 - 現在時刻(ミリ秒)の下3桁
    dateNow % COUNT_INTERVAL >= startedAt % COUNT_INTERVAL
      ? COUNT_INTERVAL +
        (startedAt % COUNT_INTERVAL) -
        (dateNow % COUNT_INTERVAL)
      : // 現在時刻(ミリ秒)の下3桁が開始時刻(ミリ秒)の下3桁未満の場合
        // → 開始時刻(ミリ秒)の下3桁 - 現在時刻(ミリ秒)の下3桁
        (startedAt % COUNT_INTERVAL) - (dateNow % COUNT_INTERVAL);
  return timeout;
};

/** デフォルトタイトル */
const defaultTitle = document.title;

/** タイマー開始の効果音 */
const startedSound = new Audio(startedAudio);
/** タイマー停止の効果音 */
const stoppedSound = new Audio(stoppedAudio);
/** タイマーのチクタク音 */
const tickSound = new Audio(tickAudio);
tickSound.volume = 1;
/** かすかなチクタク音 */
const faintTickSound = new Audio(faintTickAudio);
faintTickSound.volume = 1;
/** 目標時間タイマー達成音 */
const achievedSound = new Audio(achievedAudio);

/** タイマー再生ボタンにカーソルが合っているかどうか */
let isPlayButtonFocused = false;

/** YouTube動作再生オプション */
const playerOptions = {
  height: "1",
  width: "1",
  playerVars: {
    autoplay: 0,
  },
};

/** 作業用BGM動画プレーヤー */
let workVideoPlayer = null;
/** 休憩用BGM動画プレーヤー */
let breakVideoPlayer = null;
let videoPlayDone = true;

const sessionFindAllTopicsId = uuid();

/** デフォルトTodoリスト */
const defaultColumns = {
  [uuid()]: {
    name: "タスク1",
    items: [],
  },
};

/** ローカルストレージからTodoリストを取得します。 */
const localStorageGetItemColumns = localStorage.getItem("columns")
  ? JSON.parse(localStorage.getItem("columns"))
  : { ...defaultColumns };

const useStyles = makeStyles((theme) => ({}));

/**
 * タスク＆タイマーページのコンポーネントです。
 */
const TaskAndTimer = memo(() => {
  const classes = useStyles();
  const theme = useTheme();
  const [state, setState] = useContext(Context);
  const [columns, setColumns] = useState({
    ...localStorageGetItemColumns,
  });
  const [settings] = useContext(SettingsContext);
  const [statistics, setStatistics] = useContext(StatisticsContext);
  const [sessions, setSessions] = useState([]);
  // 動画の読み込みが終わったかどうか
  const [workVideoOnReady, setWorkVideoOnReady] = useState(false);
  const [breakVideoOnReady, setBreakVideoOnReady] = useState(false);
  // 作業用BGMの動画ID
  const [workVideoId, setWorkVideoId] = useState(
    settings.workVideoUrl.split(/v=|\//).slice(-1)[0]
  );
  // 休憩用BGMの動画ID
  const [breakVideoId, setBreakVideoId] = useState(
    settings.breakVideoUrl.split(/v=|\//).slice(-1)[0]
  );
  const $websocket = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  // 設定の動画URLに変化があったとき
  useEffect(() => {
    // タイマーが作動していないとき
    if (!state.isTimerOn) {
      // 動画IDを更新
      updateVideoId();
    }
  }, [settings.workVideoUrl, settings.breakVideoUrl]);

  // 設定の作業用動画の音量に変化があったとき
  useEffect(() => {
    // 作業用動画が存在しているとき
    if (workVideoPlayer !== null) {
      // ボリュームを調整
      workVideoPlayer.setVolume(settings.workVideoVolume);
    }
  }, [settings.workVideoVolume]);
  // 設定の休憩用動画の音量に変化があったとき
  useEffect(() => {
    // 休憩用動画が存在しているとき
    if (breakVideoPlayer !== null) {
      // ボリュームを調整
      breakVideoPlayer.setVolume(settings.breakVideoVolume);
    }
  }, [settings.breakVideoVolume]);

  /**
   * 動画IDを更新します。
   */
  const updateVideoId = () => {
    // 動画URLが変わっていたら動画IDを更新
    if (settings.workVideoUrl.split(/v=|\//).slice(-1)[0] !== workVideoId) {
      setWorkVideoOnReady(false);
      workVideoPlayer = null;
      setWorkVideoId("");
      setTimeout(() => {
        setWorkVideoId(settings.workVideoUrl.split(/v=|\//).slice(-1)[0]);
      }, 10);
    }
    if (settings.breakVideoUrl.split(/v=|\//).slice(-1)[0] !== breakVideoId) {
      setBreakVideoOnReady(false);
      breakVideoPlayer = null;
      setBreakVideoId("");
      setTimeout(() => {
        setBreakVideoId(settings.breakVideoUrl.split(/v=|\//).slice(-1)[0]);
      }, 10);
    }
  };

  /**
   * 動画プレーヤーが準備完了したときの処理です。
   */
  const onPlayerReady = (event) => {
    if (event.target.h.id === "workVideoPlayer") {
      workVideoPlayer = event.target;
      if (event.target.playerInfo.videoData.title !== "") {
        setWorkVideoOnReady(true);
      }
    }
    if (event.target.h.id === "breakVideoPlayer") {
      breakVideoPlayer = event.target;
      if (event.target.playerInfo.videoData.title !== "") {
        setBreakVideoOnReady(true);
      }
    }
  };

  /**
   * 動画プレーヤーの状態が変わったときの処理です。
   */
  const onPlayerStateChange = (event) => {
    if (event.data === 1) {
      videoPlayDone = false;
    }
    // 動画が終わったとき
    if (event.data === 0 && !videoPlayDone) {
      if (event.target.h.id === "workVideoPlayer") {
        workVideoPlayer.setVolume(settings.workVideoVolume);
        workVideoPlayer.playVideo();
      }
      if (event.target.h.id === "breakVideoPlayer") {
        breakVideoPlayer.setVolume(settings.breakVideoVolume);
        breakVideoPlayer.playVideo();
      }
      videoPlayDone = true;
    }
  };

  /**
   * BGM用の動画を再生します。
   */
  const playVideo = () => {
    if (
      (!settings.isPomodoroEnabled || state.pomodoroTimerType !== "break") &&
      workVideoId !== "" &&
      workVideoPlayer !== null
    ) {
      workVideoPlayer.setVolume(settings.workVideoVolume);
      workVideoPlayer.playVideo();
    }
    if (
      settings.isPomodoroEnabled &&
      state.pomodoroTimerType === "break" &&
      breakVideoId !== "" &&
      breakVideoPlayer !== null
    ) {
      breakVideoPlayer.setVolume(settings.breakVideoVolume);
      breakVideoPlayer.playVideo();
    }
  };
  /**
   * BGM用の動画を停止します。
   */
  const stopVideo = () => {
    if (
      (!settings.isPomodoroEnabled || state.pomodoroTimerType !== "break") &&
      workVideoId !== "" &&
      workVideoPlayer !== null
    ) {
      workVideoPlayer.stopVideo();
    }
    if (
      settings.isPomodoroEnabled &&
      state.pomodoroTimerType === "break" &&
      breakVideoId !== "" &&
      breakVideoPlayer !== null
    ) {
      breakVideoPlayer.stopVideo();
    }
  };

  /**
   * タイマーの開始・停止ボタンがクリックされたときの処理です。
   * @param {*} type taskかfab
   */
  const onPlayButtonClick = (type) => {
    isPlayButtonFocused = false;
    setState((state) => {
      state.isTimerOn = !state.isTimerOn;
      if (state.isTimerOn) {
        // タイマー開始
        startedAt = Date.now();
        lastCountedAt = Date.now();
        timeoutId = setTimeout(timerCount, getTimeout());
        // 離席解除
        state.isAfk = false;
        // ポモドーロが休憩タイマーなら作業に切り替える
        if (
          type === "task" &&
          settings.isPomodoroEnabled &&
          state.pomodoroTimerType === "break"
        ) {
          state.pomodoroTimerType = "work";
          state.pomodoroTimeLeft = settings.workTimerLength;
        }
        // favicon変更
        if (settings.isPomodoroEnabled && state.pomodoroTimerType === "work") {
          changeFaviconTo("tomato");
        } else if (
          settings.isPomodoroEnabled &&
          state.pomodoroTimerType === "break"
        ) {
          changeFaviconTo("coffee");
        }
        // 開始の効果音
        startedSound.volume = settings.volume * 0.01;
        startedSound.play();
        // BGM用の動画を再生
        playVideo();
      } else {
        // タイマー終了
        if (state.pomodoroTimerType === "work") {
          state.pomodoroTimeLeft = settings.workTimerLength;
        }
        if (state.pomodoroTimerType === "break") {
          state.pomodoroTimeLeft = settings.breakTimerLength;
        }
        document.title = defaultTitle;
        // faviconをデフォルトに戻す
        const link = document.querySelector("link[rel*='icon']");
        link.href = "/favicon.ico";
        // 停止の効果音
        stoppedSound.volume = settings.volume * 0.01;
        stoppedSound.play();
        // 動画をストップ
        stopVideo();
        // 動画IDを更新
        updateVideoId();
      }
      if (state.isInRoom) {
        sendMessage();
      }
      return { ...state };
    });
  };

  /**
   * タイマーのカウント処理です。
   */
  const timerCount = () => {
    setState((state) => {
      setColumns((columns) => {
        if (state.isTimerOn) {
          timeoutId = setTimeout(timerCount, getTimeout());
          // 前回のカウントから1.5秒以上経っていると一度にカウントする量が増える
          const dateNow = Date.now();
          let count = 0;
          for (
            let i = 0;
            i <= dateNow - lastCountedAt - COUNT_INTERVAL / 2;
            i += COUNT_INTERVAL
          ) {
            count++;
          }
          spendTime(count);
          updateStatistics(count);
          lastCountedAt = Date.now();
          setTimeout(() => {
            /** 選択しているタスク */
            const selectedItem = Object.values(columns)
              .filter((column, index) => {
                return (
                  column.items.filter((item, index) => {
                    return item.isSelected;
                  })[0] !== undefined
                );
              })[0]
              .items.filter((item, index) => {
                return item.isSelected;
              })[0];
            // 目標時間を超えた かつ 目標時間を超えたときに停止する設定のとき
            if (
              selectedItem &&
              selectedItem.achievedThenStop &&
              selectedItem.spentSecond >= selectedItem.estimatedSecond
            ) {
              // 目標時間を超えたときに停止する設定をオフにする
              Object.values(columns)
                .filter((column, index) => {
                  return (
                    column.items.filter((item, index) => {
                      return item.isSelected;
                    })[0] !== undefined
                  );
                })[0]
                .items.map((item, index) => {
                  if (item.isSelected && item.achievedThenStop) {
                    item.achievedThenStop = false;
                  }
                  return item;
                });
              setState((state) => {
                state.isTimerOn = false;
                // ポモドーロの作業休憩切り替え
                if (settings.isPomodoroEnabled) {
                  if (state.pomodoroTimerType === "work") {
                    state.pomodoroTimerType = "break";
                    state.pomodoroTimeLeft = settings.breakTimerLength;
                  } else if (state.pomodoroTimerType === "break") {
                    state.pomodoroTimerType = "work";
                    state.pomodoroTimeLeft = settings.workTimerLength;
                  }
                  if (settings.isBreakAutoStart) {
                    setTimeout(() => {
                      onPlayButtonClick("fab");
                    }, 100);
                  }
                }
                return { ...state };
              });
              clearTimeout(timeoutId);
              // faviconをデフォルトに戻す
              const link = document.querySelector("link[rel*='icon']");
              link.href = "/favicon.ico";
              achievedSound.volume = settings.volume * 0.01;
              achievedSound.play();
              // 通知
              if (
                window.Notification &&
                Notification.permission === "granted"
              ) {
                new Notification("目標時間に到達しました！", {
                  body: "タイマーを停止しました。",
                });
              }
            } else if (
              settings.isPomodoroEnabled &&
              state.pomodoroTimeLeft <= 0
            ) {
              // ポモドーロタイマーのカウントが0以下のとき
              setState((state) => {
                state.isTimerOn = false;
                // 通知
                if (
                  window.Notification &&
                  Notification.permission === "granted"
                ) {
                  if (state.pomodoroTimerType === "work") {
                    new Notification("ポモドーロが終わりました！", {
                      body: settings.isBreakAutoStart
                        ? "休憩を自動スタートします。"
                        : "タイマーを停止しました。",
                      icon: "/favicon/coffee/apple-touch-icon.png",
                    });
                  } else if (state.pomodoroTimerType === "break") {
                    new Notification("休憩が終わりました！", {
                      body: "タイマーを停止しました。",
                      icon: "/favicon/tomato/apple-touch-icon.png",
                    });
                  }
                }
                // ポモドーロの作業休憩切り替え
                if (state.pomodoroTimerType === "work") {
                  state.pomodoroTimerType = "break";
                  state.pomodoroTimeLeft = settings.breakTimerLength;
                } else if (state.pomodoroTimerType === "break") {
                  state.pomodoroTimerType = "work";
                  state.pomodoroTimeLeft = settings.workTimerLength;
                }
                if (
                  settings.isBreakAutoStart &&
                  state.pomodoroTimerType === "break"
                ) {
                  setTimeout(() => {
                    onPlayButtonClick("fab");
                  }, 100);
                }

                return { ...state };
              });
              clearTimeout(timeoutId);
              // faviconをデフォルトに戻す
              const link = document.querySelector("link[rel*='icon']");
              link.href = "/favicon.ico";
              achievedSound.volume = settings.volume * 0.01;
              achievedSound.play();
            } else {
              if (settings.tickVolume === 10) {
                faintTickSound.play();
              } else if (settings.tickVolume === 50) {
                tickSound.volume = settings.tickVolume * 0.002;
                tickSound.play();
              } else if (settings.tickVolume === 100) {
                tickSound.volume = settings.tickVolume * 0.01;
                tickSound.play();
              }
            }
          }, 2);
        } else if (!state.isTimerOn) {
          clearTimeout(timeoutId);
        }
        localStorage.setItem("columns", JSON.stringify(columns));
        return columns;
      });
      return state;
    });
  };

  /**
   * 時間の加減算をします。
   */
  const spendTime = (count) => {
    setTimeout(() => {
      setState((state) => {
        setColumns((columns) => {
          Object.values(columns)
            .filter((column, index) => {
              return (
                column.items.filter((item, index) => {
                  return item.isSelected;
                })[0] !== undefined
              );
            })[0]
            .items.map((item, index) => {
              if (
                item.isSelected &&
                (!settings.isPomodoroEnabled ||
                  state.pomodoroTimerType !== "break")
              ) {
                item.spentSecond += ONCE_COUNT * count;
                setTimeout(() => {
                  refreshTitle(item.content, item.spentSecond);
                }, 2);
              }
              return item;
            });
          return { ...columns };
        });
        if (settings.isPomodoroEnabled) {
          state.pomodoroTimeLeft -= ONCE_COUNT * count;
        }
        return { ...state };
      });
    }, 1);
  };

  /**
   * 統計を更新します。
   */
  const updateStatistics = (count) => {
    setTimeout(() => {
      // 日付変更時刻は午前4時
      // 最終更新がない、初めての更新の場合
      setStatistics((statistics) => {
        if (statistics.updatedAt === 0) {
          statistics.todaySpentSecond += ONCE_COUNT * count;
        } else {
          const updatedAt = new Date(statistics.updatedAt);
          const now = new Date();
          // 0時～3時台の場合は前日扱いにする
          if (updatedAt.getHours < 4) {
            updatedAt.setDate(updatedAt.getDate - 1);
          }
          if (now.getHours < 4) {
            now.setDate(now.getDate - 1);
          }
          // 1日経っていない場合
          if (now.getDate() - updatedAt.getDate() < 1) {
            statistics.todaySpentSecond += ONCE_COUNT * count;
          } else if (now.getDate() - updatedAt.getDate() === 1) {
            // 1日経っていた場合
            statistics.yesterdaySpentSecond = statistics.todaySpentSecond;
            statistics.todaySpentSecond = ONCE_COUNT * count;
          } else if (now.getDate() - updatedAt.getDate() > 1) {
            // 2日以上経っていた場合
            statistics.yesterdaySpentSecond = 0;
            statistics.todaySpentSecond = ONCE_COUNT * count;
          }
        }
        statistics.updatedAt = Date.now();
        localStorage.setItem("statistics", JSON.stringify(statistics));
        return { ...statistics };
      });
    }, 3);
  };

  /**
   * ページのタイトルを更新します。
   */
  const refreshTitle = (content, spentSecond) => {
    setState((state) => {
      if (settings.isPomodoroEnabled) {
        document.title =
          "(" +
          secondToHHMMSS(state.pomodoroTimeLeft).substring(3) +
          ") " +
          (state.pomodoroTimerType === "work" ? content : "休憩中") +
          " | " +
          defaultTitle;
      } else {
        document.title =
          content + " (" + secondToHHMMSS(spentSecond) + ") | " + defaultTitle;
      }
      return state;
    });
  };

  const onConnected = () => {
    setIsConnected(true);
    console.log("サーバーに接続しました。");
  };

  const onDisconnected = () => {
    setIsConnected(false);
    console.log("サーバーとの接続が切れました。");
    setState((state) => {
      return { ...state, nameInRoom: "", isAfk: false, isInRoom: false };
    });
    setSessions([]);
  };

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

  const onLeaveMessageReceived = (message) => {
    console.log(message);
    setSessions((sessions) => {
      const newSessions = sessions.filter((session, index) => {
        return session.sessionId !== message.sessionId;
      });
      return [...newSessions];
    });
  };

  const onFindAllMessageReceived = (message) => {
    console.log(message);
    setSessions((sessions) => {
      return [...sessions, ...message];
    });
  };

  const onEnter = (name) => {
    setState((state) => {
      return { ...state, nameInRoom: name };
    });
    sendMessage("enter");
  };

  const onLeave = () => {
    setState((state) => {
      return { ...state, nameInRoom: "", isAfk: false };
    });
    setSessions([]);
    $websocket.current.sendMessage("/session/leave", JSON.stringify({}));
  };

  /**
   * WebSocketのメッセージを送信します。
   */
  const sendMessage = (messageType) => {
    if (!isConnected) return;
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
          userName: state.nameInRoom,
          sessionType: state.isAfk
            ? "afk"
            : settings.isPomodoroEnabled
            ? state.pomodoroTimerType
            : "normalWork",
          content: selectedTask !== null ? selectedTask.content : "",
          isTimerOn: state.isTimerOn,
          startedAt: state.isTimerOn ? Date.now() : 0,
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
      <div style={{ display: "flex" }}>
        <TodoList
          columns={columns}
          setColumns={setColumns}
          onPlayButtonClick={onPlayButtonClick}
        />
        <Room
          sessions={sessions}
          onEnter={onEnter}
          onLeave={onLeave}
          isConnected={isConnected}
          sendMessage={sendMessage}
        />
      </div>
      {/* フローティングタイマー */}
      <FloatingTimer columns={columns} onPlayButtonClick={onPlayButtonClick} />
      {/* 作業用BGM動画 */}
      {workVideoId !== "" && (
        <>
          <YouTube
            videoId={workVideoId}
            opts={playerOptions}
            onReady={onPlayerReady}
            onStateChange={onPlayerStateChange}
            id="workVideoPlayer"
          />
          <Typography
            variant="caption"
            style={{ position: "fixed", bottom: "1rem" }}
          >
            {workVideoOnReady ? "" : "作業用BGMが読み込まれていません"}
          </Typography>
        </>
      )}
      {/* 休憩用BGM動画 */}
      {breakVideoId !== "" && (
        <>
          <YouTube
            videoId={breakVideoId}
            opts={playerOptions}
            onReady={onPlayerReady}
            onStateChange={onPlayerStateChange}
            id="breakVideoPlayer"
          />
          <Typography
            variant="caption"
            style={{ position: "fixed", bottom: 0 }}
          >
            {breakVideoOnReady ? "" : "休憩用BGMが読み込まれていません"}
          </Typography>
        </>
      )}
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
    </>
  );
});

export default TaskAndTimer;
