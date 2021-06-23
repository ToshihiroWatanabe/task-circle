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
  FormGroup,
  FormHelperText,
} from "@material-ui/core";
import { Context } from "contexts/Context";
import SyncIcon from "@material-ui/icons/Sync";
import SimpleSnackbar from "components/SimpleSnackbar";
import MusicVideoIcon from "@material-ui/icons/MusicVideo";
import YouTube from "react-youtube";
import { SettingsContext } from "contexts/SettingsContext";
import VolumeSlider from "./VolumeSlider";

/**
 * YouTube動画再生オプション
 */
const playerOptions = {
  height: "1",
  width: "1",
  playerVars: {
    autoplay: 0,
  },
};

const useStyles = makeStyles((theme) => ({
  card: {
    display: "flex",
    flexDirection: "column",
    width: "95%",
    padding: "1rem",
    marginBottom: "1rem",
  },
  formLabel: {
    color: "black",
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
    marginBottom: "-0.4rem",
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
  const [workVideoTitle, setWorkVideoTitle] = useState("");
  const [breakVideoTitle, setBreakVideoTitle] = useState("");
  const [renderWorkVideo, setRenderWorkVideo] = useState(true);
  const [renderBreakVideo, setRenderBreakVideo] = useState(true);

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

  /**
   * 設定に変化があったときの処理です。
   * @param {} event
   */
  const handleChange = (event) => {
    setSettings((settings) => {
      if (event.target.name === "workVideoUrl") {
        setWorkVideoTitle("");
        setRenderWorkVideo(false);
        setTimeout(() => {
          setRenderWorkVideo(true);
        }, 10);
      }
      if (event.target.name === "breakVideoUrl") {
        setBreakVideoTitle("");
        setRenderBreakVideo(false);
        setTimeout(() => {
          setRenderBreakVideo(true);
        }, 10);
      }
      settings = {
        ...settings,
        [event.target.name]: event.target.name.match(/.*VideoUrl/)
          ? event.target.value
          : event.target.checked,
      };
      localStorage.setItem("settings", JSON.stringify(settings));
      return settings;
    });
  };

  /**
   * 動画プレーヤーが準備完了したときの処理です。
   */
  const onPlayerReady = (event) => {
    if (event.target.h.id === "workVideoPlayer") {
      setWorkVideoTitle(event.target.playerInfo.videoData.title);
    }
    if (event.target.h.id === "breakVideoPlayer") {
      setBreakVideoTitle(event.target.playerInfo.videoData.title);
    }
  };

  return (
    <>
      <Card className={classes.card}>
        <Typography>
          <MusicVideoIcon className={classes.musicVideoIcon} />
          サウンド設定
        </Typography>
        <FormHelperText>
          一部の設定はタイマーを停止させないと反映されません。
        </FormHelperText>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel className={classes.formLabel}>🍅作業用BGM</FormLabel>
          <Box mt={1} />
          <FormGroup>
            <TextField
              className={classes.urlField}
              label="YouTube動画のURL"
              onChange={handleChange}
              name="workVideoUrl"
              value={settings.workVideoUrl}
              onFocus={(event) => {
                event.target.select();
              }}
            ></TextField>
            {(() => {
              if (settings.workVideoUrl !== "" && renderWorkVideo) {
                return (
                  <>
                    <br />
                    <Typography>
                      {workVideoTitle !== "" ? workVideoTitle : ""}
                    </Typography>
                    <YouTube
                      videoId={
                        settings.workVideoUrl.split(/v=|\//).slice(-1)[0]
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
            })()}
            <Box mt={1} />
            <VolumeSlider
              helperText="音量(作業用BGM)"
              settings={settings}
              setSettings={setSettings}
            />
          </FormGroup>
        </FormControl>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel className={classes.formLabel}>☕休憩用BGM</FormLabel>
          <Box mt={1} />
          <FormGroup>
            <TextField
              className={classes.urlField}
              label="YouTube動画のURL"
              onChange={handleChange}
              name="breakVideoUrl"
              value={settings.breakVideoUrl}
              onFocus={(event) => {
                event.target.select();
              }}
            ></TextField>
            {(() => {
              if (settings.breakVideoUrl !== "" && renderBreakVideo) {
                return (
                  <>
                    <br />
                    <Typography>
                      {breakVideoTitle !== "" ? breakVideoTitle : ""}
                    </Typography>
                    <YouTube
                      videoId={
                        settings.breakVideoUrl.split(/v=|\//).slice(-1)[0]
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
            })()}
            <Box mt={1} />
            <VolumeSlider
              helperText="音量(休憩用BGM)"
              settings={settings}
              setSettings={setSettings}
            />
          </FormGroup>
        </FormControl>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel className={classes.formLabel}>
            開始・停止・アラーム音
          </FormLabel>
          <Box mt={1} />
          <VolumeSlider
            helperText="その他の音"
            settings={settings}
            setSettings={setSettings}
          />
        </FormControl>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel className={classes.formLabel}>チクタク音</FormLabel>
          <Box mt={1} />
          <VolumeSlider
            helperText="チクタク音"
            settings={settings}
            setSettings={setSettings}
          />
          {settings.tickVolume === 0 && (
            <Typography variant="caption">
              チクタク音のボリュームが0だと、動作が不安定になる場合があります。
            </Typography>
          )}
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
