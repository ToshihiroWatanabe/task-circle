import React, { Fragment, memo } from "react";
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
                    style={{ backgroundColor: getAvatarColor(session.name) }}
                    src={session.imageUrl}
                  >
                    {session.name.charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={session.name}
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
                      {/* {key.remaining !== 0 && session.isTimerOn
                        ? " — 残り" +
                          parseInt(key.remaining / 60 + 0.999) +
                          "分"
                        : ""} */}{" "}
                      - 残り1分
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
