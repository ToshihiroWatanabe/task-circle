import React, { useContext } from "react";
import { makeStyles, Typography } from "@material-ui/core";
import { Context } from "contexts/Context";

const useStyles = makeStyles((theme) => ({
  root: {
    // margin: theme.spacing(1),
  },
}));

/**
 * ルームのヘッダーのコンポーネントです。
 */
const RoomHeader = (props) => {
  const classes = useStyles();
  const [state, setState] = useContext(Context);
  return (
    <div className={classes.root}>
      <Typography>ルーム</Typography>
    </div>
  );
};

export default RoomHeader;
