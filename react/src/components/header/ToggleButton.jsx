import React, { useContext, memo } from "react";
import { Context } from "contexts/Context";
import { Button } from "@material-ui/core";
import stoppedAudio from "audio/notification_simple-02.mp3";
import { SettingsContext } from "contexts/SettingsContext";

const stoppedSound = new Audio(stoppedAudio);

/**
 * 作業・休憩切り替えボタンの切り替えボタンのコンポーネントです。
 */
const ToggleButton = memo((props) => {
  const [state, setState] = useContext(Context);
  const [settings] = useContext(SettingsContext);

  /**
   * 切り替えボタンがクリックされたときの処理です。
   */
  const onClick = () => {
    setState((state) => {
      if (state.isTimerOn && settings.isPomodoroEnabled) {
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
    if (state.isInRoom) {
      props.sendMessage();
    }
  };

  return (
    <>
      <Button
        onClick={onClick}
        disabled={!settings.isPomodoroEnabled}
        variant="contained"
        style={{
          backgroundColor: "whitesmoke",
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

export default ToggleButton;
