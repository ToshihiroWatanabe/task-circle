import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Popper,
  Select,
  Switch,
  TextField,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import { GlobalStateContext } from "contexts/GlobalStateContext";
import React, { memo, useContext, useEffect, useState } from "react";

/** 時間 */
const hours: Array<{ label: string; value: number }> = [];
for (let i = 0; i <= 23; i++) {
  hours.push({ label: i.toString(), value: i });
}

/** 分 */
const minutes: Array<{ label: string; value: number }> = [];
minutes.push({ label: "0", value: 0 });
minutes.push({ label: "15", value: 15 });
minutes.push({ label: "30", value: 30 });
minutes.push({ label: "45", value: 45 });
for (let i = 0; i <= 59; i++) {
  minutes.push({ label: i.toString(), value: i });
}

/** 秒 */
const seconds: Array<{ label: string; value: number }> = [];
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

const useStyles = makeStyles((theme) => ({
  [theme.breakpoints.up("sm")]: { paper: { width: "90%" } },
}));

let isControlPressed = false;

/**
 * 編集ダイアログのコンポーネントです。
 */
const TaskEditDialog = memo(
  (props: {
    todoLists: any;
    setTodoLists: any;
    updateTodoLists: any;
    columnIndex: number;
    index: number;
    open: boolean;
    setOpen: any;
    sendMessage: any;
    categories: any;
  }) => {
    const classes = useStyles();
    const theme = useTheme();
    const useMediaQueryThemeBreakpointsDownXs = useMediaQuery(
      theme.breakpoints.down("xs")
    );
    const [value, setValue] = useState({
      category: "",
      content: "",
      hour: 0,
      minute: 0,
      second: 0,
      achievedThenStop: false,
    });
    const { globalState, setGlobalState } = useContext(GlobalStateContext);

    useEffect(() => {
      // @ts-ignore
      const selectedTask = Object.values(props.todoLists)[props.columnIndex]
        .items[props.index];
      setValue((value) => {
        value.category = selectedTask.category;
        value.content = selectedTask.content;
        value.hour = Math.floor(selectedTask.estimatedSecond / 3600);
        value.minute = Math.floor((selectedTask.estimatedSecond / 60) % 60);
        value.second = Math.floor(selectedTask.estimatedSecond % 60);
        value.achievedThenStop = selectedTask.achievedThenStop;
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
      setGlobalState((globalState: any) => {
        const newTodoLists = {
          ...globalState.todoLists,
          [Object.keys(globalState.todoLists)[props.columnIndex]]: {
            // @ts-ignore
            ...Object.values(globalState.todoLists)[props.columnIndex],
            // @ts-ignore
            items: Object.values(globalState.todoLists)[
              props.columnIndex
            ].items.map((item: any, index: number) => {
              if (index === props.index) {
                item.category = value.category;
                item.content = value.content;
                item.estimatedSecond =
                  value.hour * 3600 + value.minute * 60 + value.second;
                item.achievedThenStop = value.achievedThenStop;
              }
              return item;
            }),
          },
        };
        props.updateTodoLists(newTodoLists);
        return { ...globalState, todoLists: newTodoLists };
      });
      props.setOpen(false);
      if (
        globalState.isTimerOn &&
        // @ts-ignore
        Object.values(props.todoLists)[props.columnIndex].items[props.index]
          .isSelected
      ) {
        if (globalState.isConnected && globalState.isInRoom) {
          props.sendMessage();
        }
      }
    };

    /** オートコンプリートの選択肢 */
    const Popper4rem = function (props: any) {
      return (
        <Popper {...props} style={{ width: "4rem" }} placement="bottom-start" />
      );
    };
    /** オートコンプリートの選択肢 */
    const Popper8rem = function (props: any) {
      return (
        <Popper {...props} style={{ width: "8rem" }} placement="bottom-start" />
      );
    };

    /**
     * カテゴリーの選択肢が選ばれたときの処理です。
     */
    const onCategoryChange = (categoryValue: any, reason: string) => {
      if (categoryValue === undefined) {
        // @ts-ignore
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
    const onCategoryClose = (event: any, reason: string) => {
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
    const onHourChange = (hourValue: number) => {
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
    const onHourTextChange = (target: any) => {
      // 全角数字が含まれていたら半角数字に変換
      target.value = target.value.replace(/[０-９]/g, (s: string) => {
        return String.fromCharCode(s.charCodeAt(0) - 65248);
      });
      if (target.value.match(/.*\d.*/)) {
        setValue((value) => {
          value.hour =
            parseInt(target.value) > 24 ? 24 : parseInt(target.value);
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
    const onMinuteChange = (minuteValue: number) => {
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
    const onMinuteTextChange = (target: any) => {
      // 全角数字が含まれていたら半角数字に変換
      target.value = target.value.replace(/[０-９]/g, (s: string) => {
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
    const onSecondChange = (secondValue: number) => {
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
    const onSecondTextChange = (target: any) => {
      // 全角数字が含まれていたら半角数字に変換
      target.value = target.value.replace(/[０-９]/g, (s: string) => {
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

    /**
     * キーが押下されたときの処理です。
     * @param {*} event
     */
    const onKeyDown = (event: any) => {
      if (event.key === "Control") {
        isControlPressed = true;
      }
      if (event.keyCode === 13 && isControlPressed) {
        // @ts-ignore
        document.activeElement.blur();
        isControlPressed = false;
        handleAccept();
      }
    };

    /**
     * キーが離れたときの処理です。
     * @param {*} event
     */
    const onKeyUp = (event: any) => {
      if (event.key === "Control") {
        isControlPressed = false;
      }
    };

    return (
      <>
        <Dialog
          fullScreen={useMediaQueryThemeBreakpointsDownXs}
          open={props.open}
          onClose={handleCancel}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
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
              getOptionLabel={(option: any) => option.label}
              filterOptions={filterOptions}
              value={{
                label: value.category,
                value: value.category,
              }}
              onChange={(e, v: any, r) => onCategoryChange(v.value, r)}
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
              value={value.content}
              onChange={(e) => {
                setValue((value) => {
                  return { ...value, content: e.target.value };
                });
              }}
            />
            <div style={{ display: "flex", alignItems: "center" }}>
              目標・見積時間:
              {/* 時間 */}
              <FormControl>
                {!useMediaQueryThemeBreakpointsDownXs && (
                  <Autocomplete
                    freeSolo
                    disableClearable // バツマークを無効にする
                    PopperComponent={Popper4rem}
                    options={hours}
                    getOptionLabel={(option: any) => option.label}
                    filterOptions={filterOptions}
                    value={{
                      label: value.hour.toString(),
                      value: value.hour,
                    }}
                    onChange={(e, v: any) => onHourChange(v.value)}
                    onFocus={(e) => {
                      // @ts-ignore
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
                        onChange={(e: any) => onHourTextChange(e.target)}
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
                {useMediaQueryThemeBreakpointsDownXs && (
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
                {!useMediaQueryThemeBreakpointsDownXs && (
                  <Autocomplete
                    freeSolo
                    disableClearable // バツマークを無効にする
                    PopperComponent={Popper4rem}
                    options={minutes}
                    getOptionLabel={(option: any) => option.label}
                    filterOptions={filterOptions}
                    value={{
                      label: value.minute.toString(),
                      value: value.minute,
                    }}
                    onChange={(e: any, v: any) => onMinuteChange(v.value)}
                    onFocus={(e) => {
                      // @ts-ignore
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
                        onChange={(e: any) => onMinuteTextChange(e.target)}
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
                {useMediaQueryThemeBreakpointsDownXs && (
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
                {!useMediaQueryThemeBreakpointsDownXs && (
                  <Autocomplete
                    freeSolo
                    disableClearable // バツマークを無効にする
                    PopperComponent={Popper4rem}
                    options={seconds}
                    getOptionLabel={(option: any) => option.label}
                    filterOptions={filterOptions}
                    value={{
                      label: value.second.toString(),
                      value: value.second,
                    }}
                    onChange={(e, v: any) => onSecondChange(v.value)}
                    onFocus={(e) => {
                      // @ts-ignore
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
                        onChange={(e: any) => onSecondTextChange(e.target)}
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
                {useMediaQueryThemeBreakpointsDownXs && (
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
            目標達成時にアラームを鳴らす
            <Switch
              checked={value.achievedThenStop}
              disabled={
                value.hour === 0 && value.minute === 0 && value.second === 0
              }
              onChange={() => {
                setValue({
                  ...value,
                  achievedThenStop: !value.achievedThenStop,
                });
              }}
            />
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
      </>
    );
  }
);

export default TaskEditDialog;
