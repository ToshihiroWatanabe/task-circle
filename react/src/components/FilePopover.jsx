import React, { useState, memo, useCallback } from "react";
import {
  makeStyles,
  Popover,
  IconButton,
  Tooltip,
  Button,
  Snackbar,
} from "@material-ui/core";
import "components/FilePopover.css";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import { DropzoneArea } from "material-ui-dropzone";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

/** Material-UIのスタイル */
const useStyles = makeStyles((theme) => ({}));

/**
 * アカウントアイコンメニューのコンポーネントです。
 */
const FilePopover = memo((props) => {
  /** Material-UIのスタイル */
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);

  /**
   * アイコンがクリックされたときの処理です。
   * @param {*} event
   */
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSuccessSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccessSnackbarOpen(false);
  };

  /**
   * ドロップゾーンのファイルに変更があったときの処理です。
   */
  const onDropzoneChange = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () =>
        console.error("ファイルの読み込みが中止されました");
      reader.onerror = () => console.error("ファイルの読み込みに失敗しました");
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result;
        const text = new Buffer(binaryStr, "base64");
        props.importReportsFromJson(JSON.parse(text));
        setSuccessSnackbarOpen(true);
        // Popoverを閉じる
        setAnchorEl(null);
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);

  return (
    <>
      <Tooltip title="データの移行">
        <IconButton onClick={handleClick} color="inherit">
          <FileCopyIcon />
        </IconButton>
      </Tooltip>
      <Popover
        disableScrollLock={true}
        id="filePopover"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        getContentAnchorEl={null}
      >
        <DropzoneArea
          filesLimit={1}
          acceptedFiles={(["text/*"], ["application/json"])}
          onChange={(files) => onDropzoneChange(files)}
          maxFileSize={10_485_760}
          dropzoneText="JSONファイルから日報をインポート"
          showAlerts={false}
          showPreviewsInDropzone={false}
          Icon={() => {
            return (
              <>
                <AttachFileIcon />
              </>
            );
          }}
        />
        <Button
          onClick={props.onExportReportsToJsonButtonClick}
          variant="outlined"
          style={{ marginTop: "0.5rem" }}
        >
          JSON形式でエクスポート
        </Button>
        <Button
          onClick={props.onExportReportsToTxtButtonClick}
          variant="outlined"
          style={{ marginTop: "0.5rem" }}
        >
          テキスト形式でエクスポート
        </Button>
      </Popover>
      <Snackbar
        open={successSnackbarOpen}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={5000}
        onClose={(event, reason) => handleSuccessSnackbarClose(event, reason)}
      >
        <Alert
          onClose={(event, reason) => handleSuccessSnackbarClose(event, reason)}
          severity="success"
        >
          日報データをインポートしました！
        </Alert>
      </Snackbar>
    </>
  );
});

export default FilePopover;
