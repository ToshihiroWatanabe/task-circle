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

/** 更新のsetInterval ID */
let refreshInterval = 0;

const useStyles = makeStyles((theme) => ({
  list: {
    overflow: "auto",
    maxHeight: "77vh",
  },
  listItem: {},
  inline: {
    display: "inline",
  },
}));

/**
 * ユーザーリストのコンポーネントです。
 */
const UserList = memo((props) => {
  const classes = useStyles();
  const [dateNow, setDateNow] = useState(Date.now());

  // 現在時刻を更新
  refreshInterval = setInterval(() => {
    setDateNow(Date.now());
  }, 5000);

  return (
    <>
      <List className={classes.list}>
        {props.room.sessions.map((session, index) => {
          return (
            <Fragment key={index}>
              {index !== 0 && <Divider />}
              <ListItem alignItems="flex-start" className={classes.listItem}>
                <ListItemAvatar style={{ marginLeft: "-0.4rem" }}>
                  <Avatar
                    style={{
                      backgroundColor: getAvatarColor(session.userName),
                    }}
                    src={session.imageUrl}
                  >
                    {session.userName.charAt(0).toUpperCase()}
                  </Avatar>
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
                      </Typography>
                      {" - 残り"}
                      {session.finishAt - dateNow > 0
                        ? Math.ceil((session.finishAt - dateNow) / 1000 / 60)
                        : 0}
                      {"分"}
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
