import React, { memo, useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import "./FloatingTimer.css";
import { Context } from "contexts/Context";
import { useTheme, useMediaQuery } from "@material-ui/core";
import StopIcon from "@material-ui/icons/Stop";
import CircularDeterminate from "./CircularDeterminate";
import { SettingsContext } from "contexts/SettingsContext";
import { secondToHHMMSS, secondToHHMMSS_ja } from "utils/convert";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    bottom: 0,
    right: 0,
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  fab: {
    width: "10rem",
    height: "10rem",
    display: "flex !important",
    alignContent: "",
    [theme.breakpoints.down("sm")]: {
      width: "7.5rem",
      height: "7.5rem",
    },
    [theme.breakpoints.down("xs")]: {
      width: "4rem",
      height: "4rem",
    },
  },
  timerCount: {
    [theme.breakpoints.up("md")]: {
      fontSize: "2.75rem",
      marginBottom: "-0.7rem",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "2rem",
      marginBottom: "-0.5rem",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "1rem",
      marginBottom: "-0.5rem",
    },
  },
  playStopIcon: {
    fontSize: "2.75rem",
    marginBottom: "-0.3rem",
    [theme.breakpoints.down("sm")]: {
      fontSize: "2rem",
      marginBottom: "-0.3rem",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "1.5rem",
      marginBottom: "-0.5rem",
    },
  },
  content: {
    whiteSpace: "nowrap",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
}));

/**
 * タイマーのフローティングアクションボタンのコンポーネントです。
 */
const TimerFab = memo((props) => {
  const classes = useStyles();
  const theme = useTheme();
  const [state] = useContext(Context);
  const [settings] = useContext(SettingsContext);
  const useMediaQueryThemeBreakpointsUpMd = useMediaQuery(
    theme.breakpoints.up("md")
  );
  const useMediaQueryThemeBreakpointsDownSm = useMediaQuery(
    theme.breakpoints.down("sm")
  );
  const useMediaQueryThemeBreakpointsDownXs = useMediaQuery(
    theme.breakpoints.down("xs")
  );

  const selectedTask =
    Object.values(props.columns).filter((column, index) => {
      return (
        column.items.filter((item, index) => {
          return item.isSelected;
        })[0] !== undefined
      );
    }).length > 0
      ? Object.values(props.columns)
          .filter((column, index) => {
            return (
              column.items.filter((item, index) => {
                return item.isSelected;
              })[0] !== undefined
            );
          })[0]
          .items.filter((item, index) => {
            return item.isSelected;
          })[0]
      : null;

  /**
   * Fabがクリックされたときの処理です。
   */
  const onFabClick = () => {
    if (!props.isDragging && selectedTask !== null) {
      props.onPlayButtonClick(0, "fab");
    }
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="timer"
        className={classes.fab}
        id="floatingTimer"
        onClick={() => {
          onFabClick();
        }}
        style={{
          width: props.width !== "undifined" ? props.width : "",
          height: props.height !== "undifined" ? props.height : "",
        }}
      >
        {/* 進行状況サークル */}
        <CircularDeterminate
          columns={props.columns}
          width={props.width}
          height={props.height}
        />
        <div style={{ transform: `scale(calc(${parseInt(props.width)}/180))` }}>
          {/* <div style={{ transform: `scale(2)` }}> */}
          {/* カウント */}
          <div className={classes.timerCount}>
            {settings.isPomodoroEnabled &&
              Math.floor(state.pomodoroTimeLeft / 60) +
                ":" +
                (Math.floor(state.pomodoroTimeLeft % 60) < 10
                  ? "0" + Math.floor(state.pomodoroTimeLeft % 60)
                  : Math.floor(state.pomodoroTimeLeft % 60))}
            {/* ポモドーロモードじゃないとき */}
            {!settings.isPomodoroEnabled && selectedTask !== null && (
              <span
                style={{
                  fontSize:
                    selectedTask.spentSecond > 3600
                      ? useMediaQueryThemeBreakpointsUpMd
                        ? "2rem"
                        : useMediaQueryThemeBreakpointsDownXs
                        ? "0.8rem"
                        : useMediaQueryThemeBreakpointsDownSm
                        ? "1.4rem"
                        : ""
                      : useMediaQueryThemeBreakpointsUpMd
                      ? "2.5rem"
                      : useMediaQueryThemeBreakpointsDownXs
                      ? "1rem"
                      : useMediaQueryThemeBreakpointsDownSm
                      ? "1.7rem"
                      : "",
                }}
              >
                {selectedTask.spentSecond < 3600
                  ? secondToHHMMSS(selectedTask.spentSecond).substring(3)
                  : secondToHHMMSS(selectedTask.spentSecond)}
              </span>
            )}
          </div>
          {/* タスク名 */}
          <div className={classes.content}>
            {/* ポモドーロがオン かつ 作業タイマー かつ 選択しているタスクが存在する */}
            {settings.isPomodoroEnabled &&
            state.pomodoroTimerType === "work" &&
            selectedTask !== null
              ? selectedTask.content.length > 10
                ? selectedTask.content.slice(0, 10) + "..."
                : selectedTask.content
              : ""}
            {settings.isPomodoroEnabled &&
              state.pomodoroTimerType === "work" &&
              selectedTask === null && (
                <>
                  <p style={{ margin: "0" }}>タスクが選択</p>
                  されていません
                </>
              )}
            {settings.isPomodoroEnabled && state.pomodoroTimerType === "break"
              ? "休憩"
              : ""}
            {/* ポモドーロモードじゃないとき */}
            {!settings.isPomodoroEnabled &&
              selectedTask !== null &&
              selectedTask.estimatedSecond - selectedTask.spentSecond > 0 && (
                <p style={{ margin: "0" }}>
                  残り
                  {secondToHHMMSS_ja(
                    selectedTask.estimatedSecond - selectedTask.spentSecond
                  )}
                </p>
              )}
            {!settings.isPomodoroEnabled && selectedTask !== null
              ? selectedTask.content.length > 10
                ? selectedTask.content.slice(0, 10) + "..."
                : selectedTask.content
              : ""}
            {!settings.isPomodoroEnabled && selectedTask === null && (
              <>
                <p style={{ margin: "0" }}>タスクが選択</p>
                されていません
              </>
            )}
          </div>
          {/* 再生・停止アイコン */}
          <div>
            {selectedTask !== null && !state.isTimerOn && (
              <>
                <PlayArrowIcon className={classes.playStopIcon} />
              </>
            )}
            {selectedTask !== null && state.isTimerOn && (
              <>
                <StopIcon className={classes.playStopIcon} />
              </>
            )}
          </div>
        </div>
      </Fab>
    </>
  );
});

export default TimerFab;
