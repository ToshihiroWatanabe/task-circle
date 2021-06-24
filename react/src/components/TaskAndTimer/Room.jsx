import React, { memo, useState } from "react";
import { makeStyles, Typography, useTheme } from "@material-ui/core";
import { Card } from "@material-ui/core";
import uuid from "uuid/v4";

const sessionsFromBackEnd = [
  {
    id: uuid(),
    name: "ユーザー1",
    sessionType: "work",
    content: "《Java》課題",
    startedAt: Date.now(),
    finishAt: Date.now() + 10 * 1000,
  },
];

const roomsFromBackEnd = {
  [uuid()]: {
    name: "RaiseTech",
    sessions: sessionsFromBackEnd,
  },
};

const useStyles = makeStyles((theme) => ({
  roomCard: {
    width: 320,
    height: "76vh",
    margin: 8,
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
  const [rooms, setRooms] = useState({ ...roomsFromBackEnd });

  return (
    <>
      {Object.entries(rooms).map(([roomId, room], index) => {
        return (
          <Card key={index} className={classes.roomCard}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flexGrow: "1", marginLeft: "0.5rem" }}>
                <Typography>{room.name}</Typography>
              </div>
            </div>
          </Card>
        );
      })}
    </>
  );
});

export default Room;
