import React, { Fragment, memo, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  Popper,
  Tooltip,
  useMediaQuery,
  useTheme,
  Select,
} from "@material-ui/core";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import DeleteIcon from "@material-ui/icons/Delete";
import "components/reports/ReportFormDialog.css";

const useStyles = makeStyles((theme) => ({
  reportItem: {
    alignItems: "center",
    [theme.breakpoints.down("sm")]: { display: "inline-flex", flex: "auto" },
    [theme.breakpoints.up("sm")]: { display: "flex" },
  },
}));

const hours = [];
for (let i = 0; i <= 24; i++) {
  hours.push({ label: i.toString(), value: i });
}

const minutes = [];
minutes.push({ label: "0", value: 0 });
minutes.push({ label: "15", value: 15 });
minutes.push({ label: "30", value: 30 });
minutes.push({ label: "45", value: 45 });
for (let i = 0; i <= 59; i++) {
  minutes.push({ label: i.toString(), value: i });
}

const filterOptions = createFilterOptions({
  matchFrom: "start",
});

let isControlPressed = false;

/** タスク数の上限 */
const REPORT_ITEMS_MAX = 32;
/** カテゴリーの文字数制限 */
const REPORT_ITEMS_CATEGORY_MAX = 45;
/** 内容の文字数制限 */
const REPORT_ITEMS_CONTENT_MAX = 45;
/** 感想の文字数制限 */
const REPORT_CONTENT_MAX = 304;

/**
 * 日報データを入力するダイアログのコンポーネントです。
 * @param {*} props
 */
const ReportFormDialog = memo((props) => {
  const classes = useStyles();
  const theme = useTheme();
  const isBreakPointsDownXs = useMediaQuery(theme.breakpoints.down("xs"));

  const [report, setReport] = useState(props.defaultReport);

  useEffect(() => {
    if (props.open) {
      setReport(props.defaultReport);
    }
  }, [props.open, props.defaultReport]);

  /**
   * キャンセルボタンが押されたときの処理です。
   */
  const onCancelButtonClick = () => {
    props.setOpen(false);
  };

  /**
   * 作成ボタンが押されたときの処理です。
   */
  const onCreateButtonClick = () => {
    if (validate()) {
      props.setOpen(false);
      let input = {
        date: props.defaultReport.date,
        content: report.content,
        report_items: report.report_items,
        updatedAt: Date.now(),
      };
      props.onCreate(input);
    }
  };

  /**
   * 入力されたデータを検証します。
   */
  const validate = () => {
    for (let i = 0; i < report.report_items.length; i++) {
      let category = report.report_items[i].category.trim();
      if (category.length > REPORT_ITEMS_CATEGORY_MAX) {
        console.error(
          "カテゴリーは" +
            REPORT_ITEMS_CATEGORY_MAX +
            "文字以内で入力してください"
        );
      } else if (category.length === 0) {
        console.error("カテゴリーを入力してください");
      }
    }
    return true;
  };

  /**
   * 追加ボタンがクリックされたときの処理です。
   */
  const onAddButtonClick = () => {
    setReport((report) => {
      report.report_items.push({
        ...{
          category: "",
          content: "",
          hour: 1,
          minute: 0,
        },
      });
      return { ...report };
    });
  };

  /**
   * 削除ボタンがクリックされたときの処理です。
   * @param {*} index
   */
  const onDeleteButtonClick = (index) => {
    setReport((report) => {
      let newReportItems = report.report_items.filter((e, i) => {
        return i !== index;
      });
      return { ...report, report_items: newReportItems };
    });
  };

  /**
   * カテゴリーの選択肢が選ばれたときの処理です。
   * @param {*} index
   * @param {*} value
   */
  const onCategoryChange = (index, value, reason) => {
    if (value === undefined) {
      document.activeElement.blur();
    }
    if (reason === "select-option") {
      setReport((report) => {
        report.report_items[index].category = value;
        return {
          date: report.date,
          content: report.content,
          report_items: report.report_items,
          updatedAt: report.updatedAt,
        };
      });
    }
  };

  /**
   * カテゴリーの選択肢が閉じられたときの処理です。
   * @param {*} index
   * @param {*} event
   */
  const onCategoryClose = (index, event, reason) => {
    // カーソルが外れて選択肢が閉じられた場合
    if (reason === "blur") {
      setReport((report) => {
        report.report_items[index].category = event.target.value;
        return {
          date: report.date,
          content: report.content,
          report_items: report.report_items,
          updatedAt: report.updatedAt,
        };
      });
    }
  };

  /**
   * 内容に変化があったときの処理です。
   * @param {*} index
   * @param {*} target
   */
  const onItemContentChange = (index, target) => {
    setReport((report) => {
      report.report_items[index].content = target.value;
      return {
        date: report.date,
        content: report.content,
        report_items: report.report_items,
        updatedAt: report.updatedAt,
      };
    });
  };

  /**
   * 時間の選択肢が選ばれたときの処理です。
   * @param {*} index
   * @param {*} value
   */
  const onHourChange = (index, value) => {
    setReport((report) => {
      report.report_items[index].hour = value;
      return {
        date: report.date,
        content: report.content,
        report_items: report.report_items,
        updatedAt: report.updatedAt,
      };
    });
  };

  /**
   * 時間のキーボード入力の処理です。
   * @param {*} index
   * @param {*} target
   */
  const onHourTextChange = (index, target) => {
    // 全角数字が含まれていたら半角数字に変換
    target.value = target.value.replace(/[０-９]/g, (s) => {
      return String.fromCharCode(s.charCodeAt(0) - 65248);
    });
    if (target.value.match(/.*\d.*/)) {
      setReport((report) => {
        report.report_items[index].hour =
          parseInt(target.value) > 24 ? 24 : parseInt(target.value);
        return {
          date: report.date,
          content: report.content,
          report_items: report.report_items,
          updatedAt: report.updatedAt,
        };
      });
    } else {
      setReport((report) => {
        report.report_items[index].hour = 0;
        return {
          date: report.date,
          content: report.content,
          report_items: report.report_items,
          updatedAt: report.updatedAt,
        };
      });
    }
  };

  /**
   * 分の選択肢が選ばれたときの処理です。
   * @param {*} index
   * @param {*} value
   */
  const onMinuteChange = (index, value) => {
    setReport((report) => {
      report.report_items[index].minute = value;
      return {
        date: report.date,
        content: report.content,
        report_items: report.report_items,
        updatedAt: report.updatedAt,
      };
    });
  };

  /**
   * 分のキーボード入力の処理です。
   * @param {*} index
   * @param {*} target
   */
  const onMinuteTextChange = (index, target) => {
    // 全角数字が含まれていたら半角数字に変換
    target.value = target.value.replace(/[０-９]/g, (s) => {
      return String.fromCharCode(s.charCodeAt(0) - 65248);
    });
    if (target.value.match(/.*\d.*/)) {
      setReport((report) => {
        report.report_items[index].minute =
          parseInt(target.value) > 59 ? 59 : parseInt(target.value);
        return {
          date: report.date,
          content: report.content,
          report_items: report.report_items,
          updatedAt: report.updatedAt,
        };
      });
    } else {
      setReport((report) => {
        report.report_items[index].minute = 0;
        return {
          date: report.date,
          content: report.content,
          report_items: report.report_items,
          updatedAt: report.updatedAt,
        };
      });
    }
  };

  /**
   * 感想に変化があったときの処理です。
   * @param {*} event
   */
  const onContentChange = (event) => {
    setReport((report) => {
      return { ...report, content: event.target.value };
    });
  };

  /** オートコンプリートの選択肢 */
  const Popper4rem = function (props) {
    return (
      <Popper {...props} style={{ width: "4rem" }} placement="bottom-start" />
    );
  };
  const Popper8rem = function (props) {
    return (
      <Popper {...props} style={{ width: "8rem" }} placement="bottom-start" />
    );
  };

  /**
   * キーが押下されたときの処理です。
   * @param {*} event
   */
  const onKeyDown = (event) => {
    if (event.key === "Control") {
      isControlPressed = true;
    }
    if (event.key === "Enter" && isControlPressed) {
      document.activeElement.blur();
      isControlPressed = false;
      onCreateButtonClick();
    }
  };

  /**
   * キーが離れたときの処理です。
   * @param {*} event
   */
  const onKeyUp = (event) => {
    if (event.key === "Control") {
      isControlPressed = false;
    }
  };

  return (
    <>
      <Dialog
        fullScreen={isBreakPointsDownXs}
        open={props.open}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        // 別の場所をクリックした時
        // onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {report.updatedAt === 0 ? "日報作成" : "日報編集"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {props.defaultReport.date.replaceAll("-", ".")}
          </DialogContentText>
          {report.report_items.map((value, index) => {
            return (
              <div key={index} className={classes.reportItem}>
                <Autocomplete
                  freeSolo
                  disableClearable
                  PopperComponent={Popper8rem}
                  options={props.categories}
                  getOptionLabel={(option) => option.label}
                  filterOptions={filterOptions}
                  value={{
                    label: value.category,
                    value: value.category,
                  }}
                  onChange={(e, v, r) => onCategoryChange(index, v.value, r)}
                  onClose={(e, r) => onCategoryClose(index, e, r)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      autoFocus
                      label="カテゴリー"
                      variant="outlined"
                      margin="dense"
                      style={{ width: "8rem", marginRight: "4px" }}
                      inputProps={{
                        ...params.inputProps,
                        maxLength: REPORT_ITEMS_CATEGORY_MAX,
                      }}
                    />
                  )}
                />
                <TextField
                  label="内容"
                  variant="outlined"
                  margin="dense"
                  value={value.content}
                  onChange={(e, v) => onItemContentChange(index, e.target)}
                  style={{ width: "14rem", marginRight: "4px" }}
                  inputProps={{ maxLength: REPORT_ITEMS_CONTENT_MAX }}
                />
                {/* 時間 */}
                <FormControl>
                  {!isBreakPointsDownXs && (
                    <Autocomplete
                      freeSolo
                      disableClearable // バツマークを無効にする
                      PopperComponent={Popper4rem}
                      options={hours}
                      getOptionLabel={(option) => option.label}
                      filterOptions={filterOptions}
                      value={{
                        label: value.hour.toString(),
                        value: value.hour,
                      }}
                      onChange={(e, v) => onHourChange(index, v.value)}
                      onFocus={(e) => {
                        e.target.select();
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          margin="dense"
                          style={{
                            width: "2rem",
                            marginRight: "4px",
                          }}
                          onChange={(e, v) => onHourTextChange(index, e.target)}
                          value={{
                            label: value.hour.toString(),
                            value: value.hour,
                          }}
                          inputProps={{
                            ...params.inputProps,
                            maxLength: 2,
                            style: { textAlign: "right" },
                          }}
                        />
                      )}
                    />
                  )}
                  {isBreakPointsDownXs && (
                    <Select
                      native
                      value={value.hour}
                      IconComponent={() => <></>}
                      onChange={(e) => {
                        onHourTextChange(index, e.target);
                      }}
                    >
                      {hours.map((value, index) => {
                        return (
                          <option key={index} value={value.value}>
                            {value.label}
                          </option>
                        );
                      })}
                    </Select>
                  )}
                </FormControl>
                <div>時間</div>
                {/* 分 */}
                <FormControl>
                  {!isBreakPointsDownXs && (
                    <Autocomplete
                      freeSolo
                      disableClearable // バツマークを無効にする
                      PopperComponent={Popper4rem}
                      options={minutes}
                      getOptionLabel={(option) => option.label}
                      filterOptions={filterOptions}
                      value={{
                        label: report.report_items[index].minute.toString(),
                        value: report.report_items[index].minute,
                      }}
                      onChange={(e, v) => onMinuteChange(index, v.value)}
                      onFocus={(e) => {
                        e.target.select();
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          margin="dense"
                          style={{
                            width: "2rem",
                            marginRight: "4px",
                          }}
                          onChange={(e, v) =>
                            onMinuteTextChange(index, e.target)
                          }
                          value={{
                            label: value.minute.toString(),
                            value: value.minute,
                          }}
                          inputProps={{
                            ...params.inputProps,
                            maxLength: 2,
                            style: { textAlign: "right" },
                          }}
                        />
                      )}
                    />
                  )}
                  {isBreakPointsDownXs && (
                    <Select
                      native
                      value={value.minute}
                      IconComponent={() => <></>}
                      onChange={(e) => {
                        onMinuteTextChange(index, e.target);
                      }}
                    >
                      {minutes.map((value, index) => {
                        return (
                          <option key={index} value={value.value}>
                            {value.label}
                          </option>
                        );
                      })}
                    </Select>
                  )}
                </FormControl>
                <div>分</div>
                <Tooltip
                  title="追加"
                  placement={
                    index === report.report_items.length - 1 ? "bottom" : "top"
                  }
                >
                  <IconButton
                    size="small"
                    style={{
                      visibility:
                        report.report_items.length > REPORT_ITEMS_MAX
                          ? "hidden"
                          : "",
                      margin: "0 0.5rem",
                    }}
                    onClick={onAddButtonClick}
                  >
                    <AddCircleOutlineIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip
                  title="削除"
                  placement={
                    index === report.report_items.length - 1 ? "bottom" : "top"
                  }
                >
                  <IconButton
                    size="small"
                    style={{
                      visibility:
                        report.report_items.length < 2 ? "hidden" : "",
                    }}
                    onClick={(event) => onDeleteButtonClick(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </div>
            );
          })}

          {/* 感想 */}
          <TextField
            margin="dense"
            id="name"
            label="感想"
            type="text"
            placeholder="ここに感想を残せます"
            multiline
            rows={8}
            rowsMax={8}
            fullWidth
            value={report.content}
            onChange={onContentChange}
            inputProps={{ maxLength: REPORT_CONTENT_MAX }}
          />
          {report.content.length >= REPORT_CONTENT_MAX ? (
            <>感想は{REPORT_CONTENT_MAX}字までです</>
          ) : (
            ""
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancelButtonClick} color="primary">
            キャンセル
          </Button>
          <Button
            onClick={onCreateButtonClick}
            variant="contained"
            color="primary"
          >
            {report.updatedAt === 0 ? "作成" : "更新"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default ReportFormDialog;
