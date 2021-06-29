import React, { memo, useContext, useRef, useState } from "react";
import { Divider, makeStyles, useTheme } from "@material-ui/core";
import { Card } from "@material-ui/core";
import uuid from "uuid/v4";
import { Context } from "contexts/Context";
import EnterTheRoom from "./EnterTheRoom";
import RoomHeader from "./RoomHeader";
import UserList from "./UserList";
import SockJsClient from "react-stomp";
import { SOCKET_URL } from "utils/constant";

let myUserName = "";
let mySessionId = "";
let isConnected = false;

const sessionsFromBackEnd = [
  {
    id: uuid(),
    userName: "ユーザー1",
    isTimerOn: true,
    sessionType: "work",
    content: "《Java》課題",
    imageUrl: "",
    startedAt: Date.now(),
    finishAt: Date.now() + 10 * 1000,
  },
  {
    id: uuid(),
    userName: "ユーザー2.000000",
    isTimerOn: true,
    sessionType: "break",
    content: "《Java》課題",
    imageUrl: "",
    startedAt: Date.now(),
    finishAt: Date.now() + 60 * 1000,
  },
];

for (let i = 0; i < 20; i++) {
  sessionsFromBackEnd.push({
    id: uuid(),
    userName: "１２３４５６７８９０１２３４５６７８９０",
    isTimerOn: true,
    sessionType: "work",
    content:
      "《１２３４５６７８９０１２３４５６７８９０１２３４５６７８９０１２３４５６７８９０１２３４５》１２３４５６７８９０１２３４５６７８９０１２３４５６７８９０１２３４５６７８９０１２３４５",
    imageUrl: "",
    startedAt: Date.now() - 20,
    finishAt: Date.now() + i * 60 * 1000,
  });
}

const roomsFromBackEnd = {
  [uuid()]: {
    name: "ルーム",
    // sessions: sessionsFromBackEnd,
    sessions: [],
  },
};

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
    isConnected = true;
  };

  const onDisconnected = () => {
    console.log("サーバーとの接続が切れました。");
    isConnected = false;
    myUserName = "";
    mySessionId = "";
    setSessions([]);
  };

  const onSessionMessageReceived = (message) => {
    console.log(message);
    if (mySessionId === "" && message.userName === myUserName) {
      mySessionId = message.sessionId;
    }
    setSessions((sessions) => {
      return [
        ...sessions,
        { sessionId: message.sessionId, userName: message.userName },
      ];
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
    myUserName = name;
    $websocket.current.sendMessage(
      "/session/enter",
      JSON.stringify({ userName: name })
    );
  };

  const onLeave = () => {
    myUserName = "";
    mySessionId = "";
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
