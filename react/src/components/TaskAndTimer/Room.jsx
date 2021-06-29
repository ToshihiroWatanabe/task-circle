import React, { memo, useContext, useRef, useState } from "react";
import { Divider, makeStyles, useTheme } from "@material-ui/core";
import { Card } from "@material-ui/core";
import { Context } from "contexts/Context";
import EnterTheRoom from "./EnterTheRoom";
import RoomHeader from "./RoomHeader";
import UserList from "./UserList";
import SockJsClient from "react-stomp";
import { SOCKET_URL } from "utils/constant";

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
const Room = memo(() => {
  const classes = useStyles();
  const theme = useTheme();
  const [state, setState] = useContext(Context);
  const [sessions, setSessions] = useState([]);
  const $websocket = useRef(null);

  const onConnected = () => {
    console.log("サーバーに接続しました。");
  };

  const onDisconnected = () => {
    console.log("サーバーとの接続が切れました。");
    setState((state) => {
      return { ...state, nameInRoom: "" };
    });
    setSessions([]);
  };

  const onSessionMessageReceived = (message) => {
    console.log(message);
    setSessions((sessions) => {
      let newSessions = [
        ...sessions,
        {
          sessionId: message.sessionId,
          userName: message.userName,
          sessionType: message.sessionType,
          content: message.content,
          isTimerOn: message.isTimerOn,
          startedAt: message.startedAt,
          finishAt: message.finishAt,
        },
      ];
      // sessionIdの重複を削除
      newSessions = newSessions.filter((element, index, array) => {
        return (
          array.findIndex(
            (element2) => element.sessionId === element2.sessionId
          ) === index
        );
      });
      return newSessions;
    });
  };

  const onLeaveMessageReceived = (message) => {
    console.log(message);
    setSessions((sessions) => {
      const newSessions = sessions.filter((session, index) => {
        return session.sessionId !== message.sessionId;
      });
      return [...newSessions];
    });
  };

  const onEnter = (name) => {
    setState((state) => {
      return { ...state, nameInRoom: name };
    });
    $websocket.current.sendMessage(
      "/session/enter",
      JSON.stringify({ userName: name })
    );
  };

  const onLeave = () => {
    setState((state) => {
      return { ...state, nameInRoom: "" };
    });
    setSessions([]);
    $websocket.current.sendMessage("/session/leave", JSON.stringify({}));
  };

  return (
    <>
      <Card className={classes.roomCard}>
        <RoomHeader sessions={sessions} onLeave={onLeave} />
        <Divider style={{ margin: "0.25rem 0" }} />
        {/* 入室前 */}
        {!state.isInRoom && <EnterTheRoom onEnter={onEnter} />}
        {/* 入室後 */}
        {state.isInRoom && <UserList sessions={sessions} />}
      </Card>

      <SockJsClient
        url={SOCKET_URL}
        topics={["/topic/session"]}
        onConnect={onConnected}
        onDisconnect={onDisconnected}
        onMessage={(msg) => onSessionMessageReceived(msg)}
        ref={$websocket}
      />
      <SockJsClient
        url={SOCKET_URL}
        topics={["/topic/session/leave"]}
        onMessage={(msg) => onLeaveMessageReceived(msg)}
      />
    </>
  );
});

export default Room;
