import React, { memo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  MenuItem,
  FormHelperText,
  FormControl,
  Select,
} from "@material-ui/core";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import VolumeDownIcon from "@material-ui/icons/VolumeDown";
import VolumeMuteIcon from "@material-ui/icons/VolumeMute";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(1),
  },
  volumeIcon: {
    marginTop: theme.spacing(2.5),
  },
}));

let settings = {};

/**
 * 音量選択の関数コンポーネントです。
 */
const SimpleSelect = memo((props) => {
  const classes = useStyles();

  console.log(props);

  const handleChange = (event) => {
    // console.log(event.target.value);
    if (props.helperText.match(/.*作業.*/)) {
      settings = {
        ...props.settings,
        workVideoVolume: event.target.value,
      };
      props.setSettings(settings);
      localStorage.setItem("settings", JSON.stringify(settings));
    }
    if (props.helperText.match(/.*休憩.*/)) {
      settings = {
        ...props.settings,
        breakVideoVolume: event.target.value,
      };
      props.setSettings(settings);
      localStorage.setItem("settings", JSON.stringify(settings));
    }
  };

  return (
    <div>
      {/* スピーカーアイコン */}
      {(() => {
        if (props.helperText.match(/.*作業.*/)) {
          if (props.settings.workVideoVolume >= 75) {
            return <VolumeUpIcon className={classes.volumeIcon} />;
          }
          if (
            props.settings.workVideoVolume <= 50 &&
            props.settings.workVideoVolume > 0
          ) {
            return <VolumeDownIcon className={classes.volumeIcon} />;
          }
          if (props.settings.workVideoVolume === 0) {
            return <VolumeMuteIcon className={classes.volumeIcon} />;
          }
        }
        if (props.helperText.match(/.*休憩.*/)) {
          if (props.settings.breakVideoVolume >= 75) {
            return <VolumeUpIcon className={classes.volumeIcon} />;
          }
          if (
            props.settings.breakVideoVolume <= 50 &&
            props.settings.breakVideoVolume > 0
          ) {
            return <VolumeDownIcon className={classes.volumeIcon} />;
          }
          if (props.settings.breakVideoVolume === 0) {
            return <VolumeMuteIcon className={classes.volumeIcon} />;
          }
        }
      })()}
      <FormControl className={classes.formControl}>
        <Select
          value={
            props.helperText.match(/.*作業.*/)
              ? props.settings.workVideoVolume
              : props.settings.breakVideoVolume
          }
          onChange={handleChange}
          displayEmpty
          className={classes.selectEmpty}
          inputProps={{ "aria-label": "Without label" }}
        >
          <MenuItem value={100}>100%</MenuItem>
          <MenuItem value={75}>75%</MenuItem>
          <MenuItem value={50}>50%</MenuItem>
          <MenuItem value={25}>25%</MenuItem>
          <MenuItem value={0}>0%</MenuItem>
        </Select>
        <FormHelperText>{props.helperText}</FormHelperText>
      </FormControl>
    </div>
  );
});

export default SimpleSelect;
