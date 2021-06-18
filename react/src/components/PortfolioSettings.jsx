import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@material-ui/core";
import { Context } from "../contexts/Context";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import SimpleSnackbar from "./SimpleSnackbar";
import TagsInput from "./TagsInput";
import SyncIcon from "@material-ui/icons/Sync";
import { Link } from "react-router-dom";

const PortfolioSettings = () => {
  const [state, setState] = useContext(Context);
  const [userName, setUserName] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [skillSet, setSkillSet] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [profileDisabled, setProfileDisabled] = useState(true);

  useEffect(() => {
    // 未ログイン時はホームにリダイレクト
    if (state.userId === "") {
      document.getElementById("linkToHome").click();
    }
  }, []);

  // クリップボードにコピーするボタンがクリックされたときの処理です。
  const onClipBoardButtonClick = () => {
    // 一時的に要素を追加
    let textArea = document.createElement("textarea");
    textArea.innerHTML = document.location.href + "/" + state.reportId;
    textArea.id = "copyArea";
    document.getElementById("root").appendChild(textArea);
    textArea.select(document.getElementById("copyArea"));
    document.execCommand("Copy");
    document.getElementById("copyArea").remove();
    setSnackbarMessage("URLをコピーしました！");
    setSnackbarOpen(true);
  };

  const handleSelecetedTags = (items) => {
    setSkillSet(items);
  };

  // 適用するボタンが押されたときの処理です。
  const onApplyButtonClick = () => {};

  return (
    <>
      <Card
        style={{
          width: "95%",
          padding: "1rem",
          marginLeft: "1rem",
          marginBottom: "1rem",
        }}
      >
        <Typography variant="h6">プロフィール設定</Typography>
        <Divider style={{ margin: "0.5rem 0" }} />
        <div style={{ width: "360px" }}>
          {/* TODO: バリデーション */}
          <Typography>名前</Typography>
          <TextField
            variant="outlined"
            onChange={(e) => {
              setUserName(e.target.value);
            }}
            fullWidth
            disabled={profileDisabled}
            value={userName}
          />
          <Typography>紹介文</Typography>
          <TextField
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            rowsMax={10}
            inputProps={{
              maxLength: "400",
            }}
            placeholder="自己アピールをどうぞ！"
            onChange={(e) => {
              setIntroduction(e.target.value);
            }}
            disabled={profileDisabled}
            value={introduction}
          />
        </div>
        <Typography>スキルセット</Typography>
        <TagsInput
          selectedTags={handleSelecetedTags}
          fullWidth
          variant="outlined"
          id="tags"
          name="tags"
          placeholder="スキルを入力してEnterで追加"
          disabled={profileDisabled}
          skillSet={skillSet}
          setSkillSet={setSkillSet}
        />
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          style={{ marginTop: "1rem" }}
          onClick={onApplyButtonClick}
          disabled={profileDisabled}
        >
          <SyncIcon />
          適用する
        </Button>
      </Card>
      <Card
        style={{
          width: "95%",
          padding: "1rem",
          marginLeft: "1rem",
          marginBottom: "1rem",
        }}
      >
        <Typography>ポートフォリオ公開URL</Typography>
        <TextField
          variant="outlined"
          fullWidth
          value={document.location.href + "/" + state.reportId}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton size="small" onClick={onClipBoardButtonClick}>
                  <AttachFileIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <SimpleSnackbar
          open={snackbarOpen}
          setOpen={setSnackbarOpen}
          message={snackbarMessage}
        />
      </Card>
      <Link to="/" id="linkToHome" style={{ visibility: "hidden" }}>
        ホームに戻る
      </Link>
    </>
  );
};

export default PortfolioSettings;
