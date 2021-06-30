import React, { memo, useContext, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Button, TextField, Tooltip } from "@material-ui/core";
import { Context } from "contexts/Context";

/** 使用できない名前 */
const NG_NAMES = [
  "You",
  "you",
  "あなた",
  "Name",
  "name",
  "Username",
  "userName",
  "username",
  "名前",
  "運営",
  "TaskCircle",
  "Taskcircle",
  "taskCircle",
  "taskcircle",
  "Task Circle",
  "Task circle",
  "task Circle",
  "task circle",
  "Task-Circle",
  "Task-circle",
  "task-Circle",
  "task-circle",
  "Task_Circle",
  "Task_circle",
  "task_Circle",
  "task_circle",
];

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "baseline",
  },
}));

/**
 * ルームに入室する前に表示されるコンポーネントです。
 */
const EnterTheRoom = memo((props) => {
  const classes = useStyles();
  const theme = useTheme();
  const [state, setState] = useContext(Context);
  const [nameInput, setNameInput] = useState("");
  const [helperText, setHelperText] = useState("");

  /**
   * 入力欄の値が変化したときの処理です。
   * @param {*} event
   */
  const onTextFieldChange = (event) => {
    setNameInput(event.target.value);
    setHelperText("");
  };

  /**
   * キーが押されたときの処理です。
   * @param {*} event
   */
  const onKeyDown = (event) => {
    if (event.key === "Enter") {
      onEnterButtonClick();
    }
  };

  /**
   * 入室ボタンがクリックされたときの処理です。
   */
  const onEnterButtonClick = () => {
    if (validate(nameInput)) {
      // 入室
      setState((state) => {
        return { ...state, nameInRoom: nameInput.trim(), isInRoom: true };
      });
      props.onEnter(nameInput.trim());
    }
  };

  /**
   * 入力された名前を検証します。
   */
  const validate = (name) => {
    if (name.trim() === "") {
      setHelperText("名前を入力してください");
      return false;
    } else if (NG_NAMES.includes(name.trim())) {
      setHelperText("その名前は使えません");
      return false;
    } else if (name.trim().length > 20) {
      setHelperText("名前が長すぎます");
      return false;
    }
    return true;
  };

  return (
    <div className={classes.root}>
      <TextField
        label="名前"
        variant="outlined"
        margin="dense"
        onChange={onTextFieldChange}
        helperText={helperText}
        error={helperText !== ""}
        onKeyDown={onKeyDown}
      />
      <Tooltip
        placement="top"
        title={props.isConnected ? "" : "接続されていません"}
      >
        <span>
          <Button
            variant="contained"
            color="primary"
            onClick={onEnterButtonClick}
            disabled={!props.isConnected}
          >
            入室
          </Button>
        </span>
      </Tooltip>
    </div>
  );
});

export default EnterTheRoom;
