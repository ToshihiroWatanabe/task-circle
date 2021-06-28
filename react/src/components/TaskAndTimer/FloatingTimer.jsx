import React, { memo, useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import "./FloatingTimer.css";
import { Context } from "contexts/Context";
import { useTheme, Zoom, useMediaQuery } from "@material-ui/core";
import StopIcon from "@material-ui/icons/Stop";
import CircularDeterminate from "./CircularDeterminate";
import { SettingsContext } from "contexts/SettingsContext";
import { secondToHHMMSS, secondToHHMMSS_ja } from "utils/convert";
import { Rnd } from "react-rnd";

const DEFAULT_WIDTH = 180;
const DEFAULT_HEIGHT = 180;
const MIN_WIDTH = 180;
const MIN_HEIGHT = 180;

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

const FloatingTimer = memo((props) => {
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

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

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
    if (!isDragging && selectedTask !== null) {
      props.onPlayButtonClick(0, "fab");
    }
  };

  const [positionX, setPositionX] = useState(
    document.documentElement.clientWidth / 2 - DEFAULT_WIDTH / 2
  );
  const [positionY, setPositionY] = useState(
    document.documentElement.clientHeight - DEFAULT_HEIGHT - DEFAULT_HEIGHT / 2
  );
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [isDragging, setIsDragging] = useState(false);

  const onResizeStop = (e, dir, refToElement, delta, position) => {
    let count = 0;
    setWidth((width) => {
      setPositionX((positionX) => {
        setHeight((height) => {
          if (count === 0) {
            height =
              height + delta.height > window.innerHeight * 0.9
                ? window.innerHeight * 0.9
                : height + delta.height;
            setPositionY(
              document.documentElement.clientHeight -
                height -
                DEFAULT_HEIGHT / 2
            );
            count++;
          }
          return height;
        });
        return position.x > window.innerWidth * 0.9
          ? window.innerWidth * 0.9
          : position.x;
      });
      console.log(width, delta.width);
      width =
        width + delta.width > window.innerWidth * 0.9
          ? window.innerWidth * 0.9
          : width + delta.width;
      console.log(width);
      return width;
    });
  };

  const onDragStop = (e, d) => {
    setTimeout(() => {
      setIsDragging(false);
    }, 1);
    setPositionX(
      d.x > 0
        ? d.x < window.innerWidth - width
          ? d.x
          : window.innerWidth - width
        : 0
    );
  };

  return (
    <>
      {/* <div className={classes.root}> */}
      {/* <Zoom
        timeout={transitionDuration}
        in={true}
        style={{
          transitionDelay: `${transitionDuration.exit}ms`,
        }}
        unmountOnExit
      > */}
      <Rnd
        dragAxis="x"
        minWidth={MIN_WIDTH}
        minHeight={MIN_HEIGHT}
        maxWidth={window.innerWidth * 0.9}
        maxHeight={window.innerHeight * 0.9}
        lockAspectRatio={true}
        onResizeStop={onResizeStop}
        onDrag={() => {
          setIsDragging(true);
        }}
        onDragStop={onDragStop}
        position={{ x: positionX, y: positionY }}
        default={{
          width: DEFAULT_WIDTH,
          height: DEFAULT_HEIGHT,
        }}
        style={{
          display: "flex",
          posision: "fixed",
          bottom: "0",
          alignItems: "center",
          justifyContent: "center",
          border: "solid 1px #ddd",
          borderRadius: "8px",
          background: "#f0f0f0",
          zIndex: "1",
          padding: "8px",
        }}
      >
        <Fab
          color="primary"
          aria-label="timer"
          className={classes.fab}
          id="floatingTimer"
          onClick={() => {
            onFabClick();
          }}
        >
          {/* 進行状況サークル */}
          <CircularDeterminate columns={props.columns} />
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
        </Fab>
      </Rnd>
      {/* </Zoom> */}
      {/* </div> */}
    </>
  );
});

export default FloatingTimer;
