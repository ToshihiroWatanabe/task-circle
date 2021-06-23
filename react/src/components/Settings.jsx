import React, { useContext, useEffect, useState } from "react";
import {
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
  Divider,
} from "@material-ui/core";
import WarningIcon from "@material-ui/icons/Warning";
import MusicVideoIcon from "@material-ui/icons/MusicVideo";
import YouTube from "react-youtube";
import SimpleSelect from "./VolumeSelect";
import { SettingsContext } from "contexts/SettingsContext";

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
  },
  urlField: {
    width: "100%",
  },
  musicVideoIcon: {
    marginBottom: theme.spacing(0.5),
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
            <SimpleSelect
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
            <SimpleSelect
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
            <FormHelperText>
              一部の設定はタイマーを停止させないと反映されません。
            </FormHelperText>
          </FormGroup>
        </FormControl>
        <Divider />
        <Button
          variant="contained"
          color="secondary"
          // onClick={handleTodoListDeleteClick}
          className={classes.allDeleteButton}
        >
          <WarningIcon />
          Todoリストのタスクを全て消去
        </Button>
        <Divider />
        <Button
          variant="contained"
          color="secondary"
          // onClick={handleAllDeleteClick}
          className={classes.allDeleteButton}
        >
          <WarningIcon />
          ローカルデータを全て消去
        </Button>
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
          {state.userId === "" && (
            <>
              ※ログインしていない場合、この設定はページをリロードするとリセットされます。
            </>
          )}
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
