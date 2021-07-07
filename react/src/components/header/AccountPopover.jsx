import React, { memo, useContext, useState } from "react";
import {
  Box,
  IconButton,
  makeStyles,
  Popover,
  Tooltip,
  Typography,
} from "@material-ui/core";
import "./AccountPopover.css";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { StateContext } from "contexts/StateContext";
import { StatisticsContext } from "contexts/StatisticsContext";
import { secondToHHMMSS } from "utils/convert";
import GoogleButton from "./GoogleButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import { Link } from "react-router-dom";

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
  const [state, setState] = useContext(StateContext);
  const [statistics] = useContext(StatisticsContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  // メールアドレスが隠されているかどうか
  const [showEmail, setShowEmail] = useState(false);
  // 一部を隠したメールアドレス
  const [maskedEmail, setMaskedEmail] = useState("");

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

  return (
    <>
      <Tooltip title="アカウントメニュー">
        <IconButton
          onClick={handleClick}
          color={state.isLogined ? "inherit" : "default"}
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
            (statistics.yesterdaySpentSecond > 0
              ? secondToHHMMSS(statistics.yesterdaySpentSecond)
              : "なし")
          }
          placement="top"
        >
          <Typography>
            {statistics.updatedAt > 0
              ? new Date(statistics.updatedAt).toLocaleDateString()
              : new Date().toLocaleDateString()}
            の合計作業時間{" "}
            {statistics.todaySpentSecond > 0
              ? secondToHHMMSS(statistics.todaySpentSecond)
              : "なし"}
          </Typography>
        </Tooltip>
        <Box mt={"1rem"} />
        <div style={{ display: "flex", alignItems: "center" }}>
          <GoogleButton
            maskedEmail={maskedEmail}
            setMaskedEmail={setMaskedEmail}
          />
          <Link
            to="/privacy"
            onClick={handleClose}
            style={{ marginLeft: "0.5rem" }}
          >
            プライバシーポリシー
          </Link>
        </div>
        <Box mt={"0.5rem"} />
        {state.isLogined && (
          <>
            {/* メールアドレス表示 */}
            <Typography variant="caption" style={{ display: "flex" }}>
              {!showEmail && (
                <>
                  {"ログイン中: " + maskedEmail}
                  <Tooltip title="メールを表示">
                    <VisibilityOffIcon
                      onClick={() => {
                        setShowEmail(true);
                      }}
                      fontSize="small"
                    />
                  </Tooltip>
                </>
              )}
              {showEmail && (
                <>
                  {"ログイン中: " + state.email}
                  <Tooltip title="メールを非表示">
                    <VisibilityIcon
                      onClick={() => {
                        setShowEmail(false);
                      }}
                      fontSize="small"
                    />
                  </Tooltip>
                </>
              )}
            </Typography>
          </>
        )}
      </Popover>
    </>
  );
});

export default AccountPopover;
