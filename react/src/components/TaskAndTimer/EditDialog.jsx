import React, { memo, useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Popper,
  useTheme,
  useMediaQuery,
  FormControl,
  Select,
} from "@material-ui/core";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import { Context } from "contexts/Context";

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

const seconds = [];
seconds.push({ label: "0", value: 0 });
seconds.push({ label: "15", value: 15 });
seconds.push({ label: "30", value: 30 });
seconds.push({ label: "45", value: 45 });
for (let i = 0; i <= 59; i++) {
  seconds.push({ label: i.toString(), value: i });
}

const filterOptions = createFilterOptions({
  matchFrom: "start",
});

/** Material-UIのスタイル */
const useStyles = makeStyles((theme) => ({
  paper: { width: "90%" },
}));

let enterKeyIsDown = false;

/**
 * 編集ダイアログのコンポーネントです。
 */
const EditDialog = memo((props) => {
  /** Material-UIのスタイル */
  const classes = useStyles();
  const [state, setState] = useContext(Context);
  let inRef = null;
  const theme = useTheme();
  const isBreakPointsDownXs = useMediaQuery(theme.breakpoints.down("xs"));
  const [value, setValue] = useState({
    category: "",
    content: "",
    hour: 0,
    minute: 0,
    second: 0,
  });

  useEffect(() => {
    setValue((value) => {
      value.category = Object.values(props.columns)[0].items[
        props.index
      ].category;
      value.content = Object.values(props.columns)[0].items[
        props.index
      ].content;
      value.hour = Math.floor(
        Object.values(props.columns)[0].items[props.index].estimatedSecond /
          3600
      );
      value.minute = Math.floor(
        (Object.values(props.columns)[0].items[props.index].estimatedSecond /
          60) %
          60
      );
      value.second = Math.floor(
        Object.values(props.columns)[0].items[props.index].estimatedSecond % 60
      );
      return { ...value };
    });
  }, []);

  /**
   * キャンセルしたときの処理です。
   */
  const handleCancel = () => {
    props.setOpen(false);
  };

  /**
   * 決定したときの処理です。
   */
  const handleAccept = () => {
    props.setColumns((columns) => {
      return {
        [Object.keys(columns)[0]]: {
          ...Object.values(columns)[0],
          items: Object.values(columns)[0].items.map((item, index) => {
            if (index === props.index) {
              item.category = value.category;
              item.content = value.content;
              item.estimatedSecond =
                value.hour * 3600 + value.minute * 60 + value.second;
            }
            return item;
          }),
        },
      };
    });
    props.setOpen(false);
  };

  /**
   * キーが押されたときの処理です。
   * @param {*} event
   */
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      setTimeout(() => {
        enterKeyIsDown = true;
      }, 1);
    }
  };

  /**
   * キーが離れたときの処理です。
   * @param {*} event
   */
  const handleKeyUp = (event) => {
    if (event.key === "Enter" && enterKeyIsDown) {
      enterKeyIsDown = false;
      handleAccept();
    }
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
   * カテゴリーの選択肢が選ばれたときの処理です。
   */
  const onCategoryChange = (categoryValue, reason) => {
    console.log(categoryValue);
    if (categoryValue === undefined) {
      document.activeElement.blur();
    }
    if (reason === "select-option") {
      setValue((value) => {
        value.category = categoryValue;
        return { ...value };
      });
    }
  };

  /**
   * カテゴリーの選択肢が閉じられたときの処理です。
   * @param {*} index
   * @param {*} event
   */
  const onCategoryClose = (event, reason) => {
    // カーソルが外れて選択肢が閉じられた場合
    if (reason === "blur") {
      setValue((value) => {
        value.category = event.target.value;
        return { ...value };
      });
    }
  };

  /**
   * 時間の選択肢が選ばれたときの処理です。
   */
  const onHourChange = (hourValue) => {
    setValue((value) => {
      value.hour = hourValue;
      return { ...value };
    });
  };

  /**
   * 時間のキーボード入力の処理です。
   * @param {*} index
   * @param {*} target
   */
  const onHourTextChange = (target) => {
    // 全角数字が含まれていたら半角数字に変換
    target.value = target.value.replace(/[０-９]/g, (s) => {
      return String.fromCharCode(s.charCodeAt(0) - 65248);
    });
    if (target.value.match(/.*\d.*/)) {
      setValue((value) => {
        value.hour = parseInt(target.value) > 24 ? 24 : parseInt(target.value);
        return { ...value };
      });
    } else {
      setValue((value) => {
        value.hour = 0;
        return { ...value };
      });
    }
  };

  /**
   * 分の選択肢が選ばれたときの処理です。
   * @param {*} index
   * @param {*} value
   */
  const onMinuteChange = (minuteValue) => {
    setValue((value) => {
      value.minute = minuteValue;
      return { ...value };
    });
  };

  /**
   * 分のキーボード入力の処理です。
   * @param {*} index
   * @param {*} target
   */
  const onMinuteTextChange = (target) => {
    // 全角数字が含まれていたら半角数字に変換
    target.value = target.value.replace(/[０-９]/g, (s) => {
      return String.fromCharCode(s.charCodeAt(0) - 65248);
    });
    if (target.value.match(/.*\d.*/)) {
      setValue((value) => {
        value.minute =
          parseInt(target.value) > 59 ? 59 : parseInt(target.value);
        return { ...value };
      });
    } else {
      setValue((value) => {
        value.minute = 0;
        return { ...value };
      });
    }
  };

  /**
   * 秒の選択肢が選ばれたときの処理です。
   * @param {*} index
   * @param {*} value
   */
  const onSecondChange = (secondValue) => {
    setValue((value) => {
      value.second = secondValue;
      return { ...value };
    });
  };

  /**
   * 秒のキーボード入力の処理です。
   * @param {*} index
   * @param {*} target
   */
  const onSecondTextChange = (target) => {
    // 全角数字が含まれていたら半角数字に変換
    target.value = target.value.replace(/[０-９]/g, (s) => {
      return String.fromCharCode(s.charCodeAt(0) - 65248);
    });
    if (target.value.match(/.*\d.*/)) {
      setValue((value) => {
        value.second =
          parseInt(target.value) > 59 ? 59 : parseInt(target.value);
        return { ...value };
      });
    } else {
      setValue((value) => {
        value.second = 0;
        return { ...value };
      });
    }
  };

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={handleCancel}
        aria-labelledby="form-dialog-title"
        classes={{ paper: classes.paper }}
      >
        <DialogTitle id="form-dialog-title">編集</DialogTitle>
        <DialogContent>
          {/* カテゴリー */}
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
            onChange={(e, v, r) => onCategoryChange(v.value, r)}
            onClose={(e, r) => onCategoryClose(e, r)}
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
                }}
              />
            )}
          />
          <TextField
            autoFocus
            margin="dense"
            label="タスク名"
            type="text"
            style={{ width: "97%" }}
            defaultValue={
              Object.values(props.columns)[0].items[props.index].content
            }
            inputRef={(ref) => (inRef = ref)}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
          />
          <div style={{ display: "flex", alignItems: "center" }}>
            目標・見積時間:
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
                  onChange={(e, v) => onHourChange(v.value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="dense"
                      style={{
                        width: "2rem",
                        marginRight: "4px",
                      }}
                      onChange={(e, v) => onHourTextChange(e.target)}
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
                    onHourTextChange(e.target);
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
            時間
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
                    label: value.minute.toString(),
                    value: value.minute,
                  }}
                  onChange={(e, v) => onMinuteChange(v.value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="dense"
                      style={{
                        width: "2rem",
                        marginRight: "4px",
                      }}
                      onChange={(e, v) => onMinuteTextChange(e.target)}
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
                    onMinuteTextChange(e.target);
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
            分{/* 秒 */}
            <FormControl>
              {!isBreakPointsDownXs && (
                <Autocomplete
                  freeSolo
                  disableClearable // バツマークを無効にする
                  PopperComponent={Popper4rem}
                  options={seconds}
                  getOptionLabel={(option) => option.label}
                  filterOptions={filterOptions}
                  value={{
                    label: value.second.toString(),
                    value: value.second,
                  }}
                  onChange={(e, v) => onSecondChange(v.value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="dense"
                      style={{
                        width: "2rem",
                        marginRight: "4px",
                      }}
                      onChange={(e, v) => onSecondTextChange(e.target)}
                      value={{
                        label: value.second.toString(),
                        value: value.second,
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
                  value={value.second}
                  IconComponent={() => <></>}
                  onChange={(e) => {
                    onSecondTextChange(e.target);
                  }}
                >
                  {seconds.map((value, index) => {
                    return (
                      <option key={index} value={value.value}>
                        {value.label}
                      </option>
                    );
                  })}
                </Select>
              )}
            </FormControl>
            秒
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            キャンセル
          </Button>
          <Button onClick={handleAccept} variant="contained" color="primary">
            決定
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});

export default EditDialog;
