import {
  Button,
  IconButton,
  makeStyles,
  Tooltip,
  Typography,
} from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import PersonIcon from "@material-ui/icons/Person";
import HelpPopover from "components/home/HelpPopover";
import { GlobalStateContext } from "contexts/GlobalStateContext";
import React, { memo, useContext } from "react";
import { DEFAULT_TITLE } from "utils/constant";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
}));

/**
 * ルームのヘッダーのコンポーネントです。
 */
const RoomHeader = memo(
  (props: { onLeave: any; sendMessage: any; sessions: any }) => {
    const classes = useStyles();
    const { globalState, setGlobalState } = useContext(GlobalStateContext);

    /**
     * 退室ボタンがクリックされたときの処理です。
     */
    const onExitButtonClick = () => {
      props.onLeave();
    };

    /**
     * 離席ボタンがクリックされたときの処理です。
     */
    const onAfkButtonClick = () => {
      setGlobalState((globalState: any) => {
        if (globalState.isAfk) {
          const link: any = document.querySelector("link[rel*='icon']");
          link.href = "/favicon.ico";
          document.title = DEFAULT_TITLE;
        } else {
          const link: any = document.querySelector("link[rel*='icon']");
          link.href = "/favicon/chair_favicon.ico";
          document.title = "離席中 | " + DEFAULT_TITLE;
        }
        return { ...globalState, isAfk: !globalState.isAfk };
      });
      if (globalState.isConnected) {
        props.sendMessage();
      }
    };

    return (
      <div className={classes.root}>
        <div
          style={{
            // @ts-ignore
            flexGrow: "1",
            display: "flex",
          }}
        >
          <Tooltip
            title={
              globalState.nameInRoom !== ""
                ? globalState.nameInRoom + "として入室中"
                : ""
            }
            placement="top"
          >
            <Typography component="span">ルーム</Typography>
          </Tooltip>
          {globalState.isInRoom && (
            <>
              <PersonIcon
                fontSize="inherit"
                style={{ marginLeft: "1rem", marginTop: "0.3rem" }}
              />
              <Typography>{props.sessions.length}人</Typography>
            </>
          )}
        </div>
        {!globalState.isInRoom && (
          <>
            <HelpPopover
              message={
                "入室すると今のタイマーの状況を他のユーザーと共有できます。"
              }
            />
          </>
        )}
        {globalState.isInRoom && (
          <>
            <Button
              size="small"
              variant={globalState.isAfk ? "contained" : "outlined"}
              onClick={onAfkButtonClick}
              disabled={globalState.isTimerOn}
              style={{ marginRight: "0.2rem" }}
              color={globalState.isAfk ? "primary" : "default"}
            >
              {globalState.isAfk ? "離席解除" : "離席する"}
            </Button>
            <Tooltip title="退室する" placement="top">
              <IconButton
                size="small"
                color="inherit"
                onClick={onExitButtonClick}
              >
                <ExitToAppIcon />
              </IconButton>
            </Tooltip>
          </>
        )}
      </div>
    );
  }
);

export default RoomHeader;
