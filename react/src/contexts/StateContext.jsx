import React, { createContext, useState } from "react";

export const StateContext = createContext([{}, () => {}]);

/**
 * グローバルstateを提供します。
 * @param {*} props
 */
export function StateContextProvider(props) {
  const [state, setState] = useState({
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
    /** ログインしているかどうか */
    isLogined: false,
    /** トークンID */
    tokenId: "",
    /** メールアドレス */
    email: "",
  });

  return (
    <StateContext.Provider value={[state, setState]}>
      {props.children}
    </StateContext.Provider>
  );
}