import React, { memo, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({}));

/**
 * ルームに入室する前に表示されるコンポーネントです。
 */
const EnterTheRoom = memo(() => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <>
      return (<></>
      );
    </>
  );
});

export default EnterTheRoom;
