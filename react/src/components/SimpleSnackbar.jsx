import React, { Fragment, memo } from "react";
import { Snackbar, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

/**
 * スナックバーの関数コンポーネントです。
 */
const SimpleSnackbar = memo((props) => {
  // 閉じる
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    props.setOpen(false);
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={props.open}
        autoHideDuration={5000}
        onClose={handleClose}
        message={props.message}
        action={
          <Fragment>
            <IconButton size="small" color="inherit" onClick={handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Fragment>
        }
      />
    </>
  );
});

export default SimpleSnackbar;
