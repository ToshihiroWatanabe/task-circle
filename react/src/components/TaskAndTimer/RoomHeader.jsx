import React, { useContext } from "react";
import {
  Box,
  Button,
  IconButton,
  makeStyles,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { Context } from "contexts/Context";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import PersonIcon from "@material-ui/icons/Person";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
}));

/**
 * ルームのヘッダーのコンポーネントです。
 */
const RoomHeader = (props) => {
  const classes = useStyles();
  const [state, setState] = useContext(Context);

  /**
   * 退室ボタンがクリックされたときの処理です。
   */
  const onExitButtonClick = () => {
    setState((state) => {
      return { ...state, isInRoom: false };
    });
  };
  return (
    <div className={classes.root}>
      <div style={{ flexGrow: "1", display: "flex" }}>
        <Typography component="span">ルーム</Typography>
        {state.isInRoom && (
          <>
            <PersonIcon
              fontSize="inherit"
              style={{ marginLeft: "1rem", marginTop: "0.3rem" }}
            />
            <Typography>{props.room.sessions.length}人</Typography>
          </>
        )}
      </div>
      {state.isInRoom && (
        <>
          <Button size="small">離席</Button>
          <Tooltip title="退室する">
            <IconButton
              size="small"
              color="inherit"
              onClick={onExitButtonClick}
            >
              <ExitToAppIcon />
            </IconButton>
          </Tooltip>
        </>
      )}
    </div>
  );
};

export default RoomHeader;
