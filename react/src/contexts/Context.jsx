import React, { createContext, useState } from "react";

export const Context = createContext([{}, () => {}]);

/**
 * グローバルstateを提供します。
 * @param {*} props
 */
export function ContextProvider(props) {
  const [state, setState] = useState({
    /** Slackに投稿するときの名前 */
    slackUserName: "",
    /** Slack Webhook URL */
    slackWebhookUrl: "",
    /** ユーザーID */
    userId: "",
    /** パスワード */
    password: "",
    /** 日報ID */
    reportId: "",
    /** 日報の更新日時 */
    reportUpdatedAt: "",
    /** 日報 */
    reports: [],
    /** 作成ダイアログ待機中の日報 */
    waitingReport: {},
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
  });

  return (
    <Context.Provider value={[state, setState]}>
      {props.children}
    </Context.Provider>
  );
}
