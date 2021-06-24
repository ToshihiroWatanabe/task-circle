import React, { memo, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Button, TextField } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({}));

/**
 * ルームに入室する前に表示されるコンポーネントです。
 */
const EnterTheRoom = memo(() => {
  const classes = useStyles();
  const theme = useTheme();

  /**
   * 入室ボタンがクリックされたときの処理です。
   */
  const onEnterButtonClick = () => {};

  return (
    <>
      <TextField label="名前" variant="outlined" />
      <Button variant="contained" color="primary" onClick={onEnterButtonClick}>
        入室
      </Button>
    </>
  );
});

export default EnterTheRoom;
