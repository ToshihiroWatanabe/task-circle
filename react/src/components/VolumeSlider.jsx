import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import VolumeDown from "@material-ui/icons/VolumeDown";
import VolumeUp from "@material-ui/icons/VolumeUp";

/** setTimeoutのID */
let changeTimeout = 0;

const useStyles = makeStyles({
  root: {
    width: 200,
  },
});

/**
 * 音量スライダーのコンポーネントです。
 */
export default function VolumeSlider(props) {
  const classes = useStyles();

  /**
   * 入力値に変化があったときの処理です。
   * @param {*} event
   * @param {*} newValue 新しい値
   */
  const handleChange = (event, newValue) => {
    if (props.helperText.match(/.*作業.*/)) {
      props.setSettings({ ...props.settings, workVideoVolume: newValue });
    } else if (props.helperText.match(/.*休憩.*/)) {
      props.setSettings({ ...props.settings, breakVideoVolume: newValue });
    } else if (props.helperText.match(/.*チクタク.*/)) {
      props.setSettings({ ...props.settings, tickVolume: newValue });
    } else {
      props.setSettings({ ...props.settings, volume: newValue });
    }
    clearTimeout(changeTimeout);
    changeTimeout = setTimeout(() => {
      localStorage.setItem("settings", JSON.stringify(props.settings));
    }, 500);
  };

  return (
    <div className={classes.root}>
      <Typography id="continuous-slider" variant="caption" gutterBottom>
        ボリューム
      </Typography>
      <Grid container spacing={2}>
        <Grid item>
          <VolumeDown />
        </Grid>
        <Grid item xs>
          <Slider
            value={
              props.helperText.match(/.*作業.*/)
                ? props.settings.workVideoVolume
                : props.helperText.match(/.*休憩.*/)
                ? props.settings.breakVideoVolume
                : props.helperText.match(/.*チクタク.*/)
                ? props.settings.tickVolume
                : props.settings.volume
            }
            onChange={handleChange}
            aria-labelledby="continuous-slider"
            valueLabelDisplay="auto"
            step={props.helperText.match(/.*チクタク.*/) ? 1 : 10}
            marks
            min={0}
            max={100}
          />
        </Grid>
        <Grid item>
          <VolumeUp />
        </Grid>
      </Grid>
    </div>
  );
}
