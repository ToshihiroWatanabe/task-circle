import { IconButton, Snackbar } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React, { Fragment, memo } from "react";

/**
 * スナックバーのコンポーネントです。
 */
const SimpleSnackbar = memo(
  (props: { open: boolean; setOpen: any; message: string }) => {
    // 閉じる
    const handleClose = (event: any, reason: string) => {
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
              {/* @ts-ignore */}
              <IconButton
                // @ts-ignore
                size="small"
                // @ts-ignore
                color="inherit"
                // @ts-ignore
                onClick={handleClose}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Fragment>
          }
        />
      </>
    );
  }
);

export default SimpleSnackbar;
