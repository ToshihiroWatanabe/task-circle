import React, { memo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";

/** Material-UIのスタイル */
const useStyles = makeStyles((theme) => ({
  paper: { width: "90%" },
}));

let enterKeyIsDown = false;

/**
 * 編集ダイアログのコンポーネントです。
 */
const EditDialog = memo((props) => {
  /** Material-UIのスタイル */
  const classes = useStyles();
  let inRef = null;

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
    if (inRef.value !== "") {
      // ユーザー名
      if (props.name !== undefined) {
        props.setName(inRef.value);
      }
      // Todoリスト
      if (props.todoList !== undefined) {
        const copy = [...props.todoList];
        copy.forEach((e) => {
          if (e.id === props.id) {
            e.text = inRef.value;
          }
        });
        props.setTodoList(copy);
      }
      props.setOpen(false);
    }
  };

  /**
   * キーが押されたときの処理です。
   * @param {*} event
   */
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      setTimeout(() => {
        enterKeyIsDown = true;
      }, 1);
    }
  };
  const handleKeyUp = (event) => {
    if (event.key === "Enter" && enterKeyIsDown) {
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
            margin="dense"
            label={props.label}
            type="text"
            fullWidth
            defaultValue={props.defaultValue}
            inputRef={(ref) => (inRef = ref)}
            inputProps={{ maxLength: 45 }}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
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

export default EditDialog;
