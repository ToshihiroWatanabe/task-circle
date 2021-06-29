import React, { memo, useContext, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  List,
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
import { StatisticsContext } from "contexts/StatisticsContext";
import { secondToHHMMSS } from "utils/convert";

const useStyles = makeStyles((theme) => ({
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
  const [statistics] = useContext(StatisticsContext);
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

  /**
   * 同期ボタンが押されたときの処理です。
   */
  const onSyncButtonClick = () => {};

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
        id="acountPopover"
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
        className={classes.popover}
      >
        <Tooltip
          title={
            "昨日の合計作業時間 " +
            secondToHHMMSS(statistics.yesterdaySpentSecond)
          }
          placement="top"
        >
          <Typography>
            {new Date(statistics.updatedAt).toLocaleDateString()}の合計作業時間{" "}
            {secondToHHMMSS(statistics.todaySpentSecond)}
          </Typography>
        </Tooltip>
        <Box mt={"1rem"} />
        {state.userId === "" && (
          <>
            {/* <Typography>ログインしていません</Typography>
            <Link onClick={handleClose} to="/login" className={classes.link}>
              <Button variant="outlined" size="small">
                <ListItemText primary="ログイン" />
              </Button>
            </Link>
            <span style={{ marginRight: "0.5rem" }} />
            <Link onClick={handleClose} to="/signup" className={classes.link}>
              <Button variant="outlined" size="small">
                <ListItemText primary="新規登録" />
              </Button>
            </Link> */}
          </>
        )}
        {state.userId !== "" && (
          <>
            <Button variant="outlined" onClick={onSyncButtonClick}>
              <SyncIcon />
              日報をサーバーと同期
            </Button>
            {state.reportUpdatedAt !== "" && (
              <>
                <Typography>最終更新: {state.reportUpdatedAt}</Typography>
              </>
            )}
            <Button
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
