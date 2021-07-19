import {
  Divider,
  Icon,
  IconButton,
  makeStyles,
  Popover,
  Select,
  Switch,
  Tooltip,
  Typography,
} from "@material-ui/core";
import TimerToggleButton from "components/header/TimerToggleButton";
import SyncProgress from "components/SyncProgress";
import { GlobalStateContext } from "contexts/GlobalStateContext";
import React, { memo, useContext, useState } from "react";
import SettingService from "services/setting.service";
import "components/header/TimerPopover.css";
import TimerIcon from "@material-ui/icons/Timer";

const workTimerLength: { label: string; value: number }[] = [];
workTimerLength.push({ label: "5", value: 5 * 60 });
workTimerLength.push({ label: "10", value: 10 * 60 });
workTimerLength.push({ label: "15", value: 15 * 60 });
workTimerLength.push({ label: "20", value: 20 * 60 });
workTimerLength.push({ label: "25", value: 25 * 60 });
workTimerLength.push({ label: "30", value: 30 * 60 });
workTimerLength.push({ label: "45", value: 45 * 60 });
workTimerLength.push({ label: "60", value: 60 * 60 });
workTimerLength.push({ label: "90", value: 90 * 60 });

const breakTimerLength: { label: string; value: number }[] = [];
breakTimerLength.push({ label: "5", value: 5 * 60 });
breakTimerLength.push({ label: "10", value: 10 * 60 });
breakTimerLength.push({ label: "15", value: 15 * 60 });
breakTimerLength.push({ label: "20", value: 20 * 60 });
breakTimerLength.push({ label: "25", value: 25 * 60 });
breakTimerLength.push({ label: "30", value: 30 * 60 });

let updateTimeout = 0;

const useStyles = makeStyles((theme) => ({}));

/**
 * タイマーポップオーバーのコンポーネントです。
 */
const TimerPopover = memo((props: { sendMessage: any }) => {
  const classes = useStyles();
  const { globalState, setGlobalState } = useContext(GlobalStateContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isInSync, setIsInSync] = useState(false);
  const open = Boolean(anchorEl);

  /**
   * ローカルストレージとDBの設定を更新します。
   */
  const updateSettings = (settings: any) => {
    localStorage.setItem("settings", JSON.stringify(settings));
    localStorage.setItem("settingsUpdatedAt", Date.now().toString());
    if (globalState.isLogined) {
      setIsInSync(true);
    }
    clearTimeout(updateTimeout);
    // @ts-ignore
    updateTimeout = setTimeout(() => {
      if (globalState.isLogined) {
        // DBの設定を取得
        SettingService.findByTokenId(globalState.tokenId).then((r) => {
          // ローカルのデータより新しいかどうか比較する
          if (
            // @ts-ignore
            new Date(r.data.updatedAt).getTime() >
            // @ts-ignore
            localStorage.getItem("settingsUpdatedAt")
          ) {
            // ローカルのデータをDBのデータに上書きする
            setGlobalState((globalState: any) => {
              const newSettings = {
                ...globalState.settings,
                ...JSON.parse(r.data.setting),
              };
              localStorage.setItem("settings", JSON.stringify(newSettings));
              localStorage.setItem(
                "settingsUpdatedAt",
                new Date(r.data.updatedAt).getTime().toString()
              );
              return { ...globalState, settings: newSettings };
            });
          }
          setIsInSync(false);
        });
        setGlobalState((globalState: any) => {
          SettingService.update(
            globalState.tokenId,
            JSON.stringify(globalState.settings)
          );
          return globalState;
        });
      }
    }, 100);
  };

  /**
   * アイコンがクリックされたときの処理です。
   * @param {*} event
   */
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * ポモドーロタイマーのオンオフが切り替わったときの処理です。
   */
  const onPomodoroEnabledChanged = () => {
    setGlobalState((globalState: any) => {
      const newSettings = {
        ...globalState.settings,
        isPomodoroEnabled: !globalState.settings.isPomodoroEnabled,
      };
      updateSettings(newSettings);
      return { ...globalState, settings: newSettings };
    });
  };

  /**
   * 自動スタートのオンオフが切り替わったときの処理です。
   */
  const onBreakAutoStartChanged = () => {
    setGlobalState((globalState: any) => {
      const newSettings = {
        ...globalState.settings,
        isBreakAutoStart: !globalState.settings.isBreakAutoStart,
      };
      updateSettings(newSettings);
      return { ...globalState, settings: newSettings };
    });
  };

  /**
   * 作業タイマーの時間の選択肢が選ばれたときの処理です。
   * @param {*} event
   */
  const onWorkTimerLengthChange = (event: any) => {
    setGlobalState((globalState: any) => {
      if (globalState.pomodoroTimerType === "work") {
        globalState.pomodoroTimeLeft = event.target.value;
      }
      const newSettings = {
        ...globalState.settings,
        workTimerLength: event.target.value,
      };
      updateSettings(newSettings);
      return { ...globalState, settings: newSettings };
    });
  };

  /**
   * 休憩タイマーの時間の選択肢が選ばれたときの処理です。
   * @param {*} event
   */
  const onBreakTimerLengthChange = (event: any) => {
    setGlobalState((globalState: any) => {
      if (globalState.pomodoroTimerType === "break") {
        globalState.pomodoroTimeLeft = event.target.value;
      }
      const newSettings = {
        ...globalState.settings,
        breakTimerLength: event.target.value,
      };
      updateSettings(newSettings);
      return { ...globalState, settings: newSettings };
    });
  };

  return (
    <>
      <Tooltip title="タイマーメニュー">
        <IconButton onClick={handleClick}>
          {globalState.settings.isPomodoroEnabled && (
            <Icon>
              <img
                alt="tomato"
                src={
                  process.env.PUBLIC_URL +
                  "/favicon/tomato/apple-touch-icon.png"
                }
                style={{
                  width: "1.25rem",
                  height: "1.25rem",
                  filter: globalState.settings.isPomodoroEnabled
                    ? "drop-shadow(0px 0px 1.25px #000)"
                    : "contrast(20%)",
                }}
              />
            </Icon>
          )}
          {!globalState.settings.isPomodoroEnabled && (
            <TimerIcon style={{ color: "white" }} />
          )}
        </IconButton>
      </Tooltip>
      <Popover
        id="timerPopover"
        disableScrollLock={true}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        getContentAnchorEl={null}
      >
        {globalState.isTimerOn && (
          <Typography variant="caption" style={{ padding: "0.5rem 0 0 1rem" }}>
            タイマー作動中は変更できません
          </Typography>
        )}
        <Typography
          style={{
            padding: globalState.isTimerOn
              ? "0rem 0 0 1rem"
              : "0.5rem 0 0 1rem",
          }}
        >
          ポモドーロタイマー
          <Switch
            disabled={globalState.isTimerOn}
            checked={globalState.settings.isPomodoroEnabled}
            onChange={() => {
              onPomodoroEnabledChanged();
            }}
            name="isPomodoroEnabled"
          />
        </Typography>
        <Typography style={{ padding: "0.5rem 0 0 1rem" }}>
          休憩を自動スタート
          <Switch
            disabled={
              !globalState.settings.isPomodoroEnabled || globalState.isTimerOn
            }
            checked={globalState.settings.isBreakAutoStart}
            onChange={() => {
              onBreakAutoStartChanged();
            }}
            name="isBreakAutoStart"
          />
        </Typography>
        <Typography component="div" style={{ padding: "0.5rem 0 0 1rem" }}>
          作業タイマー
          <Select
            native
            disabled={
              !globalState.settings.isPomodoroEnabled || globalState.isTimerOn
            }
            value={globalState.settings.workTimerLength}
            IconComponent={() => <></>}
            onChange={(e) => {
              onWorkTimerLengthChange(e);
            }}
          >
            {workTimerLength.map((value, index) => {
              return (
                <option key={index} value={value.value}>
                  {value.label}
                </option>
              );
            })}
          </Select>
          分
        </Typography>
        <Typography component="div" style={{ padding: "0.5rem 0 0 1rem" }}>
          休憩タイマー
          <Select
            native
            disabled={
              !globalState.settings.isPomodoroEnabled || globalState.isTimerOn
            }
            value={globalState.settings.breakTimerLength}
            IconComponent={() => <></>}
            onChange={(e) => {
              onBreakTimerLengthChange(e);
            }}
          >
            {breakTimerLength.map((value, index) => {
              return (
                <option key={index} value={value.value}>
                  {value.label}
                </option>
              );
            })}
          </Select>
          分
        </Typography>
        <Divider style={{ margin: "0.5rem 0.5rem 0 0.5rem" }} />
        <Typography component="div" style={{ padding: "0.5rem 0 0 1rem" }}>
          <TimerToggleButton
            // @ts-ignore
            sendMessage={props.sendMessage}
          />
        </Typography>
      </Popover>
      <SyncProgress isInSync={isInSync} />
    </>
  );
});

export default TimerPopover;
