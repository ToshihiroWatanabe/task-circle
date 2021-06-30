import React, { memo, useContext, useState } from "react";
import {
  Icon,
  IconButton,
  makeStyles,
  Popover,
  Select,
  Switch,
  Tooltip,
  Typography,
} from "@material-ui/core";
import "./TimerPopover.css";
import { Context } from "contexts/Context";
import ToggleButton from "./ToggleButton";
import { SettingsContext } from "contexts/SettingsContext";

const workTimerLength = [];
workTimerLength.push({ label: "5", value: 5 * 60 });
workTimerLength.push({ label: "10", value: 10 * 60 });
workTimerLength.push({ label: "15", value: 15 * 60 });
workTimerLength.push({ label: "20", value: 20 * 60 });
workTimerLength.push({ label: "25", value: 25 * 60 });
workTimerLength.push({ label: "30", value: 30 * 60 });
workTimerLength.push({ label: "45", value: 45 * 60 });
workTimerLength.push({ label: "60", value: 60 * 60 });

const breakTimerLength = [];
breakTimerLength.push({ label: "5", value: 5 * 60 });
breakTimerLength.push({ label: "10", value: 10 * 60 });
breakTimerLength.push({ label: "15", value: 15 * 60 });
breakTimerLength.push({ label: "20", value: 20 * 60 });

const useStyles = makeStyles((theme) => ({}));

/**
 * タイマーポップオーバーのコンポーネントです。
 */
const TimerPopover = memo((props) => {
  const classes = useStyles();
  const [state, setState] = useContext(Context);
  const [settings, setSettings] = useContext(SettingsContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  /**
   * アイコンがクリックされたときの処理です。
   * @param {*} event
   */
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * ポモドーロタイマーのオンオフが切り替わったときの処理です。
   */
  const onPomodoroEnabledChanged = () => {
    setSettings((settings) => {
      const newSettings = {
        ...settings,
        isPomodoroEnabled: !settings.isPomodoroEnabled,
      };
      localStorage.setItem("settings", JSON.stringify(newSettings));
      return newSettings;
    });
  };

  /**
   * 自動スタートのオンオフが切り替わったときの処理です。
   */
  const onBreakAutoStartChanged = () => {
    setSettings((settings) => {
      const newSettings = {
        ...settings,
        isBreakAutoStart: !settings.isBreakAutoStart,
      };
      localStorage.setItem("settings", JSON.stringify(newSettings));
      return newSettings;
    });
  };

  /**
   * 作業タイマーの時間の選択肢が選ばれたときの処理です。
   * @param {*} event
   */
  const onWorkTimerLengthChange = (event) => {
    setSettings((settings) => {
      setState((state) => {
        if (state.pomodoroTimerType === "work") {
          state.pomodoroTimeLeft = event.target.value;
        }
        return state;
      });
      const newSettings = { ...settings, workTimerLength: event.target.value };
      localStorage.setItem("settings", JSON.stringify(newSettings));
      return newSettings;
    });
  };

  /**
   * 休憩タイマーの時間の選択肢が選ばれたときの処理です。
   * @param {*} event
   */
  const onBreakTimerLengthChange = (event) => {
    setSettings((settings) => {
      setState((state) => {
        if (state.pomodoroTimerType === "break") {
          state.pomodoroTimeLeft = event.target.value;
        }
        return state;
      });
      const newSettings = { ...settings, breakTimerLength: event.target.value };
      localStorage.setItem("settings", JSON.stringify(newSettings));
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
                filter: settings.isPomodoroEnabled
                  ? "drop-shadow(0px 0px 1.25px #000)"
                  : "contrast(0%)",
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
        {state.userId === "" && (
          <>
            {state.isTimerOn && (
              <Typography
                variant="caption"
                style={{ padding: "0.5rem 0 0 1rem" }}
              >
                タイマー作動中は変更できません
              </Typography>
            )}
            <Typography style={{ padding: "0.5rem 0 0 1rem" }}>
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
            <Typography component="div" style={{ padding: "0.5rem 0 0 1rem" }}>
              <ToggleButton />
            </Typography>
          </>
        )}
      </Popover>
    </>
  );
});

export default TimerPopover;
