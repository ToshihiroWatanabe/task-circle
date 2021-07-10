import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { TodoListsContext } from "contexts/TodoListsContext";
import React, { memo, useContext, useState } from "react";

/** Material-UIのスタイル */
const useStyles = makeStyles((theme) => ({
  paper: { width: "90%" },
}));

let enterKeyIsDown = false;

/**
 * タスク名を編集するダイアログの関数コンポーネントです。
 */
const TodoListEditDialog = memo((props) => {
  /** Material-UIのスタイル */
  const classes = useStyles();
  let inRef = null;
  const [todoLists, setTodoLists] = useContext(TodoListsContext);
  const [helperText, setHelperText] = useState("");

  /**
   * キャンセルしたときの処理です。
   */
  const handleCancel = () => {
    props.setOpen(false);
  };

  /**
   * 決定したときの処理です。
   */
  const handleAccept = () => {
    if (inRef.value.trim() === "") {
      setHelperText("リスト名を入力してください");
    } else if (inRef.value.trim().length > 12) {
      setHelperText("リスト名は12文字以内にしてください");
    } else {
      // Todoリスト
      setTodoLists((todoLists) => {
        Object.values(todoLists)[props.index].name = inRef.value;
        props.updateTodoLists(todoLists);
        return { ...todoLists };
      });
      props.setOpen(false);
    }
  };

  /**
   * キーが押されたときの処理です。
   * @param {*} event
   */
  const handleKeyDown = (event) => {
    setHelperText("");
    if (event.keyCode === 13) {
      setTimeout(() => {
        enterKeyIsDown = true;
      }, 1);
    }
  };
  const handleKeyUp = (event) => {
    if (event.keyCode === 13 && enterKeyIsDown) {
      enterKeyIsDown = false;
      handleAccept();
    }
  };

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={handleCancel}
        aria-labelledby="form-dialog-title"
        classes={{ paper: classes.paper }}
      >
        <DialogTitle id="form-dialog-title">
          {props.formDialogTitle}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            error={helperText !== ""}
            helperText={helperText}
            margin="dense"
            label={props.label}
            type="text"
            defaultValue={props.defaultValue}
            inputRef={(ref) => (inRef = ref)}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            style={{ width: "98%" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            キャンセル
          </Button>
          <Button onClick={handleAccept} variant="contained" color="primary">
            決定
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});

export default TodoListEditDialog;
