import React from "react";
import { Divider, List, ListItem } from "@material-ui/core";

/**
 * ユーザーリストのコンポーネントです。
 */
const UserList = (props) => {
  return (
    <>
      <List>
        {props.room.sessions.map((session, index) => {
          return (
            <>
              {index !== 0 && <Divider />}
              <ListItem>{session.name}</ListItem>
            </>
          );
        })}
      </List>
    </>
  );
};

export default UserList;
