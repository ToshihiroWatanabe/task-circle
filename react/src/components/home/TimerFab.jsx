import React, { memo, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import "./TimerFab.css";
import { useTheme, useMediaQuery } from "@material-ui/core";
import StopIcon from "@material-ui/icons/Stop";
import CircularDeterminate from "components/home/CircularDeterminate";
import { StateContext } from "contexts/StateContext";
import { SettingsContext } from "contexts/SettingsContext";
import { secondToHHMMSS, secondToHHMMSS_ja } from "utils/convert";
import { byteSlice } from "utils/string";

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
 * タイマーのFAB(フローティングアクションボタン)のコンポーネントです。
 */
const TimerFab = memo((props) => {
  const classes = useStyles();
  const theme = useTheme();
  const [state, setState] = useContext(StateContext);
  const [settings, setSettings] = useContext(SettingsContext);
  const useMediaQueryThemeBreakpointsUpMd = useMediaQuery(
    theme.breakpoints.up("md")
  );
  const useMediaQueryThemeBreakpointsDownSm = useMediaQuery(
    theme.breakpoints.down("sm")
  );
  const useMediaQueryThemeBreakpointsDownXs = useMediaQuery(
    theme.breakpoints.down("xs")
  );

  /** 選択されているタスク */
  const selectedTask =
    Object.values(props.todoLists).filter((column, index) => {
      return (
        column.items.filter((item, index) => {
          return item.isSelected;
        })[0] !== undefined
      );
    }).length > 0
      ? Object.values(props.todoLists)
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
   * FABがクリックされたときの処理です。
   */
  const onFabClick = () => {
    if (!props.isDragging && selectedTask !== null) {
      props.onPlayButtonClick(0, "fab");
    }
  };

  /**
   * FABが右クリックされたときの処理です。
   */
  const onFabContextMenu = (event) => {
    event.preventDefault();
    // 通常タイマー → 作業 → 休憩 → ...
    setSettings((settings) => {
      setState((state) => {
        if (state.isTimerOn) {
          props.onPlayButtonClick(0, "fab");
        }
        const newState = {
          ...state,
          pomodoroTimerType:
            settings.isPomodoroEnabled && state.pomodoroTimerType === "work"
              ? "break"
              : "work",
          pomodoroTimeLeft:
            settings.isPomodoroEnabled && state.pomodoroTimerType === "work"
              ? settings.breakTimerLength
              : settings.workTimerLength,
        };
        return newState;
      });
      const newSettings = {
        ...settings,
        isPomodoroEnabled: state.pomodoroTimerType === "break" ? false : true,
      };
      return newSettings;
    });
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="timer"
        className={classes.fab}
        id="timerFab"
        onClick={() => {
          onFabClick();
        }}
        onContextMenu={(event) => {
          onFabContextMenu(event);
        }}
        style={{
          width: props.width !== "undifined" ? props.width : "",
          height: props.height !== "undifined" ? props.height : "",
        }}
      >
        {/* 進行状況サークル */}
        <CircularDeterminate
          todoLists={props.todoLists}
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
            {/* ポモドーロモードでないとき */}
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
            {/* ポモドーロがオン かつ 作業タイマー かつ 選択しているタスクが存在するとき */}
            {settings.isPomodoroEnabled &&
            state.pomodoroTimerType === "work" &&
            selectedTask !== null
              ? byteSlice(selectedTask.content, 20)
              : ""}
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
              ? byteSlice(selectedTask.content, 20)
              : ""}
          </div>
          {/* タスクが選択されていません */}
          <div className={classes.nothingSelected}>
            {settings.isPomodoroEnabled &&
              state.pomodoroTimerType === "work" &&
              selectedTask === null && (
                <>
                  <p style={{ margin: "0" }}>タスクが選択</p>
                  されていません
                </>
              )}
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
