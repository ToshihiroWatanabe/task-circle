import React, { useState, useEffect, memo } from "react";
import { makeStyles } from "@material-ui/core";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DeleteIcon from "@material-ui/icons/Delete";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import EditIcon from "@material-ui/icons/Edit";
import EditDialog from "components/TaskAndTimer/EditDialog";

/** Material-UIのスタイル */
const useStyles = makeStyles({
  hidden: {
    display: "none",
  },
});

/**
 * タスクメニューのコンポーネントです。
 */
const TaskMenu = memo((props) => {
  /** Material-UIのスタイル */
  const classes = useStyles();
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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

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
    setAnchorEl(null);
  };

  /**
   * 削除がクリックされたときの処理です。
   */
  const handleDelete = () => {
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
        style={{ width: "13rem" }}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon />
          編集
        </MenuItem>
        <MenuItem onClick={handleReset}>
          <RotateLeftIcon />
          時間をリセット
        </MenuItem>
        <MenuItem style={{ color: "red" }} onClick={handleDelete}>
          <DeleteIcon />
          削除
        </MenuItem>
      </Menu>
      <EditDialog
        open={editOpen}
        setOpen={setEditOpen}
        id={props.id}
        defaultValue={props.text}
        todoList={props.todoList}
        setTodoList={props.setTodoList}
        formDialogTitle="編集"
        label="タスク名"
      />
    </>
  );
});

export default TaskMenu;
