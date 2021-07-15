import { IconButton } from "@material-ui/core";
import Popover from "@material-ui/core/Popover";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import HelpOutlineOutlinedIcon from "@material-ui/icons/HelpOutlineOutlined";
import React, { memo, useState } from "react";

const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: "none",
  },
  paper: {
    padding: theme.spacing(1),
  },
}));

/**
 * ヘルプのポップオーバーのコンポーネントです。
 * @param {*} props
 */
const HelpPopover = memo((props: { message: string }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  /**
   * ポップオーバーが開かれるときの処理です。
   * @param event
   */
  const handlePopoverOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * ポップオーバーが閉じられるときの処理です。
   */
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Typography
        aria-owns={open ? "mouse-over-popover" : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        <IconButton size="small">
          <HelpOutlineOutlinedIcon />
        </IconButton>
      </Typography>
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography>{props.message}</Typography>
      </Popover>
    </div>
  );
});
export default HelpPopover;
