import React, { useState, memo, useCallback, useContext } from "react";
import {
  makeStyles,
  Popover,
  IconButton,
  Tooltip,
  Button,
  Snackbar,
} from "@material-ui/core";
import "components/header/FilePopover.css";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import { DropzoneArea } from "material-ui-dropzone";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MuiAlert from "@material-ui/lab/Alert";
import { Context } from "contexts/Context";
import { exportReportsToTxt, exportReportsToJson } from "utils/export";
import {
  NUMBER_OF_TASKS_MAX,
  REPORT_ITEMS_CATEGORY_MAX,
  REPORT_ITEMS_CONTENT_MAX,
  REPORT_CONTENT_MAX,
} from "utils/constant";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: "0.5rem",
  },
}));

/**
 * ファイルポップオーバーのコンポーネントです。
 */
const FilePopover = memo((props) => {
  const classes = useStyles();
  const [state, setState] = useContext(Context);
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
        const text = new Buffer.from(binaryStr, "base64");
        importReportsFromJson(JSON.parse(text));
        setSuccessSnackbarOpen(true);
        // Popoverを閉じる
        setAnchorEl(null);
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);

  /**
   * JSONから日報をインポートする処理です。
   * @param {*} data
   */
  const importReportsFromJson = (data) => {
    // TODO: データのフォーマットが正しいか検証する処理を入れる？例外処理
    let additionalReports = [];
    // 日報の数だけ繰り返す
    for (let i = 0; i < data.length; i++) {
      let additionalReportItems = [];
      // 日報のタスクの数だけ繰り返す(最大数を超えている場合は最大数)
      for (
        let j = 0;
        j <
        (data[i].report_items.length > NUMBER_OF_TASKS_MAX
          ? NUMBER_OF_TASKS_MAX
          : data[i].report_items.length);
        j++
      ) {
        additionalReportItems.push({
          category: data[i].report_items[j].category.substring(
            0,
            REPORT_ITEMS_CATEGORY_MAX
          ),
          content: data[i].report_items[j].content.substring(
            0,
            REPORT_ITEMS_CONTENT_MAX
          ),
          hour: data[i].report_items[j].hour,
          minute: data[i].report_items[j].minute,
        });
      }
      additionalReports.push({
        date: data[i].date,
        report_items: additionalReportItems,
        content: data[i].content.substring(0, REPORT_CONTENT_MAX),
        updatedAt: data[i].updatedAt,
      });
    }
    setState((state) => {
      let newReports = [...additionalReports, ...state.reports]
        // 更新日が新しい順に並べ替え
        .sort((a, b) => {
          if (a.updatedAt === undefined) a.updatedAt = 0;
          if (b.updatedAt === undefined) b.updatedAt = 0;
          return b.updatedAt - a.updatedAt;
        })
        // 重複を削除
        .filter(
          (element, index, array) =>
            array.findIndex((e) => e.date === element.date) === index
        )
        // 日付が新しい順に並べ替え
        .sort((a, b) => {
          return b.date.replaceAll("-", "") - a.date.replaceAll("-", "");
        });
      localStorage.setItem("reports", JSON.stringify(newReports));
      return { ...state, reports: newReports };
    });
  };

  /**
   * テキスト形式でエクスポートするボタンが押されたときの処理です。
   */
  const onExportReportsToTxtButtonClick = () => {
    exportReportsToTxt(state.reports);
  };

  /**
   * JSON形式でエクスポートするボタンが押されたときの処理です。
   */
  const onExportReportsToJsonButtonClick = () => {
    exportReportsToJson(state.reports);
  };

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
          onClick={onExportReportsToJsonButtonClick}
          variant="outlined"
          className={classes.button}
        >
          JSON形式でエクスポート
        </Button>
        <Button
          onClick={onExportReportsToTxtButtonClick}
          variant="outlined"
          className={classes.button}
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
