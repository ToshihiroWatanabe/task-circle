import React, { useState, memo, useContext } from "react";
import { Box, makeStyles } from "@material-ui/core";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DeleteIcon from "@material-ui/icons/Delete";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import EditIcon from "@material-ui/icons/Edit";
import { Context } from "contexts/Context";
import SimpleFormDialog from "./SimpleFormDialog";

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
  const [state, setState] = useContext(Context);
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
    props.setColumns((columns) => {
      props.setPreviousColumns(JSON.parse(JSON.stringify({ ...columns })));
      const newColumns = {
        ...columns,
        [Object.keys(columns)[props.index]]: {
          ...Object.values(columns)[props.index],
          items: Object.values(columns)[props.index].items.map(
            (item, index) => {
              item.spentSecond = 0;
              item.estimatedSecond = 0;
              return item;
            }
          ),
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
    props.setColumns((columns) => {
      props.setPreviousColumns(JSON.parse(JSON.stringify({ ...columns })));
      const newColumns = {
        ...columns,
      };
      delete newColumns[Object.keys(columns)[props.index]];
      props.setUndoSnackbarMessage("削除しました");
      props.setUndoSnackbarOpen(true);
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
        <MenuItem onClick={handleEdit} disabled={state.isTimerOn}>
          <EditIcon />
          リスト名を変更
        </MenuItem>
        <MenuItem
          onClick={handleReset}
          disabled={
            state.isTimerOn ||
            Object.values(props.columns)[props.index].items.length === 0
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
      <SimpleFormDialog
        open={editOpen}
        setOpen={setEditOpen}
        index={props.index}
        defaultValue={props.column.name}
        formDialogTitle="リスト名を変更"
        label="リスト名"
      />
    </>
  );
});

export default TodoListMenu;
