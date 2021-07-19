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
import { GlobalStateContext } from "contexts/GlobalStateContext";
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
  const { globalState, setGlobalState } = useContext(GlobalStateContext);
  // 動画の読み込みが終わったかどうか
  const [workVideoOnReady, setWorkVideoOnReady] = useState(false);
  const [breakVideoOnReady, setBreakVideoOnReady] = useState(false);
  // 作業用BGMの動画ID
  const [workVideoId, setWorkVideoId] = useState(
    globalState.settings.workVideoUrl.split(/v=|\//).slice(-1)[0]
  );
  // 休憩用BGMの動画ID
  const [breakVideoId, setBreakVideoId] = useState(
    globalState.settings.breakVideoUrl.split(/v=|\//).slice(-1)[0]
  );
  const [isInSync, setIsInSync] = useState(false);

  // 設定の動画URLに変化があったとき
  useEffect(() => {
    // タイマーが作動していないとき
    if (!globalState.isTimerOn) {
      // 動画IDを更新
      updateVideoId();
    }
  }, [globalState.settings.workVideoUrl, globalState.settings.breakVideoUrl]);

  // 設定の作業用動画の音量に変化があったとき
  useEffect(() => {
    // 作業用動画が存在しているとき
    if (workVideoPlayer !== null) {
      // ボリュームを調整
      workVideoPlayer.setVolume(globalState.settings.workVideoVolume);
    }
  }, [globalState.settings.workVideoVolume]);
  // 設定の休憩用動画の音量に変化があったとき
  useEffect(() => {
    // 休憩用動画が存在しているとき
    if (breakVideoPlayer !== null) {
      // ボリュームを調整
      breakVideoPlayer.setVolume(globalState.settings.breakVideoVolume);
    }
  }, [globalState.settings.breakVideoVolume]);

  /**
   * 動画IDを更新します。
   */
  const updateVideoId = () => {
    // 動画URLが変わっていたら動画IDを更新
    if (
      globalState.settings.workVideoUrl.split(/v=|\//).slice(-1)[0] !==
      workVideoId
    ) {
      setWorkVideoOnReady(false);
      workVideoPlayer = null;
      setWorkVideoId("");
      setTimeout(() => {
        setWorkVideoId(
          globalState.settings.workVideoUrl.split(/v=|\//).slice(-1)[0]
        );
      }, 10);
    }
    if (
      globalState.settings.breakVideoUrl.split(/v=|\//).slice(-1)[0] !==
      breakVideoId
    ) {
      setBreakVideoOnReady(false);
      breakVideoPlayer = null;
      setBreakVideoId("");
      setTimeout(() => {
        setBreakVideoId(
          globalState.settings.breakVideoUrl.split(/v=|\//).slice(-1)[0]
        );
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
        workVideoPlayer.setVolume(globalState.settings.workVideoVolume);
        workVideoPlayer.playVideo();
      }
      if (event.target.h.id === "breakVideoPlayer") {
        breakVideoPlayer.setVolume(globalState.settings.breakVideoVolume);
        breakVideoPlayer.playVideo();
      }
      videoPlayDone = true;
    }
  };

  /**
   * BGM用の動画を再生します。
   */
  const playVideo = () => {
    setGlobalState((globalState: any) => {
      if (
        (!globalState.settings.isPomodoroEnabled ||
          globalState.pomodoroTimerType !== "break") &&
        workVideoId !== "" &&
        workVideoPlayer !== null
      ) {
        workVideoPlayer.setVolume(globalState.settings.workVideoVolume);
        workVideoPlayer.playVideo();
      }
      if (
        globalState.settings.isPomodoroEnabled &&
        globalState.pomodoroTimerType === "break" &&
        breakVideoId !== "" &&
        breakVideoPlayer !== null
      ) {
        breakVideoPlayer.setVolume(globalState.settings.breakVideoVolume);
        breakVideoPlayer.playVideo();
      }
      return globalState;
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
    setGlobalState((globalState: any) => {
      return { ...globalState, isTimerOn: !globalState.isTimerOn };
    });
    setGlobalState((globalState: any) => {
      // state.isTimerOn = !state.isTimerOn;
      if (globalState.isTimerOn) {
        // タイマー開始
        startedAt = Date.now();
        lastCountedAt = Date.now();
        // @ts-ignore
        timerCountTimeout = setTimeout(timerCount, getTimeout());
        // 離席解除
        globalState.isAfk = false;
        // ポモドーロが休憩タイマーなら作業に切り替える
        if (
          type === "task" &&
          globalState.settings.isPomodoroEnabled &&
          globalState.pomodoroTimerType === "break"
        ) {
          globalState.pomodoroTimerType = "work";
          globalState.pomodoroTimeLeft = globalState.settings.workTimerLength;
        }
        // favicon変更
        if (
          globalState.settings.isPomodoroEnabled &&
          globalState.pomodoroTimerType === "work"
        ) {
          changeFaviconTo("tomato");
        } else if (
          globalState.settings.isPomodoroEnabled &&
          globalState.pomodoroTimerType === "break"
        ) {
          changeFaviconTo("coffee");
        } else {
          const link: any = document.querySelector("link[rel*='icon']");
          link.href = "/favicon/taskcircle_timer_on_favicon.ico";
        }
        // 開始の効果音
        startedSound.volume = globalState.settings.volume * 0.01;
        startedSound.play();
        // BGM用の動画を再生
        playVideo();
      } else {
        // タイマー終了
        if (globalState.pomodoroTimerType === "work") {
          globalState.pomodoroTimeLeft = globalState.settings.workTimerLength;
        }
        if (globalState.pomodoroTimerType === "break") {
          globalState.pomodoroTimeLeft = globalState.settings.breakTimerLength;
        }
        document.title = DEFAULT_TITLE;
        // faviconをデフォルトに戻す
        const link: any = document.querySelector("link[rel*='icon']");
        link.href = "/favicon.ico";
        // 停止の効果音
        stoppedSound.volume = globalState.settings.volume * 0.01;
        stoppedSound.play();
        // 動画をストップ
        stopVideo();
        // 動画IDを更新
        updateVideoId();
      }
      if (globalState.isConnected && globalState.isInRoom) {
        props.sendMessage();
      }
      return { ...globalState };
    });
  };

  /**
   * タイマーのカウント処理です。
   */
  const timerCount = () => {
    setGlobalState((globalState: any) => {
      if (globalState.isTimerOn) {
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
        globalState = spendTime(count, globalState);
        updateTodoLists(globalState.todoLists);
        globalState.statistics = updateStatistics(count, globalState);
        lastCountedAt = Date.now();
        setTimeout(() => {
          /** 選択しているタスク */
          // @ts-ignore
          const selectedItem = Object.values(globalState.todoLists)
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
            setGlobalState((globalState: any) => {
              globalState.isTimerOn = false;
              // ポモドーロの作業休憩切り替え
              if (globalState.settings.isPomodoroEnabled) {
                if (globalState.pomodoroTimerType === "work") {
                  globalState.pomodoroTimerType = "break";
                  globalState.pomodoroTimeLeft =
                    globalState.settings.breakTimerLength;
                } else if (globalState.pomodoroTimerType === "break") {
                  globalState.pomodoroTimerType = "work";
                  globalState.pomodoroTimeLeft =
                    globalState.settings.workTimerLength;
                }
                if (globalState.settings.isBreakAutoStart) {
                  setTimeout(() => {
                    onPlayButtonClick("fab");
                  }, 100);
                }
              }
              return { ...globalState };
            });
            clearTimeout(timerCountTimeout);
            // faviconをデフォルトに戻す
            const link: any = document.querySelector("link[rel*='icon']");
            link.href = "/favicon.ico";
            // 動画をストップ
            stopVideo();
            // 動画IDを更新
            updateVideoId();
            achievedSound.volume = globalState.settings.volume * 0.01;
            achievedSound.play();
            // 通知
            if (window.Notification && Notification.permission === "granted") {
              new Notification("目標時間を達成しました！", {
                body: "タイマーを停止しました。",
              });
            }
            if (globalState.isConnected && globalState.isInRoom) {
              props.sendMessage();
            }
          } else if (
            globalState.settings.isPomodoroEnabled &&
            globalState.pomodoroTimeLeft <= 0
          ) {
            // ポモドーロタイマーのカウントが0以下のとき
            setGlobalState((globalState: any) => {
              globalState.isTimerOn = false;
              // 通知
              if (
                window.Notification &&
                Notification.permission === "granted"
              ) {
                if (globalState.pomodoroTimerType === "work") {
                  new Notification("ポモドーロが終わりました！", {
                    body: globalState.settings.isBreakAutoStart
                      ? "休憩を自動スタートします。"
                      : "タイマーを停止しました。",
                    icon: "/favicon/coffee/apple-touch-icon.png",
                  });
                } else if (globalState.pomodoroTimerType === "break") {
                  new Notification("休憩が終わりました！", {
                    body: "タイマーを停止しました。",
                    icon: "/favicon/tomato/apple-touch-icon.png",
                  });
                }
              }
              // ポモドーロの作業休憩切り替え
              if (globalState.pomodoroTimerType === "work") {
                globalState.pomodoroTimerType = "break";
                globalState.pomodoroTimeLeft =
                  globalState.settings.breakTimerLength;
              } else if (globalState.pomodoroTimerType === "break") {
                globalState.pomodoroTimerType = "work";
                globalState.pomodoroTimeLeft =
                  globalState.settings.workTimerLength;
              }
              if (
                globalState.settings.isBreakAutoStart &&
                globalState.pomodoroTimerType === "break"
              ) {
                setTimeout(() => {
                  onPlayButtonClick("fab");
                }, 100);
              }

              return { ...globalState };
            });
            clearTimeout(timerCountTimeout);
            // faviconをデフォルトに戻す
            const link: any = document.querySelector("link[rel*='icon']");
            link.href = "/favicon.ico";
            // 動画をストップ
            stopVideo();
            // 動画IDを更新
            updateVideoId();
            achievedSound.volume = globalState.settings.volume * 0.01;
            achievedSound.play();
            if (globalState.isConnected && globalState.isInRoom) {
              props.sendMessage();
            }
          } else {
            // チクタク音を鳴らす
            if (globalState.settings.tickVolume === 10) {
              faintTickSound.play();
            } else if (globalState.settings.tickVolume === 50) {
              tickSound.volume = globalState.settings.tickVolume * 0.002;
              tickSound.play();
            } else if (globalState.settings.tickVolume === 100) {
              tickSound.volume = globalState.settings.tickVolume * 0.01;
              tickSound.play();
            }
          }
        }, 2);
      } else if (!globalState.isTimerOn) {
        updateTodoLists(globalState.todoLists);
        clearTimeout(timerCountTimeout);
      }
      return { ...globalState };
    });
  };

  /**
   * 時間の加減算をします。
   * @param {number} count カウント
   */
  const spendTime = (count: number, globalState: any) => {
    // @ts-ignore
    Object.values(globalState.todoLists)
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
            !globalState.settings.isPomodoroEnabled ||
            globalState.pomodoroTimerType !== "break"
          ) {
            item.spentSecond += ONCE_COUNT * count;
            if (item.spentSecond > SPENT_SECOND_MAX) {
              item.spentSecond = SPENT_SECOND_MAX;
            }
          }
          refreshTitle(
            item.content,
            item.spentSecond,
            globalState,
            globalState.settings
          );
        }
        return item;
      });

    if (globalState.settings.isPomodoroEnabled) {
      globalState.pomodoroTimeLeft -= ONCE_COUNT * count;
    }
    return { ...globalState };
  };

  /**
   * 統計を更新します。
   */
  const updateStatistics = (count: number, state: any) => {
    // 日付変更時刻は午前4時
    // 最終更新がない、初めての更新の場合
    if (state.pomodoroTimerType !== "break") {
      if (state.statistics.updatedAt === 0) {
        state.statistics.todaySpentSecond += ONCE_COUNT * count;
      } else {
        const updatedAt = new Date(state.statistics.updatedAt);
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
          state.statistics.todaySpentSecond += ONCE_COUNT * count;
        } else if (now.getDate() - updatedAt.getDate() === 1) {
          // 1日経っていた場合
          state.statistics.yesterdaySpentSecond =
            state.statistics.todaySpentSecond;
          state.statistics.todaySpentSecond = ONCE_COUNT * count;
        } else if (now.getDate() - updatedAt.getDate() > 1) {
          // 2日以上経っていた場合
          state.statistics.yesterdaySpentSecond = 0;
          state.statistics.todaySpentSecond = ONCE_COUNT * count;
        }
      }
      state.statistics.updatedAt = Date.now();
      localStorage.setItem("statistics", JSON.stringify(state.statistics));
    }
    return state.statistics;
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
    if (globalState.isLogined) {
      setIsInSync(true);
    }
    clearTimeout(updateTimeout);
    // @ts-ignore
    updateTimeout = setTimeout(() => {
      if (globalState.isLogined) {
        // DBの設定を取得
        TodoListService.findByTokenId(globalState.tokenId).then((r) => {
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
            setGlobalState((globalState: any) => {
              const newTodoLists =
                // @ts-ignore
                localStorageGetItemTodoListsUpdatedAt > 0
                  ? {
                      ...globalState.todoLists,
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
        setGlobalState((globalState: any) => {
          TodoListService.update(
            globalState.tokenId,
            JSON.stringify(globalState.todoLists)
          );
          return globalState;
        });
      }
    }, 100);
  };

  return (
    <>
      <div style={{ display: "flex" }} id="todoListAndRoom">
        <TodoList
          updateTodoLists={updateTodoLists}
          sendMessage={props.sendMessage}
          onPlayButtonClick={onPlayButtonClick}
        />
        <Room
          sessions={globalState.sessions}
          onEnter={props.onEnter}
          onLeave={props.onLeave}
          sendMessage={props.sendMessage}
        />
      </div>
      {/* タイマー */}
      <TimerRnd
        todoLists={globalState.todoLists}
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
      {/* @ts-ignore */}
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
