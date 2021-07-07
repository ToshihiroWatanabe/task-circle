import React, { memo, useContext, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Button, TextField, Tooltip } from "@material-ui/core";
import { StateContext } from "contexts/StateContext";

const localStorageGetItemNameInRoom = localStorage.getItem("nameInRoom")
  ? localStorage.getItem("nameInRoom")
  : "";

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
  root: {},
  form: {
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
  const [state, setState] = useContext(StateContext);
  const [nameInRoom, setNameInRoom] = useState(localStorageGetItemNameInRoom);
  const [helperText, setHelperText] = useState("");

  /**
   * 入力欄の値が変化したときの処理です。
   * @param {*} event
   */
  const onTextFieldChange = (event) => {
    setNameInRoom(event.target.value);
    if (helperText !== "") {
      setHelperText("");
    }
  };

  /**
   * キーが押されたときの処理です。
   * @param {*} event
   */
  const onKeyDown = (event) => {
    if (event.keyCode === 13) {
      onEnterButtonClick(event);
    }
  };

  /**
   * 入室ボタンがクリックされたときの処理です。
   */
  const onEnterButtonClick = (event) => {
    event.preventDefault();
    localStorage.setItem("nameInRoom", nameInRoom);
    if (validate(nameInRoom)) {
      // 入室
      setState((state) => {
        const newState = {
          ...state,
          isInRoom: true,
          nameInRoom: nameInRoom,
        };
        return newState;
      });
      props.onEnter();
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
      <form className={classes.form}>
        <TextField
          label="名前"
          id="nameInRoom"
          name="nameInRoom"
          value={nameInRoom}
          variant="outlined"
          margin="dense"
          onChange={onTextFieldChange}
          helperText={helperText}
          error={helperText !== ""}
          onKeyDown={onKeyDown}
          autoComplete="on"
        />
        <Tooltip
          placement="top"
          title={state.isConnected ? "" : "接続されていません"}
        >
          <div style={{ position: "relative", bottom: "0.15rem" }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={(event) => onEnterButtonClick(event)}
              disabled={!state.isConnected}
            >
              入室
            </Button>
          </div>
        </Tooltip>
      </form>
    </div>
  );
});

export default EnterTheRoom;
