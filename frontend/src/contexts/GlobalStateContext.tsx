import React, { createContext, memo, useState } from "react";

export const GlobalStateContext = createContext(
  {} as {
    globalState: any;
    setGlobalState: React.Dispatch<React.SetStateAction<any>>;
  }
);

/**
 * グローバルstateを提供します。
 * @param {*} props
 */
export const GlobalStateContextProvider = memo((props) => {
  const [globalState, setGlobalState] = useState({
    /** タイマーがオンかどうか */
    isTimerOn: false,
    /** ポモドーロタイマーの残り時間 */
    pomodoroTimeLeft: 25 * 60,
    /** ポモドーロタイマーのタイプ */
    pomodoroTimerType: "work",
    /** WebSocketが接続されたかどうか */
    isConnected: false,
    /** 入室しているかどうか */
    isInRoom: false,
    /** 離席しているかどうか */
    isAfk: false,
    /** ルームでの名前 */
    nameInRoom: "",
    /** ログインしているかどうか */
    isLogined: false,
    /** トークンID */
    tokenId: "",
    /** メールアドレス */
    email: "",
    /** ToDoリスト */
    todoLists: {},
    /** セッション */
    sessions: [],
    /** 設定 */
    settings: {
      /** ポモドーロモードがオンかどうか */
      isPomodoroEnabled: false,
      /** 休憩を自動スタートするかどうか */
      isBreakAutoStart: true,
      /** 作業タイマーの時間(秒) */
      workTimerLength: 25 * 60,
      /** 休憩タイマーの時間(秒) */
      breakTimerLength: 5 * 60,
      /** 作業用BGMのURL */
      workVideoUrl: "",
      /** 作業用BGMの音量(%) */
      workVideoVolume: 100,
      /** 休憩用BGMのURL */
      breakVideoUrl: "",
      /** 休憩用BGMの音量(%) */
      breakVideoVolume: 100,
      /** チクタク音の音量(%) */
      tickVolume: 10,
      /** 開始・停止・アラーム音量(%) */
      volume: 100,
      /** 時間のフォーマット(クリップボードへのコピー時) */
      timeFormatToClipboard: "HH:MM:SS",
      /** ツイートボタンが有効かどうか */
      isTweetButtonEnabled: false,
      /** ツイート時の定型文 */
      tweetTemplate: "#TaskCircle",
    },
    /** 個人の統計 */
    statistics: {
      // 本日の経過時間(秒)
      todaySpentSecond: 0,
      // 昨日の経過時間(秒)
      yesterdaySpentSecond: 0,
      // 最終更新
      updatedAt: 0,
    },
  });

  return (
    <GlobalStateContext.Provider value={{ globalState, setGlobalState }}>
      {props.children}
    </GlobalStateContext.Provider>
  );
});
