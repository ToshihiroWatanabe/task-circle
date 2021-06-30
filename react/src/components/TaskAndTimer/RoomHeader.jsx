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
    props.onLeave();
    setState((state) => {
      return { ...state, isInRoom: false };
    });
  };

  /**
   * 離席ボタンがクリックされたときの処理です。
   */
  const onAfkButtonClick = () => {
    setState((state) => {
      return { ...state, isAfk: !state.isAfk };
    });
    props.sendMessage();
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
            <Typography>{props.sessions.length}人</Typography>
          </>
        )}
      </div>
      {state.isInRoom && (
        <>
          <Button
            size="small"
            variant={state.isAfk ? "contained" : "outlined"}
            onClick={onAfkButtonClick}
            disabled={state.isTimerOn}
            style={{ marginRight: "0.2rem" }}
            color={state.isAfk ? "primary" : "default"}
          >
            {state.isAfk ? "離席解除" : "離席する"}
          </Button>
          <Tooltip title="退室する" placement="top">
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
