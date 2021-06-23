import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  FormControl,
  FormLabel,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { Context } from "contexts/Context";
import SyncIcon from "@material-ui/icons/Sync";
import SimpleSnackbar from "components/SimpleSnackbar";
import {
  FormGroup,
  FormControlLabel,
  Switch,
  FormHelperText,
} from "@material-ui/core";
import MusicVideoIcon from "@material-ui/icons/MusicVideo";
import YouTube from "react-youtube";
import { SettingsContext } from "contexts/SettingsContext";
import VolumeSlider from "./VolumeSlider";

const useStyles = makeStyles((theme) => ({
  card: {
    display: "flex",
    flexDirection: "column",
    width: "95%",
    padding: "1rem",
    marginBottom: "1rem",
  },
  formControl: {
    margin: theme.spacing(1),
    width: "100%",
  },
  allDeleteButton: {
    margin: theme.spacing(3),
    textTransform: "none !important",
  },
  urlField: {
    width: "100%",
  },
  musicVideoIcon: {
    marginBottom: "-0.5rem",
  },
  slackTextField: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

/**
 * 設定ページのコンポーネントです。
 */
const Settings = () => {
  const classes = useStyles();
  const [state, setState] = useContext(Context);
  const [settings, setSettings] = useContext(SettingsContext);
  const [slackUserName, setSlackUserName] = useState(state.slackUserName);
  const [slackWebhookUrl, setSlackWebhookUrl] = useState(state.slackWebhookUrl);
  const [settingDisabled, setSettingDisabled] = useState(
    state.userId === "" ? false : true
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {}, []);

  const onSlackUserNameChange = (event) => {
    setSlackUserName(event.target.value);
  };
  const onSlackWebhookUrlChange = (event) => {
    setSlackWebhookUrl(event.target.value);
  };
  const onApplyButtonClick = (event) => {
    event.preventDefault();
    setState({
      ...state,
      slackUserName: slackUserName,
      slackWebhookUrl: slackWebhookUrl,
    });
  };

  return (
    <>
      <Card className={classes.card}>
        <Typography>タイマー設定</Typography>
        <FormHelperText>
          一部の設定はタイマーを停止させないと反映されません。
        </FormHelperText>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel>
            <MusicVideoIcon className={classes.musicVideoIcon} />
            🍅作業用BGM
          </FormLabel>
          <FormGroup>
            <TextField
              className={classes.urlField}
              label="YouTube動画のURL"
              // onChange={handleChange}
              name="workVideoUrl"
              value={settings.workVideoUrl}
              onFocus={(event) => {
                event.target.select();
              }}
            ></TextField>
            {/* {(() => {
              if (props.settings.workVideoUrl !== "" && renderWorkVideo) {
                return (
                  <>
                    <br />
                    <Typography>
                      {workVideoTitle !== "" ? workVideoTitle : ""}
                    </Typography>
                    <YouTube
                      videoId={
                        props.settings.workVideoUrl.split(/v=|\//).slice(-1)[0]
                      }
                      opts={playerOptions}
                      onReady={onPlayerReady}
                      id="workVideoPlayer"
                    />
                  </>
                );
              } else {
                return (
                  <>
                    <br />
                  </>
                );
              }
            })()} */}
            <Box mt={1} />
            <VolumeSlider
              helperText="音量(作業用BGM)"
              settings={settings}
              setSettings={setSettings}
            />
          </FormGroup>
        </FormControl>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel>
            <MusicVideoIcon className={classes.musicVideoIcon} />
            ☕休憩用BGM
          </FormLabel>
          <FormGroup>
            <TextField
              className={classes.urlField}
              label="YouTube動画のURL"
              // onChange={handleChange}
              name="breakVideoUrl"
              value={settings.breakVideoUrl}
              onFocus={(event) => {
                event.target.select();
              }}
            ></TextField>
            {/* {(() => {
              if (props.settings.breakVideoUrl !== "" && renderBreakVideo) {
                return (
                  <>
                    <br />
                    <Typography>
                      {breakVideoTitle !== "" ? breakVideoTitle : ""}
                    </Typography>
                    <YouTube
                      videoId={
                        props.settings.breakVideoUrl.split(/v=|\//).slice(-1)[0]
                      }
                      opts={playerOptions}
                      onReady={onPlayerReady}
                      id="breakVideoPlayer"
                    />
                  </>
                );
              } else {
                return (
                  <>
                    <br />
                  </>
                );
              }
            })()} */}
            <Box mt={1} />
            <VolumeSlider
              helperText="音量(休憩用BGM)"
              settings={settings}
              setSettings={setSettings}
            />
          </FormGroup>
        </FormControl>

        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">タイマー作動中の効果音</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  // checked={props.settings.tick}
                  // onChange={handleChange}
                  name="tick"
                />
              }
              label="かすかなチクタク音"
            />
          </FormGroup>
        </FormControl>
      </Card>
      <Card
        style={{
          width: "95%",
          padding: "1rem",
          // marginLeft: "1rem",
          marginBottom: "1rem",
        }}
      >
        <Typography>Slack連携設定</Typography>
        {state.userId === "" && (
          <FormHelperText>
            ログインしていない場合、この設定はページをリロードするとリセットされます。
          </FormHelperText>
        )}
        <form autoComplete="on">
          <TextField
            label="ユーザー名(任意)"
            name="slackUserName"
            variant="outlined"
            size="small"
            defaultValue={state.slackUserName}
            onChange={onSlackUserNameChange}
            className={classes.slackTextField}
            disabled={settingDisabled}
          />
          <TextField
            label="Slack Webhook URL"
            name="slackWebhookUrl"
            variant="outlined"
            size="small"
            fullWidth
            defaultValue={state.slackWebhookUrl}
            onChange={onSlackWebhookUrlChange}
            className={classes.slackTextField}
            disabled={settingDisabled}
          />
          <Box mt={1} />
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            onClick={onApplyButtonClick}
            disabled={settingDisabled}
          >
            <SyncIcon />
            適用する
          </Button>
        </form>
      </Card>
      <SimpleSnackbar
        open={snackbarOpen}
        setOpen={setSnackbarOpen}
        message="適用しました！"
      />
    </>
  );
};

export default Settings;
