import React from "react";
import { makeStyles, useTheme } from "@material-ui/core";
import { Card } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  roomCard: {
    width: 320,
    height: "76vh",
    margin: 8,
    [theme.breakpoints.down("xs")]: {
      width: "calc(100vw - 2rem)",
      maxWidth: "600px",
    },
  },
}));

/**
 * ルームのコンポーネントです。
 */
const Room = () => {
  const classes = useStyles();
  const theme = useTheme();
  return (
    <>
      <Card className={classes.roomCard}>
        ここにユーザーリストが表示されます
      </Card>
    </>
  );
};

export default Room;
