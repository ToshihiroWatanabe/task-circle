import React, { useContext } from "react";
import { IconButton, makeStyles, Tooltip, Typography } from "@material-ui/core";
import { Context } from "contexts/Context";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

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
      <Typography style={{ flexGrow: "1" }}>ルーム</Typography>
      {state.isInRoom && (
        <Tooltip title="退室する">
          <IconButton size="small" color="inherit" onClick={onExitButtonClick}>
            <ExitToAppIcon />
          </IconButton>
        </Tooltip>
      )}
    </div>
  );
};

export default RoomHeader;
