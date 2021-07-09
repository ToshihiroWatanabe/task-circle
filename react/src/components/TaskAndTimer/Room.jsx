import React, { memo, useContext } from "react";
import { Box, makeStyles, useTheme } from "@material-ui/core";
import { Card } from "@material-ui/core";
import { StateContext } from "contexts/StateContext";
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
  const theme = useTheme();
  const classes = useStyles();
  const [state, setState] = useContext(StateContext);

  return (
    <>
      <Card
        className={classes.roomCard}
        style={{ paddingBottom: state.isInRoom ? 0 : "" }}
      >
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
        {state.isInRoom && !state.isConnected && (
          <>サーバーとの接続が切れました。</>
        )}
        {state.isInRoom && <UserList sessions={props.sessions} />}
      </Card>
      <div
        style={{ minWidth: theme.spacing(1), width: theme.spacing(1) }}
      ></div>
    </>
  );
});

export default Room;
