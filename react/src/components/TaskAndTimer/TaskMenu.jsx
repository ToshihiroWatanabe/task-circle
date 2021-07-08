import React, { useState, useEffect, memo, useContext } from "react";
import { makeStyles } from "@material-ui/core";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DeleteIcon from "@material-ui/icons/Delete";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import EditIcon from "@material-ui/icons/Edit";
import EditDialog from "components/TaskAndTimer/EditDialog";
import { StateContext } from "contexts/StateContext";

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
  const [state, setState] = useContext(StateContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [categories, setCategories] = useState([]);

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
    props.setTodoLists((todoLists) => {
      props.setPreviousTodoLists(JSON.parse(JSON.stringify({ ...todoLists })));
      const newTodoLists = {
        ...todoLists,
        [Object.keys(todoLists)[props.columnIndex]]: {
          ...Object.values(todoLists)[props.columnIndex],
          items: Object.values(todoLists)[props.columnIndex].items.map(
            (item, index) => {
              if (index === props.index) {
                item.spentSecond = 0;
                props.setUndoSnackbarMessage("経過時間をリセットしました");
                props.setUndoSnackbarOpen(true);
              }
              return item;
            }
          ),
        },
      };
      localStorage.setItem("todoLists", JSON.stringify(newTodoLists));
      localStorage.setItem("todoListsUpdatedAt", Date.now());
      return newTodoLists;
    });
    setAnchorEl(null);
  };

  /**
   * 削除がクリックされたときの処理です。
   */
  const handleDelete = () => {
    props.setTodoLists((todoLists) => {
      props.setPreviousTodoLists(JSON.parse(JSON.stringify({ ...todoLists })));
      const newTodoLists = {
        ...todoLists,
        [Object.keys(todoLists)[props.columnIndex]]: {
          ...Object.values(todoLists)[props.columnIndex],
          items: Object.values(todoLists)[props.columnIndex].items.filter(
            (value, index) => {
              if (index === props.index) {
                props.setUndoSnackbarMessage("削除しました");
                props.setUndoSnackbarOpen(true);
              }
              return index !== props.index;
            }
          ),
        },
      };
      localStorage.setItem("todoLists", JSON.stringify(newTodoLists));
      localStorage.setItem("todoListsUpdatedAt", Date.now());
      return newTodoLists;
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
          タスクを編集
        </MenuItem>
        <MenuItem
          onClick={handleReset}
          disabled={
            (Object.values(props.todoLists)[props.columnIndex].items[
              props.index
            ].isSelected === true &&
              state.isTimerOn) ||
            Object.values(props.todoLists)[props.columnIndex].items[props.index]
              .spentSecond === 0
          }
        >
          <RotateLeftIcon />
          経過時間を戻す
        </MenuItem>
        <MenuItem
          style={{ color: "red" }}
          onClick={handleDelete}
          disabled={
            Object.values(props.todoLists)[props.columnIndex].items[props.index]
              .isSelected === true && state.isTimerOn
          }
        >
          <DeleteIcon />
          タスクを削除
        </MenuItem>
      </Menu>
      <EditDialog
        open={editOpen}
        setOpen={setEditOpen}
        index={props.index}
        columnIndex={props.columnIndex}
        todoLists={props.todoLists}
        setTodoLists={props.setTodoLists}
        categories={categories}
        sendMessage={props.sendMessage}
      />
    </>
  );
});

export default TaskMenu;
