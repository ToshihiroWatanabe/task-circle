import React, { memo, useContext, useState } from "react";
import { Divider, makeStyles, Typography, useTheme } from "@material-ui/core";
import { Card } from "@material-ui/core";
import uuid from "uuid/v4";
import { Context } from "contexts/Context";
import EnterTheRoom from "./EnterTheRoom";
import RoomHeader from "./RoomHeader";
import UserList from "./UserList";

const sessionsFromBackEnd = [
  {
    id: uuid(),
    name: "ユーザー1",
    isTimerOn: true,
    sessionType: "work",
    content: "《Java》課題",
    startedAt: Date.now(),
    finishAt: Date.now() + 10 * 1000,
  },
  {
    id: uuid(),
    name: "ユーザー2.000000",
    isTimerOn: true,
    sessionType: "break",
    content: "《Java》課題",
    startedAt: Date.now(),
    finishAt: Date.now() + 60 * 1000,
  },
];

for (let i = 0; i < 20; i++) {
  sessionsFromBackEnd.push({
    id: uuid(),
    name: "１２３４５６７８９０１２３４５６７８９０",
    isTimerOn: true,
    sessionType: "work",
    content:
      "《１２３４５６７８９０１２３４５６７８９０１２３４５６７８９０１２３４５６７８９０１２３４５》１２３４５６７８９０１２３４５６７８９０１２３４５６７８９０１２３４５６７８９０１２３４５",
    startedAt: Date.now() - 20,
    finishAt: Date.now() + i * 1000,
  });
}

const roomsFromBackEnd = {
  [uuid()]: {
    name: "ルーム",
    sessions: sessionsFromBackEnd,
  },
};

const useStyles = makeStyles((theme) => ({
  roomCard: {
    width: 320,
    height: "fit-content",
    margin: 8,
    padding: 8,
    [theme.breakpoints.down("sm")]: {
      width: "calc(100vw - 2rem)",
      maxWidth: "480px",
    },
    [theme.breakpoints.down("xs")]: {
      width: "calc(100vw - 2rem)",
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
  const [rooms, setRooms] = useState({ ...roomsFromBackEnd });

  return (
    <>
      {Object.entries(rooms).map(([roomId, room], index) => {
        return (
          <Card key={index} className={classes.roomCard}>
            <RoomHeader room={room} />
            <Divider style={{ margin: "0.25rem 0" }} />
            {/* 入室前 */}
            {!state.isInRoom && <EnterTheRoom />}
            {/* 入室後 */}
            {state.isInRoom && <UserList room={room} />}
          </Card>
        );
      })}
    </>
  );
});

export default Room;
