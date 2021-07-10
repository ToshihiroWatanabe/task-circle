import { CircularProgress } from "@material-ui/core";
import React, { memo } from "react";

/**
 * 同期中の表示のコンポーネントです。
 * @param {*} props
 */
const SyncProgress = memo((props) => {
  return (
    <>
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          zIndex: 1400,
          display: props.isInSync ? "" : "none",
        }}
      >
        <CircularProgress />
      </div>
    </>
  );
});

export default SyncProgress;
