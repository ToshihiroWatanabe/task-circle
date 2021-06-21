import React, { useState, useEffect, memo, useContext } from "react";
import { makeStyles } from "@material-ui/core";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DeleteIcon from "@material-ui/icons/Delete";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import EditIcon from "@material-ui/icons/Edit";
import EditDialog from "components/TaskAndTimer/EditDialog";
import { Context } from "contexts/Context";

/** Material-UIのスタイル */
const useStyles = makeStyles({
  menu: {
    width: "13rem",
  },
});

/**
 * タスクメニューのコンポーネントです。
 */
const TaskMenu = memo((props) => {
  const classes = useStyles();
  const [state, setState] = useContext(Context);
  const [anchorEl, setAnchorEl] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    // 編集でEnterを押した時にメニューが開かないようにする
    if (!editOpen) {
      setTimeout(() => {
        setAnchorEl(false);
      }, 50);
    }
  }, [editOpen]);

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
   * 編集がクリックされたときの処理です。
   */
  const handleEdit = () => {
    setEditOpen(true);
    setAnchorEl(null);
  };

  /**
   * リセットがクリックされたときの処理です。
   */
  const handleReset = () => {
    props.setColumns((columns) => {
      return {
        [Object.keys(columns)[0]]: {
          ...Object.values(columns)[0],
          items: Object.values(columns)[0].items.map((item, index) => {
            if (index === props.index) item.spentSecond = 0;
            return item;
          }),
        },
      };
    });
    setAnchorEl(null);
  };

  /**
   * 削除がクリックされたときの処理です。
   */
  const handleDelete = () => {
    props.setColumns((columns) => {
      return {
        [Object.keys(columns)[0]]: {
          ...Object.values(columns)[0],
          items: Object.values(columns)[0].items.filter((value, index) => {
            return index !== props.index;
          }),
        },
      };
    });
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        edge={"end"}
        onClick={handleClick}
        color="inherit"
        aria-label="タスクメニュー切替"
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
        <MenuItem onClick={handleEdit}>
          <EditIcon />
          編集
        </MenuItem>
        <MenuItem
          onClick={handleReset}
          disabled={
            (Object.values(props.columns)[0].items[props.index].isSelected ===
              true &&
              state.isTimerOn) ||
            Object.values(props.columns)[0].items[props.index].spentSecond === 0
          }
        >
          <RotateLeftIcon />
          時間をリセット
        </MenuItem>
        <MenuItem
          style={{ color: "red" }}
          onClick={handleDelete}
          disabled={
            Object.values(props.columns)[0].items[props.index].isSelected ===
              true && state.isTimerOn
          }
        >
          <DeleteIcon />
          削除
        </MenuItem>
      </Menu>
      <EditDialog
        open={editOpen}
        setOpen={setEditOpen}
        index={props.index}
        columns={props.columns}
        setColumns={props.setColumns}
      />
    </>
  );
});

export default TaskMenu;
