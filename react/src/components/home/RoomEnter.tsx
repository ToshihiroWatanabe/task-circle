import { Button, TextField, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { StateContext } from "contexts/StateContext";
import React, { memo, useContext, useEffect, useState } from "react";
import { NG_USER_NAMES } from "utils/constant";

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
const RoomEnter = memo((props: { onEnter: any }) => {
  const classes = useStyles();
  const { state, setState } = useContext(StateContext);
  const [nameInRoom, setNameInRoom] = useState("");
  const [helperText, setHelperText] = useState("");

  useEffect(() => {
    setNameInRoom(
      // @ts-ignore
      localStorage.getItem("nameInRoom")
        ? localStorage.getItem("nameInRoom")
        : ""
    );
  }, []);

  /**
   * 入力欄の値が変化したときの処理です。
   * @param {*} event
   */
  const onTextFieldChange = (event: any) => {
    setNameInRoom(event.target.value);
    if (helperText !== "") {
      setHelperText("");
    }
  };

  /**
   * キーが押されたときの処理です。
   * @param {*} event
   */
  const onKeyDown = (event: any) => {
    if (event.keyCode === 13) {
      onEnterButtonClick(event);
    }
  };

  /**
   * 入室ボタンがクリックされたときの処理です。
   */
  const onEnterButtonClick = (event: any) => {
    event.preventDefault();
    localStorage.setItem("nameInRoom", nameInRoom);
    if (validate(nameInRoom)) {
      // 入室
      setState((state: any) => {
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
  const validate = (name: string) => {
    if (name.trim() === "") {
      setHelperText("名前を入力してください");
      return false;
    } else if (NG_USER_NAMES.includes(name.trim())) {
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
              style={{ height: "2.4rem" }}
            >
              入室
            </Button>
          </div>
        </Tooltip>
      </form>
    </div>
  );
});

export default RoomEnter;
