import {
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Tooltip,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import TodoListEditDialog from "components/home/TodoListEditDialog";
import { StateContext } from "contexts/StateContext";
import React, { memo, useContext, useState } from "react";

const useStyles = makeStyles({
  menu: {
    width: "13rem",
  },
});

/**
 * ToDoリストメニューのコンポーネントです。
 */
const TodoListMenu = memo((props) => {
  const classes = useStyles();
  const [state, setState] = useContext(StateContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

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
   * リスト名を変更がクリックされたときの処理です。
   */
  const handleEdit = () => {
    setEditOpen(true);
  };

  /**
   * 全ての経過時間をリセットがクリックされたときの処理です。
   */
  const handleReset = () => {
    props.setTodoLists((todoLists) => {
      props.setPreviousTodoLists(JSON.parse(JSON.stringify({ ...todoLists })));
      const newTodoLists = {
        ...todoLists,
        [Object.keys(todoLists)[props.index]]: {
          ...Object.values(todoLists)[props.index],
          items: Object.values(todoLists)[props.index].items.map(
            (item, index) => {
              item.spentSecond = 0;
              item.estimatedSecond = 0;
              return item;
            }
          ),
        },
      };
      props.setUndoSnackbarMessage(
        Object.values(todoLists)[props.index].name + "の時間をリセットしました"
      );
      props.setUndoSnackbarOpen(true);
      props.updateTodoLists(newTodoLists);
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
      };
      delete newTodoLists[Object.keys(todoLists)[props.index]];
      props.setUndoSnackbarMessage(
        Object.values(todoLists)[props.index].name + "を削除しました"
      );
      props.setUndoSnackbarOpen(true);
      props.updateTodoLists(newTodoLists);
      return newTodoLists;
    });
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title="リストメニュー" placement="top">
        <IconButton
          size="small"
          edge={"end"}
          onClick={handleClick}
          color="inherit"
          aria-label="リストメニュー切替"
        >
          <MoreVertIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        className={classes.menu}
        style={{ fontSize: "0.7rem" }}
      >
        <MenuItem
          onClick={handleEdit}
          disabled={
            state.isTimerOn &&
            Object.values(props.todoLists)[props.index].items.length > 0
          }
        >
          <EditIcon />
          リスト名を変更
        </MenuItem>
        <MenuItem
          onClick={handleReset}
          disabled={
            state.isTimerOn ||
            Object.values(props.todoLists)[props.index].items.length === 0
          }
        >
          <RotateLeftIcon />
          時間をリセット
        </MenuItem>
        <MenuItem
          style={{ color: "red" }}
          onClick={handleDelete}
          disabled={
            state.isTimerOn &&
            Object.values(props.todoLists)[props.index].items.length > 0
          }
        >
          <DeleteIcon />
          リストを削除
        </MenuItem>
      </Menu>
      <TodoListEditDialog
        open={editOpen}
        setOpen={setEditOpen}
        index={props.index}
        defaultValue={props.column.name}
        formDialogTitle="リスト名を変更"
        label="リスト名"
        updateTodoLists={props.updateTodoLists}
      />
    </>
  );
});

export default TodoListMenu;
