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
} from "@material-ui/core";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import { Context } from "contexts/Context";

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
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setState((state) => {
      setCategories((categories) => {
        return getCategories();
      });
      return state;
    });
  }, []);

  const getCategories = () => {
    for (let i = 0; i < state.reports.length; i++) {
      for (let j = 0; j < state.reports[i].report_items.length; j++) {
        categories.push({
          label: state.reports[i].report_items[j].category,
          value: state.reports[i].report_items[j].category,
        });
      }
    }
    // 重複を削除
    const newCategories = categories.filter((element, index, array) => {
      return (
        array.findIndex((element2) => element.label === element2.label) ===
        index
      );
    });
    return newCategories;
  };

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
    if (inRef.value !== "") {
      // ユーザー名
      if (props.name !== undefined) {
        props.setName(inRef.value);
      }
      // Todoリスト
      if (props.todoList !== undefined) {
        const copy = [...props.todoList];
        copy.forEach((e) => {
          if (e.id === props.id) {
            e.text = inRef.value;
          }
        });
        props.setTodoList(copy);
      }
      props.setOpen(false);
    }
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
  const Popper8rem = function (props) {
    return (
      <Popper {...props} style={{ width: "8rem" }} placement="bottom-start" />
    );
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
      // setReport((report) => {
      //   report.report_items[index].category = value;
      //   return {
      //     date: report.date,
      //     content: report.content,
      //     report_items: report.report_items,
      //     updatedAt: report.updatedAt,
      //   };
      // });
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
      // setReport((report) => {
      //   report.report_items[index].category = event.target.value;
      //   return {
      //     date: report.date,
      //     content: report.content,
      //     report_items: report.report_items,
      //     updatedAt: report.updatedAt,
      //   };
      // });
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
          <Autocomplete
            freeSolo
            disableClearable
            PopperComponent={Popper8rem}
            options={categories}
            getOptionLabel={(option) => option.label}
            filterOptions={filterOptions}
            value={{
              label: Object.values(props.columns)[0].items[props.index]
                .category,
              value: Object.values(props.columns)[0].items[props.index]
                .category,
            }}
            onChange={(e, v, r) => onCategoryChange(props.index, v.value, r)}
            onClose={(e, r) => onCategoryClose(props.index, e, r)}
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
