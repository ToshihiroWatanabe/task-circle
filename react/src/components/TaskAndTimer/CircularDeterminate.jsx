import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Context } from "contexts/Context";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "fixed",
    "& > * + *": {
      marginLeft: theme.spacing(2),
    },
  },
  fab: {
    width: "10rem !important",
    height: "10rem !important",
    position: "absolute",
    right: 0,
    bottom: 0,
    [theme.breakpoints.down("sm")]: {
      width: "7.5rem !important",
      height: "7.5rem !important",
    },
    [theme.breakpoints.down("xs")]: {
      width: "4rem !important",
      height: "4rem !important",
    },
  },
}));

/**
 * 進行状況サークルのコンポーネントです。
 */
const CircularDeterminate = () => {
  const classes = useStyles();
  const [state] = useContext(Context);

  return (
    <div className={classes.root}>
      <CircularProgress
        className={classes.fab}
        variant="determinate"
        value={
          state.pomodoroTimerType === "Work"
            ? (state.pomodoroTimeLeft / state.workTimerLength) * -100
            : (state.pomodoroTimeLeft / state.breakTimerLength) * -100
        }
        thickness={1}
        style={{ color: state.pomodoroTimerType === "Work" ? "red" : "yellow" }}
      />
    </div>
  );
};

export default CircularDeterminate;
