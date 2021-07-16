import { useMediaQuery, useTheme } from "@material-ui/core";
import Fab from "@material-ui/core/Fab";
import { makeStyles } from "@material-ui/core/styles";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";
import CircularDeterminate from "components/home/CircularDeterminate";
import { SettingsContext } from "contexts/SettingsContext";
import { StateContext } from "contexts/StateContext";
import React, { memo, useContext } from "react";
import { secondToHHMMSS, secondToHHMMSS_ja } from "utils/convert";
import { byteSlice } from "utils/string";
import "./TimerFab.css";

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
  nothingSelected: {
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.5rem",
      marginBottom: "-0.3rem",
    },
  },
}));

/**
 * タイマーのFAB(フローティングアクションボタン)のコンポーネントです。
 */
const TimerFab = memo(
  (props: {
    todoLists: any;
    isDragging: boolean;
    onPlayButtonClick: any;
    width: any;
    height: any;
  }) => {
    const classes = useStyles();
    const theme = useTheme();
    const { state, setState } = useContext(StateContext);
    const { settings, setSettings } = useContext(SettingsContext);
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
      Object.values(props.todoLists).filter((column: any) => {
        return (
          column.items.filter((item: any) => {
            return item.isSelected;
          })[0] !== undefined
        );
      }).length > 0
        ? // @ts-ignore
          Object.values(props.todoLists)
            .filter((column: any) => {
              return (
                column.items.filter((item: any) => {
                  return item.isSelected;
                })[0] !== undefined
              );
            })[0]
            .items.filter((item: any) => {
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
    const onFabContextMenu = (event: any) => {
      event.preventDefault();
      // タイマーがオンの場合はボタンを押させて止める
      setState((state: any) => {
        if (state.isTimerOn) {
          props.onPlayButtonClick(0, "fab");
        }
        return state;
      });
      // 通常タイマー → 作業 → 休憩 → ...
      setTimeout(() => {
        setState((state: any) => {
          setSettings((settings: any) => {
            const newSettings = {
              ...settings,
              isPomodoroEnabled: state.pomodoroTimerType !== "break",
            };
            return newSettings;
          });
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
      }, 1);
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
          <div
            style={{ transform: `scale(calc(${parseInt(props.width)}/180))` }}
          >
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
                      // 1時間以上のとき
                      selectedTask.spentSecond > 3600
                        ? useMediaQueryThemeBreakpointsUpMd
                          ? "2rem"
                          : useMediaQueryThemeBreakpointsDownXs
                          ? "0.8rem"
                          : useMediaQueryThemeBreakpointsDownSm
                          ? "1.4rem"
                          : ""
                        : // 1時間未満のとき
                        useMediaQueryThemeBreakpointsUpMd
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
                ? selectedTask === null
                  ? ""
                  : "休憩"
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
              {selectedTask === null && (
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
  }
);

export default TimerFab;
