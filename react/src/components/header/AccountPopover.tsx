import {
  Box,
  IconButton,
  makeStyles,
  Popover,
  Tooltip,
  Typography,
  useTheme,
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import GoogleButton from "components/header/GoogleButton";
import { GlobalStateContext } from "contexts/GlobalStateContext";
import React, { memo, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { secondToHHMMSS } from "utils/convert";
import "components/header/AccountPopover.css";

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
  const theme = useTheme();
  const { globalState } = useContext(GlobalStateContext);
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
  const handleClick = (event: any) => {
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
          color={
            theme.palette.type === "light"
              ? globalState.isLogined
                ? "inherit"
                : "default"
              : "default"
          }
          style={{
            color:
              theme.palette.type === "light"
                ? ""
                : globalState.isLogined
                ? "white"
                : "RGB(0,0,0,0.54)",
          }}
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
      >
        <Tooltip
          title={
            "昨日の合計作業時間 " +
            (globalState.statistics.yesterdaySpentSecond > 0
              ? secondToHHMMSS(globalState.statistics.yesterdaySpentSecond)
              : "なし")
          }
          placement="top"
        >
          <Typography>
            {globalState.statistics.updatedAt > 0
              ? new Date(globalState.statistics.updatedAt).toLocaleDateString()
              : new Date().toLocaleDateString()}
            の合計作業時間{" "}
            {globalState.statistics.todaySpentSecond > 0
              ? secondToHHMMSS(globalState.statistics.todaySpentSecond)
              : "なし"}
          </Typography>
        </Tooltip>
        <Box mt={"1rem"} />
        <div style={{ display: "flex", alignItems: "center" }}>
          <GoogleButton
            // @ts-ignore
            maskedEmail={maskedEmail}
            setMaskedEmail={setMaskedEmail}
          />
          <Link
            id="linkToPrivacy"
            to="/privacy"
            onClick={handleClose}
            style={{ marginLeft: "0.5rem" }}
          >
            プライバシーポリシー
          </Link>
        </div>
        <Box mt={"0.5rem"} />
        {globalState.isLogined && (
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
                  {"ログイン中: " + globalState.email}
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
