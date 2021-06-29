import React, { memo, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Context } from "contexts/Context";
import { SettingsContext } from "contexts/SettingsContext";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "fixed",
    "& > * + *": {
      marginLeft: theme.spacing(2),
    },
  },
  fab: {
    // width: "10rem !important",
    // height: "10rem !important",
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
const CircularDeterminate = memo((props) => {
  const classes = useStyles();
  const [state] = useContext(Context);
  const [settings] = useContext(SettingsContext);

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

  return (
    <div className={classes.root}>
      <CircularProgress
        className={classes.fab}
        variant="determinate"
        value={
          settings.isPomodoroEnabled
            ? state.pomodoroTimerType === "work"
              ? (state.pomodoroTimeLeft / settings.workTimerLength) * -100
              : (state.pomodoroTimeLeft / settings.breakTimerLength) * -100
            : selectedTask !== null && selectedTask.estimatedSecond > 0
            ? (selectedTask.spentSecond / selectedTask.estimatedSecond) * 100
            : 0
        }
        thickness={1}
        style={{
          width: props.width !== "undifined" ? props.width : "",
          height: props.height !== "undifined" ? props.height : "",
          color: settings.isPomodoroEnabled
            ? state.pomodoroTimerType === "work"
              ? "red"
              : "yellow"
            : selectedTask.spentSecond > selectedTask.estimatedSecond
            ? "LightSeaGreen"
            : "orange",
        }}
      />
    </div>
  );
});

export default CircularDeterminate;
