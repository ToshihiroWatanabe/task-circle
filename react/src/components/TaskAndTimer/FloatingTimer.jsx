import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import "./FloatingTimer.css";
import { Context } from "contexts/Context";
import { useTheme, Zoom } from "@material-ui/core";
import StopIcon from "@material-ui/icons/Stop";

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
    [theme.breakpoints.up("sm")]: {
      fontSize: "3rem",
      marginBottom: "-0.7rem",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "2rem",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "1rem",
      marginBottom: "-0.5rem",
    },
  },
  playStopIcon: {
    fontSize: "3rem",
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

const FloatingTimer = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const [state, setState] = useContext(Context);

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  /**
   * Fabがクリックされたときの処理です。
   */
  const onFabClick = () => {
    let index = 0;
    Object.values(props.columns)[0].items.map((item, i) => {
      if (item.isSelected) {
        index = i;
      }
      return item;
    });
    props.onPlayButtonClick(index);
  };

  return (
    <div className={classes.root}>
      {state.isModePomodoro && (
        <Zoom
          timeout={transitionDuration}
          in={true}
          style={{
            transitionDelay: `${transitionDuration.exit}ms`,
          }}
          unmountOnExit
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
            <div className={classes.timerCount}>
              {Math.floor(state.pomodoroTimeLeft / 60) +
                ":" +
                (Math.floor(state.pomodoroTimeLeft % 60) < 10
                  ? "0" + Math.floor(state.pomodoroTimeLeft % 60)
                  : Math.floor(state.pomodoroTimeLeft % 60))}
            </div>
            <div className={classes.content}>
              {Object.values(props.columns)[0].items.filter((item, index) => {
                return item.isSelected;
              }).length > 0
                ? Object.values(props.columns)[0].items.filter(
                    (item, index) => {
                      return item.isSelected;
                    }
                  )[0].content.length > 10
                  ? Object.values(props.columns)[0]
                      .items.filter((item, index) => {
                        return item.isSelected;
                      })[0]
                      .content.slice(0, 10) + "..."
                  : Object.values(props.columns)[0].items.filter(
                      (item, index) => {
                        return item.isSelected;
                      }
                    )[0].content
                : ""}
            </div>
            <div>
              {!state.isTimerOn && (
                <>
                  <PlayArrowIcon className={classes.playStopIcon} />
                </>
              )}
              {state.isTimerOn && (
                <>
                  <StopIcon className={classes.playStopIcon} />
                </>
              )}
            </div>
          </Fab>
        </Zoom>
      )}
    </div>
  );
};

export default FloatingTimer;
