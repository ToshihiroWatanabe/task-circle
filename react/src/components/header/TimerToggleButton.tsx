import { Button, useTheme } from "@material-ui/core";
// @ts-ignore
import stoppedAudio from "audio/notification_simple-02.mp3";
import { SettingsContext } from "contexts/SettingsContext";
import { StateContext } from "contexts/StateContext";
import React, { memo, useContext } from "react";
import { DEFAULT_TITLE } from "utils/constant";
import { secondToHHMMSS } from "utils/convert";

const stoppedSound = new Audio(stoppedAudio);

/**
 * 作業・休憩切り替えボタンの切り替えボタンのコンポーネントです。
 */
const TimerToggleButton = memo((props: { sendMessage: any }) => {
  const theme = useTheme();
  const { state, setState } = useContext(StateContext);
  const { settings } = useContext(SettingsContext);

  /**
   * 切り替えボタンがクリックされたときの処理です。
   */
  const onClick = () => {
    setState((state: any) => {
      if (state.isTimerOn) {
        state.isTimerOn = false;
        // 効果音
        stoppedSound.play();
      }
      if (state.pomodoroTimerType === "work") {
        state.pomodoroTimerType = "break";
        state.pomodoroTimeLeft = settings.breakTimerLength;
      } else {
        state.pomodoroTimerType = "work";
        state.pomodoroTimeLeft = settings.workTimerLength;
      }
      return { ...state };
    });
    if (state.isTimerOn) {
      refreshTitle("", 0);
    } else {
      document.title = DEFAULT_TITLE;
    }
    if (state.isConnected && state.isInRoom) {
      props.sendMessage();
    }
  };

  /**
   * ページのタイトルを更新します。
   */
  const refreshTitle = (content: string, spentSecond: number) => {
    setState((state: any) => {
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
      return state;
    });
  };

  return (
    <>
      <Button
        onClick={onClick}
        disabled={!settings.isPomodoroEnabled}
        variant="contained"
        style={{
          backgroundColor:
            theme.palette.type === "light" ? "whitesmoke" : "#555",
          color: theme.palette.type === "light" ? "#000" : "#FFF",
          border:
            state.pomodoroTimerType === "work"
              ? "solid 1px yellow"
              : "solid 2px red",
        }}
      >
        {state.pomodoroTimerType === "work" ? "休憩" : "作業"}に切り替える
      </Button>
    </>
  );
});

export default TimerToggleButton;
