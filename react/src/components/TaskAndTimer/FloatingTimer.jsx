import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import "./FloatingTimer.css";
import { Context } from "contexts/Context";

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
      width: "5rem",
      height: "5rem",
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
    },
  },
  playStopIcon: {
    fontSize: "3rem",
    [theme.breakpoints.down("sm")]: {
      fontSize: "2rem",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "1.5rem",
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
  const [state, setState] = useContext(Context);

  return (
    <div className={classes.root}>
      {state.isModePomodoro && (
        <Fab
          color="primary"
          aria-label="timer"
          className={classes.fab}
          id="floatingTimer"
        >
          <div className={classes.timerCount}>25:00</div>
          <div className={classes.content}>
            {Object.values(props.columns)[0].items.filter((item, index) => {
              return item.isSelected;
            }).length > 0
              ? Object.values(props.columns)[0].items.filter((item, index) => {
                  return item.isSelected;
                })[0].content.length > 10
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
            <PlayArrowIcon className={classes.playStopIcon} />
          </div>
        </Fab>
      )}
    </div>
  );
};

export default FloatingTimer;
