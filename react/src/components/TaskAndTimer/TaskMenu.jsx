import React, { useState, useEffect, memo, useContext } from "react";
import { makeStyles } from "@material-ui/core";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DeleteIcon from "@material-ui/icons/Delete";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import EditIcon from "@material-ui/icons/Edit";
import EditDialog from "components/TaskAndTimer/EditDialog";
import { Context } from "contexts/Context";

const getCategories = (reports) => {
  let categories = [];
  for (let i = 0; i < reports.length; i++) {
    for (let j = 0; j < reports[i].report_items.length; j++) {
      if (reports[i].report_items[j].category !== "") {
        categories.push({
          label: reports[i].report_items[j].category,
          value: reports[i].report_items[j].category,
        });
      }
    }
  }
  // 重複を削除
  const newCategories = categories.filter((element, index, array) => {
    return (
      array.findIndex((element2) => element.label === element2.label) === index
    );
  });
  return newCategories;
};

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
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setState((state) => {
      setCategories((categories) => {
        return getCategories(state.reports);
      });
      return state;
    });
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
      const newColumns = {
        [Object.keys(columns)[props.columnIndex]]: {
          ...Object.values(columns)[props.columnIndex],
          items: Object.values(columns)[props.columnIndex].items.map(
            (item, index) => {
              if (index === props.index) {
                props.setLastActivity({
                  type: "resetSpentSecond",
                  spentSecond: item.spentSecond,
                  index: index,
                });
                item.spentSecond = 0;
                props.setUndoSnackbarMessage("経過時間をリセットしました");
                props.setUndoSnackbarOpen(true);
              }
              return item;
            }
          ),
        },
      };
      localStorage.setItem("columns", JSON.stringify(newColumns));
      return newColumns;
    });
    setAnchorEl(null);
  };

  /**
   * 削除がクリックされたときの処理です。
   */
  const handleDelete = () => {
    props.setColumns((columns) => {
      console.log(Object.values(columns));
      const newColumns = {
        ...Object.values(columns),
        [Object.keys(columns)[props.columnIndex]]: {
          ...Object.values(columns)[props.columnIndex],
          items: Object.values(columns)[props.columnIndex].items.filter(
            (value, index) => {
              if (index === props.index) {
                props.setLastActivity({
                  type: "itemDelete",
                  item: Object.values(columns)[props.columnIndex].items[index],
                  index: index,
                });
                props.setUndoSnackbarMessage("削除しました");
                props.setUndoSnackbarOpen(true);
              }
              return index !== props.index;
            }
          ),
        },
      };
      localStorage.setItem("columns", JSON.stringify(newColumns));
      return newColumns;
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
            (Object.values(props.columns)[props.columnIndex].items[props.index]
              .isSelected === true &&
              state.isTimerOn) ||
            Object.values(props.columns)[props.columnIndex].items[props.index]
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
            Object.values(props.columns)[props.columnIndex].items[props.index]
              .isSelected === true && state.isTimerOn
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
        columnIndex={props.columnIndex}
        columns={props.columns}
        setColumns={props.setColumns}
        categories={categories}
      />
    </>
  );
});

export default TaskMenu;
