import React, { useState, memo, useCallback, useContext } from "react";
import {
  makeStyles,
  Popover,
  IconButton,
  Tooltip,
  Button,
  Snackbar,
} from "@material-ui/core";
import "components/header/FilePopover.css";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import MuiAlert from "@material-ui/lab/Alert";
import { Context } from "contexts/Context";
import { exportReportsToTxt, exportReportsToJson } from "utils/export";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: "0.5rem",
  },
}));

/**
 * ファイルポップオーバーのコンポーネントです。
 */
const AnalyticsFilePopover = memo((props) => {
  const classes = useStyles();
  const [state, setState] = useContext(Context);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);

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

  const handleSuccessSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccessSnackbarOpen(false);
  };

  const onClipboardButtonClick = () => {};

  return (
    <>
      <Tooltip title="データの移行">
        <IconButton onClick={handleClick} color="inherit">
          <FileCopyIcon />
        </IconButton>
      </Tooltip>
      <Popover
        disableScrollLock={true}
        id="filePopover"
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
        <Button
          onClick={onClipboardButtonClick}
          variant="outlined"
          className={classes.button}
        >
          直近1週間の集計をクリップボードにコピー
        </Button>
      </Popover>
    </>
  );
});

export default AnalyticsFilePopover;
