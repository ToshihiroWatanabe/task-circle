import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import VolumeDown from "@material-ui/icons/VolumeDown";
import VolumeUp from "@material-ui/icons/VolumeUp";

/** setTimeoutのID */
let changeTimeout = 0;

/** チクタク音の音量 */
const faintTickMarks = [
  {
    value: 0,
    label: "0",
  },
  {
    value: 10,
    label: "1",
  },
  {
    value: 50,
    label: "10",
  },
  {
    value: 100,
    label: "100",
  },
];

const useStyles = makeStyles({
  root: {
    width: "16rem",
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
      props.updateSettings(props.settings);
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
            valueLabelFormat={(x) => {
              if (props.helperText.match(/.*チクタク.*/) && x === 10) {
                return 1;
              } else if (props.helperText.match(/.*チクタク.*/) && x === 50) {
                return 10;
              }
              return x;
            }}
            valueLabelDisplay="auto"
            step={props.helperText.match(/.*チクタク.*/) ? null : 10}
            marks={
              props.helperText.match(/.*チクタク.*/) ? faintTickMarks : true
            }
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
