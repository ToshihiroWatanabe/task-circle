import React, { createContext, useState } from "react";

export const SettingsContext = createContext([{}, () => {}]);

/**
 * 設定のグローバルstateを提供します。
 * @param {*} props
 */
export function SettingsContextProvider(props) {
  // 設定
  const [settings, setSettings] = useState({
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
  });

  return (
    <SettingsContext.Provider value={[settings, setSettings]}>
      {props.children}
    </SettingsContext.Provider>
  );
}