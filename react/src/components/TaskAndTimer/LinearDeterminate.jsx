import React, { memo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
});

const LinearDeterminate = memo((props) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <LinearProgress
        variant="determinate"
        value={props.progress}
        color={props.color}
      />
    </div>
  );
});

export default LinearDeterminate;
