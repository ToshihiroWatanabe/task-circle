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
import { GlobalStateContext } from "contexts/GlobalStateContext";
import React, { memo, useContext, useState } from "react";

const useStyles = makeStyles({
  menu: {
    width: "13rem",
  },
});

/**
 * ToDoリストメニューのコンポーネントです。
 */
const TodoListMenu = memo(
  (props: {
    index: number;
    setPreviousTodoLists: any;
    setUndoSnackbarMessage: any;
    setUndoSnackbarOpen: any;
    updateTodoLists: any;
    column: any;
  }) => {
    const classes = useStyles();
    const { globalState, setGlobalState } = useContext(GlobalStateContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const [editOpen, setEditOpen] = useState(false);

    /**
     * メニューアイコンがクリックされたときの処理です。
     */
    const handleClick = (event: any) => {
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
      setGlobalState((globalState: any) => {
        props.setPreviousTodoLists(
          JSON.parse(JSON.stringify({ ...globalState.todoLists }))
        );
        const newTodoLists = {
          ...globalState.todoLists,
          [Object.keys(globalState.todoLists)[props.index]]: {
            // @ts-ignore
            ...Object.values(globalState.todoLists)[props.index],
            // @ts-ignore
            items: Object.values(globalState.todoLists)[props.index].items.map(
              // @ts-ignore
              (item, index) => {
                item.spentSecond = 0;
                item.estimatedSecond = 0;
                return item;
              }
            ),
          },
        };
        props.setUndoSnackbarMessage(
          // @ts-ignore
          Object.values(globalState.todoLists)[props.index].name +
            "の時間をリセットしました"
        );
        props.setUndoSnackbarOpen(true);
        props.updateTodoLists(newTodoLists);
        return { ...globalState, todoLists: newTodoLists };
      });
      setAnchorEl(null);
    };

    /**
     * 削除がクリックされたときの処理です。
     */
    const handleDelete = () => {
      setGlobalState((globalState: any) => {
        props.setPreviousTodoLists(
          JSON.parse(JSON.stringify({ ...globalState.todoLists }))
        );
        const newTodoLists = {
          ...globalState.todoLists,
        };
        delete newTodoLists[Object.keys(globalState.todoLists)[props.index]];
        props.setUndoSnackbarMessage(
          // @ts-ignore
          Object.values(globalState.todoLists)[props.index].name +
            "を削除しました"
        );
        props.setUndoSnackbarOpen(true);
        props.updateTodoLists(newTodoLists);
        return { ...globalState, todoLists: newTodoLists };
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
              globalState.isTimerOn &&
              // @ts-ignore
              Object.values(globalState.todoLists)[props.index].items.length > 0
            }
          >
            <EditIcon />
            リスト名を変更
          </MenuItem>
          <MenuItem
            onClick={handleReset}
            disabled={
              globalState.isTimerOn ||
              // @ts-ignore
              Object.values(globalState.todoLists)[props.index].items.length ===
                0
            }
          >
            <RotateLeftIcon />
            時間をリセット
          </MenuItem>
          <MenuItem
            style={{ color: "red" }}
            onClick={handleDelete}
            disabled={
              globalState.isTimerOn &&
              // @ts-ignore
              Object.values(globalState.todoLists)[props.index].items.length > 0
            }
          >
            <DeleteIcon />
            リストを削除
          </MenuItem>
        </Menu>
        <TodoListEditDialog
          open={editOpen}
          setOpen={setEditOpen}
          // @ts-ignore
          index={props.index}
          defaultValue={props.column.name}
          formDialogTitle="リスト名を変更"
          label="リスト名"
          updateTodoLists={props.updateTodoLists}
        />
      </>
    );
  }
);

export default TodoListMenu;
