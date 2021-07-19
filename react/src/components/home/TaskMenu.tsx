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
import TaskEditDialog from "components/home/TaskEditDialog";
import { GlobalStateContext } from "contexts/GlobalStateContext";
import React, { memo, useContext, useEffect, useState } from "react";

const useStyles = makeStyles({
  menu: {
    width: "13rem",
  },
});

/**
 * タスクメニューのコンポーネントです。
 */
const TaskMenu = memo(
  (props: {
    setPreviousTodoLists: any;
    columnIndex: number;
    updateTodoLists: any;
    index: number;
    sendMessage: any;
    setUndoSnackbarMessage: any;
    setUndoSnackbarOpen: any;
  }) => {
    const classes = useStyles();
    const { globalState, setGlobalState } = useContext(GlobalStateContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const [editOpen, setEditOpen] = useState(false);
    const [categories] = useState([]);

    useEffect(() => {
      // 編集でEnterを押した時にメニューが開かないようにする
      if (!editOpen) {
        setTimeout(() => {
          // @ts-ignore
          setAnchorEl(false);
        }, 50);
      }
    }, [editOpen]);

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
      setGlobalState((globalState: any) => {
        props.setPreviousTodoLists(
          JSON.parse(JSON.stringify({ ...globalState.todoLists }))
        );
        const newTodoLists = {
          ...globalState.todoLists,
          [Object.keys(globalState.todoLists)[props.columnIndex]]: {
            // @ts-ignore
            ...Object.values(globalState.todoLists)[props.columnIndex],
            // @ts-ignore
            items: Object.values(globalState.todoLists)[
              props.columnIndex
            ].items.map(
              // @ts-ignore
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
        props.updateTodoLists(newTodoLists);
        return newTodoLists;
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
          [Object.keys(globalState.todoLists)[props.columnIndex]]: {
            // @ts-ignore
            ...Object.values(globalState.todoLists)[props.columnIndex],
            // @ts-ignore
            items: Object.values(globalState.todoLists)[
              props.columnIndex
            ].items.filter(
              // @ts-ignore
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
        props.updateTodoLists(newTodoLists);
        return { ...globalState, todoLists: newTodoLists };
      });
      setAnchorEl(null);
    };

    return (
      <>
        <Tooltip title="タスクメニュー">
          <IconButton
            edge={"end"}
            onClick={handleClick}
            color="inherit"
            aria-label="タスクメニュー切替"
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
        >
          <MenuItem onClick={handleEdit}>
            <EditIcon />
            タスクを編集
          </MenuItem>
          <MenuItem
            onClick={handleReset}
            disabled={
              // タイマー作動中かつ選択中のタスク、または経過時間が0の場合は無効
              // @ts-ignore
              (Object.values(globalState.todoLists)[props.columnIndex].items[
                props.index
              ].isSelected &&
                globalState.isTimerOn) ||
              // @ts-ignore
              Object.values(globalState.todoLists)[props.columnIndex].items[
                props.index
              ].spentSecond === 0
            }
          >
            <RotateLeftIcon />
            経過時間を戻す
          </MenuItem>
          <MenuItem
            style={{ color: "red" }}
            onClick={handleDelete}
            disabled={
              // タイマー作動中かつ選択中のタスクの場合は無効
              // @ts-ignore
              Object.values(globalState.todoLists)[props.columnIndex].items[
                props.index
              ].isSelected && globalState.isTimerOn
            }
          >
            <DeleteIcon />
            タスクを削除
          </MenuItem>
        </Menu>
        <TaskEditDialog
          open={editOpen}
          setOpen={setEditOpen}
          index={props.index}
          columnIndex={props.columnIndex}
          todoLists={globalState.todoLists}
          setTodoLists={globalState.setTodoLists}
          categories={categories}
          sendMessage={props.sendMessage}
          updateTodoLists={props.updateTodoLists}
        />
      </>
    );
  }
);

export default TaskMenu;
