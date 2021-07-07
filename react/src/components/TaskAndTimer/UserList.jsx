import React, { Fragment, memo, useState } from "react";
import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { getAvatarColor } from "utils/color";
import { Skeleton } from "@material-ui/lab";

/** 更新のsetInterval ID */
let refreshInterval = 0;

const useStyles = makeStyles((theme) => ({
  list: {
    overflow: "auto",
    maxHeight: "calc(100vh - 10.5rem)",
  },
  inline: {
    display: "inline",
  },
}));

/**
 * ユーザーリストのコンポーネントです。
 */
const UserList = memo((props) => {
  const classes = useStyles();
  const [dateNow, setDateNow] = useState(Date.now() + 1000);

  // 現在時刻を更新
  clearInterval(refreshInterval);
  refreshInterval = setInterval(() => {
    setDateNow(Date.now() + 1000);
  }, 1000);

  return (
    <>
      <List className={classes.list}>
        {props.sessions.length === 0 && (
          <>
            <Divider />
            <div style={{ display: "flex" }}>
              <div
                style={{
                  width: "5rem",
                  padding: "1rem 0.75rem 0.5rem 0.70rem",
                }}
              >
                <Skeleton variant="circle" width={40} height={40} />
              </div>
              <div
                style={{
                  display: "inline-block",
                  width: "100%",
                  marginTop: "1rem",
                }}
              >
                <div style={{ width: "33%" }}>
                  <Skeleton variant="text" />
                </div>
                <div style={{ width: "66%" }}>
                  <Skeleton variant="text" />
                </div>
              </div>
            </div>
          </>
        )}
        {props.sessions.map((session, index) => {
          return (
            <Fragment key={index}>
              <Divider />
              <ListItem alignItems="flex-start">
                <ListItemAvatar style={{ marginLeft: "-0.4rem" }}>
                  <>
                    <Avatar
                      style={{
                        backgroundColor: getAvatarColor(session.userName),
                        color: "white",
                      }}
                      src={session.imageUrl}
                    >
                      {session.userName.charAt(0).toUpperCase()}
                    </Avatar>
                  </>
                </ListItemAvatar>

                <ListItemText
                  primary={session.userName}
                  secondary={
                    <Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        className={classes.inline}
                        color="textPrimary"
                      >
                        {session.sessionType === "work" && session.isTimerOn
                          ? "🍅" + session.content
                          : ""}
                        {session.sessionType === "break" && session.isTimerOn
                          ? "☕休憩中"
                          : ""}
                        {session.sessionType === "normalWork" &&
                        session.isTimerOn
                          ? "💡" + session.content
                          : ""}
                        {session.sessionType === "afk" ? "🪑離席中" : ""}
                      </Typography>
                      {/* 残り時間 */}
                      {session.isTimerOn && session.finishAt > dateNow && (
                        <>
                          {" - 残り"}
                          {session.finishAt - dateNow > 0
                            ? Math.ceil(
                                (session.finishAt - dateNow) / 1000 / 60
                              )
                            : 0}
                          {"分"}
                        </>
                      )}
                      {/* 経過時間 */}
                      {session.sessionType === "afk" && (
                        <>
                          {" - "}
                          {dateNow - session.startedAt >= 1000 * 60 * 60
                            ? Math.floor(
                                (dateNow - session.startedAt) / 1000 / 60 / 60
                              ) + "時間"
                            : ""}
                          {dateNow - session.startedAt >= 1000 * 60
                            ? Math.floor(
                                ((dateNow - session.startedAt) %
                                  (1000 * 60 * 60)) /
                                  1000 /
                                  60
                              ) + "分"
                            : "0分"}
                          {"経過"}
                        </>
                      )}
                    </Fragment>
                  }
                />
              </ListItem>
            </Fragment>
          );
        })}
      </List>
    </>
  );
});

export default UserList;
