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
import { SettingsContext } from "contexts/SettingsContext";
import { StateContext } from "contexts/StateContext";
import React, { memo, useContext, useState } from "react";
import SettingService from "services/setting.service";
import "components/header/TimerPopover.css";

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
  const { state, setState } = useContext(StateContext);
  const { settings, setSettings } = useContext(SettingsContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isInSync, setIsInSync] = useState(false);
  const open = Boolean(anchorEl);

  /**
   * ローカルストレージとDBの設定を更新します。
   */
  const updateSettings = (settings: any) => {
    localStorage.setItem("settings", JSON.stringify(settings));
    localStorage.setItem("settingsUpdatedAt", Date.now().toString());
    if (state.isLogined) {
      setIsInSync(true);
    }
    clearTimeout(updateTimeout);
    // @ts-ignore
    updateTimeout = setTimeout(() => {
      if (state.isLogined) {
        // DBの設定を取得
        SettingService.findByTokenId(state.tokenId).then((r) => {
          // ローカルのデータより新しいかどうか比較する
          if (
            // @ts-ignore
            new Date(r.data.updatedAt).getTime() >
            // @ts-ignore
            localStorage.getItem("settingsUpdatedAt")
          ) {
            // ローカルのデータをDBのデータに上書きする
            setSettings((settings: any) => {
              const newSettings = {
                ...settings,
                ...JSON.parse(r.data.setting),
              };
              localStorage.setItem("settings", JSON.stringify(newSettings));
              localStorage.setItem(
                "settingsUpdatedAt",
                new Date(r.data.updatedAt).getTime().toString()
              );
              return newSettings;
            });
          }
          setIsInSync(false);
        });
        setSettings((settings: any) => {
          SettingService.update(state.tokenId, JSON.stringify(settings));
          return settings;
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
    setSettings((settings: any) => {
      const newSettings = {
        ...settings,
        isPomodoroEnabled: !settings.isPomodoroEnabled,
      };
      updateSettings(newSettings);
      return newSettings;
    });
  };

  /**
   * 自動スタートのオンオフが切り替わったときの処理です。
   */
  const onBreakAutoStartChanged = () => {
    setSettings((settings: any) => {
      const newSettings = {
        ...settings,
        isBreakAutoStart: !settings.isBreakAutoStart,
      };
      updateSettings(newSettings);
      return newSettings;
    });
  };

  /**
   * 作業タイマーの時間の選択肢が選ばれたときの処理です。
   * @param {*} event
   */
  const onWorkTimerLengthChange = (event: any) => {
    setSettings((settings: any) => {
      setState((state: any) => {
        if (state.pomodoroTimerType === "work") {
          state.pomodoroTimeLeft = event.target.value;
        }
        return state;
      });
      const newSettings = { ...settings, workTimerLength: event.target.value };
      updateSettings(newSettings);
      return newSettings;
    });
  };

  /**
   * 休憩タイマーの時間の選択肢が選ばれたときの処理です。
   * @param {*} event
   */
  const onBreakTimerLengthChange = (event: any) => {
    setSettings((settings: any) => {
      setState((state: any) => {
        if (state.pomodoroTimerType === "break") {
          state.pomodoroTimeLeft = event.target.value;
        }
        return state;
      });
      const newSettings = { ...settings, breakTimerLength: event.target.value };
      updateSettings(newSettings);
      return newSettings;
    });
  };

  return (
    <>
      <Tooltip title="ポモドーロタイマー">
        <IconButton onClick={handleClick}>
          <Icon>
            <img
              alt="tomato"
              src={
                process.env.PUBLIC_URL + "/favicon/tomato/apple-touch-icon.png"
              }
              style={{
                width: "1.25rem",
                height: "1.25rem",
                filter: settings.isPomodoroEnabled
                  ? "drop-shadow(0px 0px 1.25px #000)"
                  : "contrast(20%)",
              }}
            />
          </Icon>
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
        {state.isTimerOn && (
          <Typography variant="caption" style={{ padding: "0.5rem 0 0 1rem" }}>
            タイマー作動中は変更できません
          </Typography>
        )}
        <Typography
          style={{
            padding: state.isTimerOn ? "0rem 0 0 1rem" : "0.5rem 0 0 1rem",
          }}
        >
          ポモドーロタイマー
          <Switch
            disabled={state.isTimerOn}
            checked={settings.isPomodoroEnabled}
            onChange={() => {
              onPomodoroEnabledChanged();
            }}
            name="isPomodoroEnabled"
          />
        </Typography>
        <Typography style={{ padding: "0.5rem 0 0 1rem" }}>
          休憩を自動スタート
          <Switch
            disabled={!settings.isPomodoroEnabled || state.isTimerOn}
            checked={settings.isBreakAutoStart}
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
            disabled={!settings.isPomodoroEnabled || state.isTimerOn}
            value={settings.workTimerLength}
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
            disabled={!settings.isPomodoroEnabled || state.isTimerOn}
            value={settings.breakTimerLength}
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
