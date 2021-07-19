import Grid from "@material-ui/core/Grid";
import Slider from "@material-ui/core/Slider";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import VolumeDown from "@material-ui/icons/VolumeDown";
import VolumeUp from "@material-ui/icons/VolumeUp";
import React, { memo, useContext, useEffect, useState } from "react";
import { GlobalStateContext } from "contexts/GlobalStateContext";

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
const VolumeSlider = memo(
  (props: { helperText: string; updateSettings: any }) => {
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const { globalState, setGlobalState } = useContext(GlobalStateContext);

    useEffect(() => {
      if (props.helperText.match(/.*作業.*/)) {
        setValue(globalState.settings.workVideoVolume);
      } else if (props.helperText.match(/.*休憩.*/)) {
        setValue(globalState.settings.breakVideoVolume);
      } else if (props.helperText.match(/.*チクタク.*/)) {
        setValue(globalState.settings.tickVolume);
      } else {
        setValue(globalState.settings.volume);
      }
    }, []);

    /**
     * 入力値に変化があったときの処理です。
     * @param {*} event
     * @param {*} newValue 新しい値
     */
    const handleChange = (event: any, newValue: number) => {
      setValue(newValue);
      clearTimeout(changeTimeout);
      // @ts-ignore
      changeTimeout = setTimeout(() => {
        setGlobalState((globalState: any) => {
          if (props.helperText.match(/.*作業.*/)) {
            globalState = {
              ...globalState,
              settings: {
                ...globalState.settings,
                workVideoVolume: newValue,
              },
            };
          } else if (props.helperText.match(/.*休憩.*/)) {
            globalState = {
              ...globalState,
              settings: {
                ...globalState.settings,
                breakVideoVolume: newValue,
              },
            };
          } else if (props.helperText.match(/.*チクタク.*/)) {
            globalState = {
              ...globalState,
              settings: { ...globalState.settings, tickVolume: newValue },
            };
          } else {
            globalState = {
              ...globalState,
              settings: { ...globalState.settings, volume: newValue },
            };
          }
          props.updateSettings(globalState.settings);
          return { ...globalState };
        });
      }, 100);
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
              value={value}
              // @ts-ignore
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
);

export default VolumeSlider;
