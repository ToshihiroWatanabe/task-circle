import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";
import React, { memo } from "react";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
});

const LinearDeterminate = memo(
  (props: { progress: number; color: any; thickness: number }) => {
    const classes = useStyles();
    return (
      <div className={classes.root}>
        <LinearProgress
          variant="determinate"
          value={props.progress}
          color={props.color}
          style={{ height: props.thickness }}
        />
      </div>
    );
  }
);

export default LinearDeterminate;
