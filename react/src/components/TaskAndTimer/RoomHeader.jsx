import React, { useContext } from "react";
import { Typography } from "@material-ui/core";
import { Context } from "contexts/Context";

/**
 * ルームのヘッダーのコンポーネントです。
 */
const RoomHeader = (props) => {
  const [state, setState] = useContext(Context);
  return (
    <>
      <Typography>ルーム: {props.room.name}</Typography>
    </>
  );
};

export default RoomHeader;
