import React, { memo, useContext, useState } from "react";
import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Popover,
  Tooltip,
  Typography,
} from "@material-ui/core";
import "./AccountPopover.css";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import SettingsIcon from "@material-ui/icons/Settings";
import SyncIcon from "@material-ui/icons/Sync";
import { Link } from "react-router-dom";
import { Context } from "contexts/Context";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: "0.5rem 1rem",
  },
  link: {
    color: "inherit",
    textDecoration: "none",
  },
}));

/**
 * アカウントポップオーバーのコンポーネントです。
 */
const AccountPopover = memo((props) => {
  const classes = useStyles();
  const [state, setState] = useContext(Context);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  /**
   * アイコンがクリックされたときの処理です。
   * @param {*} event
   */
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onLogoutButtonClick = () => {
    setState({ ...state, userId: "", password: "" });
  };

  return (
    <>
      <Tooltip title="アカウントメニュー">
        <IconButton
          onClick={handleClick}
          color={state.userId !== "" ? "inherit" : "default"}
        >
          <AccountCircleIcon />
        </IconButton>
      </Tooltip>
      <Popover
        disableScrollLock={true}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        getContentAnchorEl={null}
      >
        {state.userId === "" && (
          <>
            <Typography style={{ padding: "1rem 1rem 0 1rem" }}>
              ログインしていません
            </Typography>
            <Link onClick={handleClose} to="/login" className={classes.link}>
              <Button
                className={classes.button}
                variant="outlined"
                size="small"
              >
                <ListItemText primary="ログイン" />
              </Button>
            </Link>
            <Link onClick={handleClose} to="/signup" className={classes.link}>
              <Button
                className={classes.button}
                variant="outlined"
                size="small"
              >
                <ListItemText primary="新規登録" />
              </Button>
            </Link>
          </>
        )}
        {state.userId !== "" && (
          <>
            <Button
              className={classes.button}
              variant="outlined"
              onClick={props.onSyncButtonClick}
            >
              <SyncIcon />
              日報をサーバーと同期
            </Button>
            {state.reportUpdatedAt !== "" && (
              <>
                <Typography style={{ marginLeft: "1rem" }}>
                  最終更新: {state.reportUpdatedAt}
                </Typography>
              </>
            )}
            <Button
              className={classes.button}
              variant="outlined"
              size="small"
              onClick={onLogoutButtonClick}
            >
              <ListItemText primary="ログアウト" />
            </Button>
          </>
        )}
        <List>
          <Link onClick={handleClose} to="/settings" className={classes.link}>
            <Button className={classes.button} variant="outlined" size="small">
              <SettingsIcon />
              <ListItemText primary="設定" />
            </Button>
          </Link>
        </List>
      </Popover>
    </>
  );
});

export default AccountPopover;
