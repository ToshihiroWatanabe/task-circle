import { Card, makeStyles, useTheme } from "@material-ui/core";
import RoomEnter from "components/home/RoomEnter";
import RoomHeader from "components/home/RoomHeader";
import RoomUserList from "components/home/RoomUserList";
import { StateContext } from "contexts/StateContext";
import React, { memo, useContext } from "react";

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
const Room = memo(
  (props: { sessions: any; onLeave: any; sendMessage: any; onEnter: any }) => {
    const theme = useTheme();
    const classes = useStyles();
    const { state } = useContext(StateContext);

    return (
      <>
        <Card
          className={classes.roomCard}
          style={{ paddingBottom: state.isInRoom ? 0 : "" }}
        >
          <RoomHeader
            // @ts-ignore
            sessions={props.sessions}
            onLeave={props.onLeave}
            sendMessage={props.sendMessage}
          />
          {/* 入室前 */}
          {!state.isInRoom && (
            <RoomEnter
              onEnter={props.onEnter}
              // @ts-ignore
              isConnected={state.isConnected}
            />
          )}
          {/* 入室後 */}
          {state.isInRoom && !state.isConnected && (
            <>サーバーとの接続が切れました。</>
          )}
          {state.isInRoom && (
            <RoomUserList
              // @ts-ignore
              sessions={props.sessions}
            />
          )}
        </Card>
        <div
          style={{ minWidth: theme.spacing(1), width: theme.spacing(1) }}
        ></div>
      </>
    );
  }
);

export default Room;
