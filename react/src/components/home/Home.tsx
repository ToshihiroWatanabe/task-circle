import { Typography } from "@material-ui/core";
// @ts-ignore
import faintTickAudio from "audio/faintTick.mp3";
// @ts-ignore
import startedAudio from "audio/notification_simple-01.mp3";
// @ts-ignore
import stoppedAudio from "audio/notification_simple-02.mp3";
// @ts-ignore
import achievedAudio from "audio/sound02.mp3";
// @ts-ignore
import tickAudio from "audio/tick.mp3";
import Room from "components/home/Room";
import TimerRnd from "components/home/TimerRnd";
import TodoList from "components/home/TodoList";
import SyncProgress from "components/SyncProgress";
import { SessionsContext } from "contexts/SessionsContext";
import { SettingsContext } from "contexts/SettingsContext";
import { StateContext } from "contexts/StateContext";
import { StatisticsContext } from "contexts/StatisticsContext";
import { TodoListsContext } from "contexts/TodoListsContext";
import React, { memo, useContext, useEffect, useState } from "react";
import YouTube from "react-youtube";
import TodoListService from "services/todoList.service";
import { changeFaviconTo } from "utils/changeFavicon";
import {
  COUNT_INTERVAL,
  DEFAULT_TITLE,
  ONCE_COUNT,
  SPENT_SECOND_MAX,
} from "utils/constant";
import { secondToHHMMSS } from "utils/convert";

/** タイマーのカウントのsetTimeoutのID */
let timerCountTimeout = 0;
/** ローカルストレージのデータの更新のsetTimeoutのID */
let updateTimeout = 0;
/** タイマーを開始した時刻 */
let startedAt = 0;
/** 最後にカウントした時刻 */
let lastCountedAt = 0;

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

/** YouTube動作再生オプション */
const playerOptions = {
  height: "1",
  width: "1",
  playerVars: {
    autoplay: 0,
  },
};

/** 作業用BGM動画プレーヤー */
let workVideoPlayer: any = null;
/** 休憩用BGM動画プレーヤー */
let breakVideoPlayer: any = null;
let videoPlayDone = true;

/**
 * ホームのコンポーネントです。
 */
const Home = memo((props: { sendMessage: any; onEnter: any; onLeave: any }) => {
  const { state, setState } = useContext(StateContext);
  const { todoLists, setTodoLists } = useContext(TodoListsContext);
  const { settings, setSettings } = useContext(SettingsContext);
  const { statistics, setStatistics } = useContext(StatisticsContext);
  const { sessions, setSessions } = useContext(SessionsContext);
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
  const [isInSync, setIsInSync] = useState(false);

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
  const onPlayerReady = (event: any) => {
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
  const onPlayerStateChange = (event: any) => {
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
    setState((state: any) => {
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
      return state;
    });
  };

  /**
   * BGM用の動画を停止します。
   */
  const stopVideo = () => {
    if (workVideoId !== "" && workVideoPlayer !== null) {
      workVideoPlayer.stopVideo();
    }
    if (breakVideoId !== "" && breakVideoPlayer !== null) {
      breakVideoPlayer.stopVideo();
    }
  };

  /**
   * タイマーの開始・停止ボタンがクリックされたときの処理です。
   * @param {*} type taskかfab
   */
  const onPlayButtonClick = (type: string) => {
    setState((state: any) => {
      return { ...state, isTimerOn: !state.isTimerOn };
    });
    setState((state: any) => {
      // state.isTimerOn = !state.isTimerOn;
      if (state.isTimerOn) {
        // タイマー開始
        startedAt = Date.now();
        lastCountedAt = Date.now();
        // @ts-ignore
        timerCountTimeout = setTimeout(timerCount, getTimeout());
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
        } else {
          const link: any = document.querySelector("link[rel*='icon']");
          link.href = "/favicon/taskcircle_timer_on_favicon.ico";
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
        document.title = DEFAULT_TITLE;
        // faviconをデフォルトに戻す
        const link: any = document.querySelector("link[rel*='icon']");
        link.href = "/favicon.ico";
        // 停止の効果音
        stoppedSound.volume = settings.volume * 0.01;
        stoppedSound.play();
        // 動画をストップ
        stopVideo();
        // 動画IDを更新
        updateVideoId();
      }
      if (state.isConnected && state.isInRoom) {
        props.sendMessage();
      }
      return { ...state };
    });
  };

  /**
   * タイマーのカウント処理です。
   */
  const timerCount = () => {
    setSettings((settings: any) => {
      setState((state: any) => {
        setTodoLists((todoLists: any) => {
          if (state.isTimerOn) {
            // @ts-ignore
            timerCountTimeout = setTimeout(timerCount, getTimeout());
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
            [state, todoLists] = spendTime(count, state, todoLists, settings);
            updateTodoLists(todoLists);
            updateStatistics(state, count);
            lastCountedAt = Date.now();
            setTimeout(() => {
              /** 選択しているタスク */
              // @ts-ignore
              const selectedItem = Object.values(todoLists)
                .filter((column: any) => {
                  return (
                    column.items.filter((item: any) => {
                      return item.isSelected;
                    })[0] !== undefined
                  );
                })[0]
                .items.filter((item: any) => {
                  return item.isSelected;
                })[0];
              // 目標時間を超えた かつ 目標時間を超えたときに停止する設定のとき
              if (
                selectedItem &&
                selectedItem.achievedThenStop &&
                selectedItem.spentSecond >= selectedItem.estimatedSecond
              ) {
                // 目標時間を超えたときに停止する設定をオフにする
                // @ts-ignore
                Object.values(todoLists)
                  .filter((column: any) => {
                    return (
                      column.items.filter((item: any) => {
                        return item.isSelected;
                      })[0] !== undefined
                    );
                  })[0]
                  .items.map((item: any) => {
                    if (item.isSelected && item.achievedThenStop) {
                      item.achievedThenStop = false;
                    }
                    return item;
                  });
                setState((state: any) => {
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
                clearTimeout(timerCountTimeout);
                // faviconをデフォルトに戻す
                const link: any = document.querySelector("link[rel*='icon']");
                link.href = "/favicon.ico";
                // 動画をストップ
                stopVideo();
                // 動画IDを更新
                updateVideoId();
                achievedSound.volume = settings.volume * 0.01;
                achievedSound.play();
                // 通知
                if (
                  window.Notification &&
                  Notification.permission === "granted"
                ) {
                  new Notification("目標時間を達成しました！", {
                    body: "タイマーを停止しました。",
                  });
                }
                if (state.isConnected && state.isInRoom) {
                  props.sendMessage();
                }
              } else if (
                settings.isPomodoroEnabled &&
                state.pomodoroTimeLeft <= 0
              ) {
                // ポモドーロタイマーのカウントが0以下のとき
                setState((state: any) => {
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
                clearTimeout(timerCountTimeout);
                // faviconをデフォルトに戻す
                const link: any = document.querySelector("link[rel*='icon']");
                link.href = "/favicon.ico";
                // 動画をストップ
                stopVideo();
                // 動画IDを更新
                updateVideoId();
                achievedSound.volume = settings.volume * 0.01;
                achievedSound.play();
                if (state.isConnected && state.isInRoom) {
                  props.sendMessage();
                }
              } else {
                // チクタク音を鳴らす
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
            updateTodoLists(todoLists);
            clearTimeout(timerCountTimeout);
          }
          return { ...todoLists };
        });
        return { ...state };
      });
      return { ...settings };
    });
  };

  /**
   * 時間の加減算をします。
   * @param {number} count カウント
   */
  const spendTime = (
    count: number,
    state: any,
    todoLists: any,
    settings: any
  ) => {
    // @ts-ignore
    Object.values(todoLists)
      .filter((column: any) => {
        return (
          column.items.filter((item: any) => {
            return item.isSelected;
          })[0] !== undefined
        );
      })[0]
      .items.map((item: any) => {
        if (item.isSelected) {
          if (
            !settings.isPomodoroEnabled ||
            state.pomodoroTimerType !== "break"
          ) {
            item.spentSecond += ONCE_COUNT * count;
            if (item.spentSecond > SPENT_SECOND_MAX) {
              item.spentSecond = SPENT_SECOND_MAX;
            }
          }
          refreshTitle(item.content, item.spentSecond, state, settings);
        }
        return item;
      });

    if (settings.isPomodoroEnabled) {
      state.pomodoroTimeLeft -= ONCE_COUNT * count;
    }
    return [{ ...state }, { ...todoLists }];
  };

  /**
   * 統計を更新します。
   */
  const updateStatistics = (state: any, count: number) => {
    setTimeout(() => {
      // 日付変更時刻は午前4時
      // 最終更新がない、初めての更新の場合
      setStatistics((statistics: any) => {
        if (state.pomodoroTimerType !== "break") {
          if (statistics.updatedAt === 0) {
            statistics.todaySpentSecond += ONCE_COUNT * count;
          } else {
            const updatedAt = new Date(statistics.updatedAt);
            const now = new Date();
            // 0時～3時台の場合は前日扱いにする
            if (updatedAt.getHours() < 4) {
              updatedAt.setDate(updatedAt.getDate() - 1);
            }
            if (now.getHours() < 4) {
              now.setDate(now.getDate() - 1);
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
        }
        return { ...statistics };
      });
    }, 3);
  };

  /**
   * ページのタイトルを更新します。
   */
  const refreshTitle = (
    content: string,
    spentSecond: number,
    state: any,
    settings: any
  ) => {
    if (!state.isTimerOn) {
      document.title = DEFAULT_TITLE;
      return state;
    }
    if (settings.isPomodoroEnabled) {
      document.title =
        "(" +
        secondToHHMMSS(state.pomodoroTimeLeft).substring(3) +
        ") " +
        (state.pomodoroTimerType === "work" ? content : "休憩中") +
        " | " +
        DEFAULT_TITLE;
    } else {
      document.title =
        content + " (" + secondToHHMMSS(spentSecond) + ") | " + DEFAULT_TITLE;
    }
  };

  /**
   * ローカルストレージとDBのTodoリストを更新します。
   */
  const updateTodoLists = (todoLists: any) => {
    localStorage.setItem("todoLists", JSON.stringify(todoLists));
    localStorage.setItem("todoListsUpdatedAt", Date.now().toString());
    if (state.isLogined) {
      setIsInSync(true);
    }
    clearTimeout(updateTimeout);
    // @ts-ignore
    updateTimeout = setTimeout(() => {
      if (state.isLogined) {
        // DBの設定を取得
        TodoListService.findByTokenId(state.tokenId).then((r) => {
          // ローカルのデータより新しいかどうか比較する
          const localStorageGetItemTodoListsUpdatedAt = localStorage.getItem(
            "todoListsUpdatedAt"
          )
            ? localStorage.getItem("todoListsUpdatedAt")
            : 0;
          if (
            // @ts-ignore
            new Date(r.data.updatedAt).getTime() >
            // @ts-ignore
            localStorage.getItem("todoListsUpdatedAt")
          ) {
            // ローカルのデータをDBのデータに上書きする
            setTodoLists((todoLists: any) => {
              const newTodoLists =
                // @ts-ignore
                localStorageGetItemTodoListsUpdatedAt > 0
                  ? {
                      ...todoLists,
                      ...JSON.parse(r.data.todoList),
                    }
                  : JSON.parse(r.data.todoList);
              localStorage.setItem("todoLists", JSON.stringify(newTodoLists));
              localStorage.setItem(
                "todoListsUpdatedAt",
                new Date(r.data.updatedAt).getTime().toString()
              );
              return newTodoLists;
            });
          }
          setIsInSync(false);
        });
        setTodoLists((todoLists: any) => {
          TodoListService.update(state.tokenId, JSON.stringify(todoLists));
          return todoLists;
        });
      }
    }, 100);
  };

  return (
    <>
      <div style={{ display: "flex" }} id="todoListAndRoom">
        <TodoList
          // @ts-ignore
          todoLists={todoLists}
          setTodoLists={setTodoLists}
          onPlayButtonClick={onPlayButtonClick}
          sendMessage={props.sendMessage}
          updateTodoLists={updateTodoLists}
        />
        <Room
          // @ts-ignore
          sessions={sessions}
          onEnter={props.onEnter}
          onLeave={props.onLeave}
          sendMessage={props.sendMessage}
        />
      </div>
      {/* タイマー */}
      <TimerRnd
        // @ts-ignore
        todoLists={todoLists}
        onPlayButtonClick={onPlayButtonClick}
      />
      {/* 作業用BGM動画 */}
      {workVideoId !== "" && (
        <>
          <YouTube
            videoId={workVideoId}
            // @ts-ignore
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
            // @ts-ignore
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
      {(ONCE_COUNT !== 1 || COUNT_INTERVAL !== 1000) && (
        <div
          style={{
            position: "fixed",
            zIndex: 9999,
            fontSize: "5rem",
            color: "tomato",
            top: "50vh",
            left: "50vw",
            pointerEvents: "none",
          }}
        >
          デバッグモード
        </div>
      )}
      <SyncProgress isInSync={isInSync} />
    </>
  );
});

export default Home;
