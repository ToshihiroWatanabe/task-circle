import React, { useContext, useEffect, useState } from "react";
import { Context } from "contexts/Context";
import { Button } from "@material-ui/core";

/**
 * 作業・休憩切り替えボタンの切り替えボタンのコンポーネントです。
 */
export default function ToggleButton() {
  const [state, setState] = useContext(Context);

  /**
   * 切り替えボタンがクリックされたときの処理です。
   */
  const onClick = () => {
    setState((state) => {
      if (state.pomodoroTimerType === "work") {
        state.pomodoroTimerType = "break";
        state.pomodoroTimeLeft = state.breakTimerLength;
      } else {
        state.pomodoroTimerType = "work";
        state.pomodoroTimeLeft = state.workTimerLength;
      }
      return { ...state };
    });
  };

  return (
    <>
      <Button
        onClick={onClick}
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
}
