import React, { useState, memo, useContext } from "react";
import { Box, makeStyles } from "@material-ui/core";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DeleteIcon from "@material-ui/icons/Delete";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import { Context } from "contexts/Context";

const useStyles = makeStyles({
  menu: {
    width: "13rem",
  },
});

/**
 * カラムメニューのコンポーネントです。
 */
const ColumnMenu = memo((props) => {
  const classes = useStyles();
  const [state, setState] = useContext(Context);
  const [anchorEl, setAnchorEl] = useState(null);

  /**
   * メニューアイコンがクリックされたときの処理です。
   */
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * メニューが閉じられるときの処理です。
   */
  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * リセットがクリックされたときの処理です。
   */
  const handleReset = () => {
    props.setColumns((columns) => {
      props.setLastActivity({
        type: "resetAllTime",
        items: JSON.parse(JSON.stringify(Object.values(columns)[0].items)),
      });
      const newColumns = {
        [Object.keys(columns)[0]]: {
          ...Object.values(columns)[0],
          items: Object.values(columns)[0].items.map((item, index) => {
            item.spentSecond = 0;
            item.estimatedSecond = 0;
            return item;
          }),
        },
      };
      localStorage.setItem("columns", JSON.stringify(newColumns));
      return newColumns;
    });
    props.setUndoSnackbarMessage("経過時間をリセットしました");
    props.setUndoSnackbarOpen(true);
    setAnchorEl(null);
  };

  /**
   * 削除がクリックされたときの処理です。
   */
  const handleDelete = () => {
    console.log(props.index + " + 1番目のリストを削除します");
    props.setColumns((columns) => {
      props.setLastActivity({
        type: "deleteAll",
        items: Object.values(columns)[0].items,
      });
      props.setUndoSnackbarMessage("削除しました");
      props.setUndoSnackbarOpen(true);
      const newColumns = {
        [Object.keys(columns)[0]]: { ...Object.values(columns)[0], items: [] },
      };
      localStorage.setItem("columns", JSON.stringify(newColumns));
      return newColumns;
    });
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        size="small"
        edge={"end"}
        onClick={handleClick}
        color="inherit"
        aria-label="カラムメニュー切替"
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        className={classes.menu}
      >
        <MenuItem
          onClick={handleReset}
          disabled={
            state.isTimerOn ||
            Object.values(props.columns)[0].items.length === 0
          }
        >
          <Box
            style={{
              fontSize: "0.8rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <RotateLeftIcon />
            全ての時間をリセット
          </Box>
        </MenuItem>
        <MenuItem
          style={{ color: "red" }}
          onClick={handleDelete}
          disabled={state.isTimerOn}
        >
          <DeleteIcon />
          リストを削除
        </MenuItem>
      </Menu>
    </>
  );
});

export default ColumnMenu;
