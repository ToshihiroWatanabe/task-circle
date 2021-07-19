import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { GlobalStateContext } from "contexts/GlobalStateContext";
import React, { memo, useContext, useState } from "react";

const useStyles = makeStyles((theme) => ({
  paper: { width: "90%" },
}));

/** Enterキーが押下されているかどうか */
let enterKeyIsDown = false;

/**
 * タスク名を編集するダイアログの関数コンポーネントです。
 */
const TodoListEditDialog = memo(
  (props: {
    open: boolean;
    setOpen: any;
    formDialogTitle: any;
    label: string;
    defaultValue: string;
  }) => {
    const classes = useStyles();
    let inRef: any = null;
    const { globalState, setGlobalState } = useContext(GlobalStateContext);
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
        setGlobalState((globalState: any) => {
          // @ts-ignore
          Object.values(globalState.todoLists)[props.index].name = inRef.value;
          // @ts-ignore
          props.updateTodoLists(globalState.todoLists);
          return { ...globalState, todoLists: globalState.todoLists };
        });
        props.setOpen(false);
      }
    };

    /**
     * キーが押されたときの処理です。
     * @param {*} event イベント
     */
    const handleKeyDown = (event: any) => {
      setHelperText("");
      if (event.keyCode === 13) {
        setTimeout(() => {
          enterKeyIsDown = true;
        }, 1);
      }
    };

    /**
     * キーが離れたときの処理です。
     * @param {*} event イベント
     */
    const handleKeyUp = (event: any) => {
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
  }
);

export default TodoListEditDialog;
