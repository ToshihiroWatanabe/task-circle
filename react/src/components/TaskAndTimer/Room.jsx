import React, { memo, useContext } from "react";
import { Divider, makeStyles, useTheme } from "@material-ui/core";
import { Card } from "@material-ui/core";
import { Context } from "contexts/Context";
import EnterTheRoom from "./EnterTheRoom";
import RoomHeader from "./RoomHeader";
import UserList from "./UserList";

const useStyles = makeStyles((theme) => ({
  roomCard: {
    minWidth: 320,
    maxWidth: 320,
    height: "fit-content",
    margin: 8,
    padding: 8,
    [theme.breakpoints.down("xs")]: {
      minWidth: "calc(100vw - 2rem)",
      maxWidth: "600px",
    },
  },
}));

/**
 * ルームのコンポーネントです。
 */
const Room = memo((props) => {
  const classes = useStyles();
  const theme = useTheme();
  const [state, setState] = useContext(Context);

  return (
    <>
      <Card className={classes.roomCard}>
        <RoomHeader
          sessions={props.sessions}
          onLeave={props.onLeave}
          sendMessage={props.sendMessage}
        />
        {/* 入室前 */}
        {!state.isInRoom && (
          <EnterTheRoom
            onEnter={props.onEnter}
            isConnected={state.isConnected}
          />
        )}
        {/* 入室後 */}
        {state.isInRoom && <UserList sessions={props.sessions} />}
      </Card>
    </>
  );
});

export default Room;
