import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import VolumeDown from "@material-ui/icons/VolumeDown";
import VolumeUp from "@material-ui/icons/VolumeUp";

const useStyles = makeStyles({
  root: {
    width: 200,
  },
});

export default function VolumeSlider(props) {
  const classes = useStyles();

  const handleChange = (event, newValue) => {
    console.log(newValue);
    if (props.helperText.match(/.*作業.*/)) {
      props.setSettings({ ...props.settings, workVideoVolume: newValue });
      localStorage.setItem("settings", JSON.stringify(props.settings));
    }
    if (props.helperText.match(/.*休憩.*/)) {
      props.setSettings({ ...props.settings, breakVideoVolume: newValue });
      localStorage.setItem("settings", JSON.stringify(props.settings));
    }
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
                : props.settings.breakVideoVolume
            }
            onChange={handleChange}
            aria-labelledby="continuous-slider"
            valueLabelDisplay="auto"
            step={10}
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
