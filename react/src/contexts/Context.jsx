import React, { createContext, useState } from "react";

export const Context = createContext([{}, () => {}]);

/**
 * グローバルstateを提供します。
 * @param {*} props
 * @returns
 */
export function ContextProvider(props) {
  /** グローバルstate */
  const [state, setState] = useState({
    // Slackに投稿するときの名前
    slackUserName: "",
    // Slack Webhook URL
    slackWebhookUrl: "",
    // ユーザーID
    userId: "",
    // パスワード
    password: "",
    // 日報ID
    reportId: "",
    // 日報の更新日時
    reportUpdatedAt: "",
    // 日報
    reports: [],
    // 作成ダイアログ待機中の日報
    waitingReport: {},
    // タイマーがオンかどうか
    isTimerOn: false,
  });

  return (
    <Context.Provider value={[state, setState]}>
      {props.children}
    </Context.Provider>
  );
}
