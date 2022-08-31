import { Button, useTheme } from "@material-ui/core";
// @ts-ignore
import stoppedAudio from "audio/notification_simple-02.mp3";
import { GlobalStateContext } from "contexts/GlobalStateContext";
import React, { memo, useContext } from "react";
import { DEFAULT_TITLE } from "utils/constant";
import { secondToHHMMSS } from "utils/convert";

const stoppedSound = new Audio(stoppedAudio);

/**
 * 作業・休憩切り替えボタンの切り替えボタンのコンポーネントです。
 */
const TimerToggleButton = memo((props: { sendMessage: any }) => {
  const theme = useTheme();
  const { globalState, setGlobalState } = useContext(GlobalStateContext);

  /**
   * 切り替えボタンがクリックされたときの処理です。
   */
  const onClick = () => {
    setGlobalState((globalState: any) => {
      if (globalState.isTimerOn) {
        globalState.isTimerOn = false;
        // 効果音
        stoppedSound.play();
      }
      if (globalState.pomodoroTimerType === "work") {
        globalState.pomodoroTimerType = "break";
        globalState.pomodoroTimeLeft = globalState.settings.breakTimerLength;
      } else {
        globalState.pomodoroTimerType = "work";
        globalState.pomodoroTimeLeft = globalState.settings.workTimerLength;
      }
      return { ...globalState };
    });
    if (globalState.isTimerOn) {
      refreshTitle("", 0);
    } else {
      document.title = DEFAULT_TITLE;
    }
    if (globalState.isConnected && globalState.isInRoom) {
      props.sendMessage();
    }
  };

  /**
   * ページのタイトルを更新します。
   */
  const refreshTitle = (content: string, spentSecond: number) => {
    setGlobalState((globalState: any) => {
      if (globalState.settings.isPomodoroEnabled) {
        document.title =
          "(" +
          secondToHHMMSS(globalState.pomodoroTimeLeft).substring(3) +
          ") " +
          (globalState.pomodoroTimerType === "work" ? content : "休憩中") +
          " | " +
          DEFAULT_TITLE;
      } else {
        document.title =
          content + " (" + secondToHHMMSS(spentSecond) + ") | " + DEFAULT_TITLE;
      }
      return globalState;
    });
  };

  return (
    <>
      <Button
        onClick={onClick}
        disabled={!globalState.settings.isPomodoroEnabled}
        variant="contained"
        style={{
          backgroundColor:
            theme.palette.type === "light" ? "whitesmoke" : "#555",
          color: theme.palette.type === "light" ? "#000" : "#FFF",
          border:
            globalState.pomodoroTimerType === "work"
              ? "solid 1px yellow"
              : "solid 2px #de2a42",
        }}
      >
        {globalState.pomodoroTimerType === "work" ? "休憩" : "作業"}に切り替える
      </Button>
    </>
  );
});

export default TimerToggleButton;
