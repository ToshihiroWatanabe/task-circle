import React, { Fragment, memo, useState } from "react";
import {
  Avatar,
  Box,
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
        {props.sessions.map((session, index) => {
          return (
            <Fragment key={index}>
              <Divider />
              <ListItem alignItems="flex-start">
                <ListItemAvatar style={{ marginLeft: "-0.4rem" }}>
                  <>
                    {/* {index === 0 && (
                      <Skeleton variant="circle" width={40} height={40} />
                    )}
                    {index > 0 && ( */}
                    <Avatar
                      style={{
                        backgroundColor: getAvatarColor(session.userName),
                      }}
                      src={session.imageUrl}
                    >
                      {session.userName.charAt(0).toUpperCase()}
                    </Avatar>
                    {/* )} */}
                  </>
                </ListItemAvatar>
                {/* {index === 0 && (
                  <div style={{ display: "inline-block", width: "100%" }}>
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                  </div>
                )} */}
                {/* {index > 0 && ( */}
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
                      {session.isTimerOn && session.finishAt > 0 && (
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
                    </Fragment>
                  }
                />
                {/* )} */}
              </ListItem>
            </Fragment>
          );
        })}
      </List>
    </>
  );
});

export default UserList;
