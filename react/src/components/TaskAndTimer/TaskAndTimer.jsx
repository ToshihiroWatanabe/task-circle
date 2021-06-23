import React, { memo } from "react";
import { makeStyles, useTheme } from "@material-ui/core";
import TodoList from "./TodoList";
import Room from "./Room";

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
}));

/**
 * タスク＆タイマーページのコンポーネントです。
 */
const TaskAndTimer = memo(() => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <>
      <div className={classes.root}>
        <TodoList />
        <Room />
      </div>
    </>
  );
});

export default TaskAndTimer;
