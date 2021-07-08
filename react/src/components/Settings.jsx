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
  CircularProgress,
  Select,
  Switch,
} from "@material-ui/core";
import SimpleSnackbar from "components/SimpleSnackbar";
import MusicVideoIcon from "@material-ui/icons/MusicVideo";
import YouTube from "react-youtube";
import { SettingsContext } from "contexts/SettingsContext";
import VolumeSlider from "./VolumeSlider";
import YouTubeIcon from "@material-ui/icons/YouTube";
import NotificationsNoneOutlinedIcon from "@material-ui/icons/NotificationsNoneOutlined";
import AddAlertIcon from "@material-ui/icons/AddAlert";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import ShareIcon from "@material-ui/icons/Share";
import TwitterIcon from "@material-ui/icons/Twitter";
import { StateContext } from "contexts/StateContext";
import SettingService from "services/setting.service";

let updateTimeout = 0;

/** YouTube動画再生オプション */
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
    width: "calc(100% - 2rem)",
    padding: "1rem",
    marginBottom: "1rem",
    [theme.breakpoints.down("xs")]: {
      width: "calc(100% - 8px)",
    },
  },
  formLabel: {
    color: "inherit",
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
  iconMarginBottom: {
    marginBottom: "-0.4rem",
  },
  youTubeIcon: {
    color: "#ff1a1a",
    marginBottom: "-0.4rem",
  },
  circularProgress: {
    marginLeft: theme.spacing(2),
  },
  imageIcon: {
    height: "2rem",
    marginRight: "-0.7rem",
    transform: "translate(-15%, 30%)",
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
  const [state, setState] = useContext(StateContext);
  const [settings, setSettings] = useContext(SettingsContext);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [workVideoTitle, setWorkVideoTitle] = useState("");
  const [breakVideoTitle, setBreakVideoTitle] = useState("");
  const [renderWorkVideo, setRenderWorkVideo] = useState(true);
  const [renderBreakVideo, setRenderBreakVideo] = useState(true);

  useEffect(() => {}, []);

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
      updateSettings(settings);
      return settings;
    });
  };

  /**
   * ローカルストレージとDBの設定を更新します。
   */
  const updateSettings = (settings) => {
    localStorage.setItem("settings", JSON.stringify(settings));
    localStorage.setItem("settingsUpdatedAt", Date.now());
    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(() => {
      if (state.isLogined) {
        setState((state) => {
          return { ...state, isInSync: true };
        });
        // DBの設定を取得
        SettingService.findByTokenId(state.tokenId).then((r) => {
          console.log(r);
          // ローカルのデータより新しいかどうか比較する
          if (
            new Date(r.data.updatedAt).getTime() >
            localStorage.getItem("settingsUpdatedAt")
          ) {
            // ローカルのデータをDBのデータに上書きする
            setSettings((settings) => {
              const newSettings = {
                ...settings,
                ...JSON.parse(r.data.setting),
              };
              localStorage.setItem("settings", JSON.stringify(newSettings));
              localStorage.setItem(
                "settingsUpdatedAt",
                new Date(r.data.updatedAt).getTime()
              );
              return newSettings;
            });
          }
        });
        setSettings((settings) => {
          SettingService.update(state.tokenId, JSON.stringify(settings));
          return settings;
        });
        setState((state) => {
          return { ...state, isInSync: false };
        });
      }
    }, 1000);
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

  /**
   * 通知をオンにするボタンがクリックされたときの処理です。
   */
  const addAlertButtonClick = () => {
    Notification.requestPermission().then(() => {
      const options = {
        body: "アプリを使っていただき、ありがとうございます！",
      };
      new Notification("通知はオンです", options);
    });
  };

  /**
   * 時間のフォーマット(クリップボードへのコピー時)が変更されたときの処理です。
   * @param {*} event
   */
  const onTimeFormatToClipboardChange = (event) => {
    setSettings((settings) => {
      settings = { ...settings, timeFormatToClipboard: event.target.value };
      updateSettings(settings);
      return settings;
    });
  };

  /**
   * ツイートボタンのオンオフが変更されたときの処理です。
   * @param {*} evnet
   */
  const onTweetButtonEnabledChange = (event) => {
    setSettings((settings) => {
      settings = { ...settings, isTweetButtonEnabled: event.target.checked };
      updateSettings();
      return settings;
    });
  };

  /**
   * ツイート時の定型文が変更されたときの処理です。
   * @param {*} event
   */
  const onTweetTemplateChange = (event) => {
    setSettings((settings) => {
      settings = { ...settings, tweetTemplate: event.target.value };
      updateSettings(settings);
      return settings;
    });
  };

  return (
    <>
      <Card className={classes.card}>
        <Typography>
          <MusicVideoIcon className={classes.iconMarginBottom} />
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
                      <YouTubeIcon className={classes.youTubeIcon} />
                      {workVideoTitle !== "" ? (
                        workVideoTitle
                      ) : (
                        <CircularProgress
                          size={20}
                          className={classes.circularProgress}
                        />
                      )}
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
              updateSettings={updateSettings}
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
                      <YouTubeIcon className={classes.youTubeIcon} />
                      {breakVideoTitle !== "" ? (
                        breakVideoTitle
                      ) : (
                        <CircularProgress
                          size={20}
                          className={classes.circularProgress}
                        />
                      )}
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
      {/* 通知設定 */}
      <Card className={classes.card}>
        <Typography>
          <NotificationsNoneOutlinedIcon className={classes.iconMarginBottom} />
          通知設定
        </Typography>
        <Box mt={1} />
        <Button
          variant="contained"
          color="secondary"
          style={{ width: "16rem" }}
          onClick={() => {
            addAlertButtonClick();
          }}
        >
          <AddAlertIcon />
          デスクトップ通知をオンにする
        </Button>
      </Card>
      {/* 出力設定 */}
      <Card className={classes.card}>
        <Typography>
          <ImportExportIcon className={classes.iconMarginBottom} />
          出力設定
        </Typography>
        <Box mt={1} />
        <Typography>
          時間のフォーマット
          <span style={{ fontSize: "0.6rem" }}>
            (クリップボードへのコピー時)
          </span>
        </Typography>
        <Select
          native
          style={{ width: "16rem" }}
          value={settings.timeFormatToClipboard}
          onChange={onTimeFormatToClipboardChange}
        >
          <option value={"HH:MM:SS"}>HH:MM:SS</option>
          <option value={"HH時間MM分SS秒"}>HH時間MM分SS秒</option>
          <option value={"BuildUp"}>BuildUp</option>
        </Select>
      </Card>
      {/* 共有設定 */}
      <Card className={classes.card}>
        <Typography>
          <ShareIcon className={classes.iconMarginBottom} />
          共有設定
        </Typography>
        <Box mt={1} />
        <Typography style={{ display: "flex", alignItems: "center" }}>
          <TwitterIcon color="primary" />
          ツイートボタン
          <Switch
            checked={settings.isTweetButtonEnabled}
            onChange={onTweetButtonEnabledChange}
            inputProps={{
              "aria-label": "checkbox",
            }}
          />
        </Typography>
        <TextField
          label="定型文"
          value={settings.tweetTemplate}
          size="small"
          placeholder="#TaskCircle"
          variant="outlined"
          multiline
          rowsMax={4}
          style={{ width: "16rem" }}
          onChange={onTweetTemplateChange}
        ></TextField>
      </Card>
      {/* Snackbar */}
      <SimpleSnackbar
        open={snackbarOpen}
        setOpen={setSnackbarOpen}
        message="適用しました！"
      />
    </>
  );
};

export default Settings;
