import { Chip, IconButton, TextField, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import "components/home/TaskAddInput.css";
import AddIcon from "@material-ui/icons/Add";
import Downshift from "downshift";
import { GlobalStateContext } from "contexts/GlobalStateContext";
import React, { memo, useContext, useEffect, useState } from "react";
import { NG_TASK_NAMES, NUMBER_OF_TASKS_MAX } from "utils/constant";
// @ts-ignore
import uuid from "uuid/v4";

/** 最後にスペースバーを押した時刻 */
let lastSpacePressed = 0;

const useStyles = makeStyles((theme) => ({
  chip: {
    maxWidth: "6.8rem",
    marginLeft: "-0.5rem",
  },
}));

/**
 * タスク追加の入力欄のコンポーネントです。
 */
const TaskAddInput = memo(
  (props: {
    updateTodoLists: any;
    setIsInputFocused: any;
    style: any;
    index: number;
  }) => {
    const classes = useStyles();
    const [helperText, setHelperText] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [categoryInput, setCategoryInput] = useState([]);
    const { globalState, setGlobalState } = useContext(GlobalStateContext);

    useEffect(() => {
      selectedTags(categoryInput);
    }, [categoryInput]);

    /**
     * キーが押されたときの処理です。
     * @param {*} event
     */
    const handleKeyDown = (event: any) => {
      // 半角スペースか全角スペースが素早く2回押されるとカテゴリーとして追加する
      if (
        categoryInput.length === 0 &&
        (event.keyCode === 32 ||
          (event.keyCode === 229 && event.code === "Space"))
      ) {
        if (
          (event.keyCode === 32 && Date.now() - lastSpacePressed < 1000) ||
          (event.keyCode === 229 &&
            event.code === "Space" &&
            event.target.value.endsWith("　") &&
            Date.now() - lastSpacePressed < 1000)
        ) {
          const newSelectedItem = [...categoryInput];
          const duplicatedValues = newSelectedItem.indexOf(
            // @ts-ignore
            event.target.value.trim()
          );

          if (duplicatedValues !== -1) {
            setInputValue("");
            return;
          }
          if (!event.target.value.replace(/\s/g, "").length) return;
          // @ts-ignore
          newSelectedItem.push(event.target.value.trim());
          setCategoryInput(newSelectedItem);
          setInputValue("");
        } else {
          lastSpacePressed = Date.now();
        }
      } else {
        lastSpacePressed = 0;
      }
      if (event.keyCode === 13) {
        onAddButtonClick();
      }
      if (
        categoryInput.length &&
        !inputValue.length &&
        event.key === "Backspace"
      ) {
        setCategoryInput(categoryInput.slice(0, categoryInput.length - 1));
      }
    };

    /**
     * カテゴリーの削除ボタンが押されたときの処理です。
     * @param {*} item
     */
    const handleDelete = (item: any) => () => {
      const newSelectedItem = [...categoryInput];
      // @ts-ignore
      newSelectedItem.splice(newSelectedItem.indexOf(item), 1);
      setCategoryInput(newSelectedItem);
    };

    /**
     * 入力された値が変化したときの処理です。
     * @param {*} event
     */
    const handleInputChange = (event: any) => {
      setInputValue(event.target.value);
      setHelperText("");
    };

    /**
     * 追加ボタンがクリックされたときの処理です。
     */
    const onAddButtonClick = () => {
      const retrievedInputValue = retrieveEstimatedSecond(inputValue.trim());
      if (validate(retrievedInputValue.content)) {
        setGlobalState((globalState: any) => {
          // @ts-ignore
          Object.values(globalState.todoLists)[props.index].items.push({
            id: uuid(),
            category: categoryInput.length > 0 ? categoryInput[0] : "",
            content: retrievedInputValue.content,
            spentSecond: 0,
            estimatedSecond: retrievedInputValue.estimatedSecond,
            isSelected: false,
            achievedThenStop: false,
          });
          props.updateTodoLists(globalState.todoLists);
          return { ...globalState };
        });
        setCategoryInput([]);
        setInputValue("");
      }
    };

    /**
     * 入力された文字列を検証します。
     * @param {string} input 入力された文字列
     */
    const validate = (input: string) => {
      if (
        Object.values(globalState.todoLists)[props.index] &&
        // @ts-ignore
        Object.values(globalState.todoLists)[props.index].items.length >
          NUMBER_OF_TASKS_MAX
      ) {
        setHelperText("これ以上タスクを追加できません");
        return false;
      } else if (input.length < 1) {
        setHelperText("タスク名を入力してください");
        return false;
      } else if (NG_TASK_NAMES.includes(input)) {
        setHelperText("そのタスク名は使えません");
        return false;
      } else if (input.length > 45) {
        setHelperText("タスク名は45文字以内にしてください");
        return false;
      } else if (
        categoryInput.length > 0 &&
        // @ts-ignore
        categoryInput[0].trim().length > 45
      ) {
        setHelperText("カテゴリー名は45文字以内にしてください");
        return false;
      }
      return true;
    };

    /**
     * 入力された文字列を、文字列と目標時間に分割します。
     * @param {*} input 入力された文字列
     * @returns 内容と目標時間のオブジェクト
     */
    const retrieveEstimatedSecond = (input: string) => {
      /** タスク名 */
      let content = input;
      let estimatedSecond = 0;
      /** HH:MM:SS表記にマッチしているかどうか */
      const HHMMSSmatched = input.match(
        /([0-1]*[0-9]|2[0-3]):[0-5]*[0-9]:[0-5]*[0-9]$/
      );
      /** ポモドーロ数表記にマッチしているかどうか */
      const pomodoroMatched = input.match(/[0-9]*[0-9](pomo|ポモ)$/);
      /** ◯h◯m◯s表記にマッチしているかどうか */
      const hmsMatched = input.match(
        /[^0-9]+([0-9]*[0-9]h|[0-5]*[0-9]m|[0-5]*[0-9]s)$/
      );
      if (HHMMSSmatched) {
        let matchedSplit = HHMMSSmatched[0].split(":");
        estimatedSecond =
          parseInt(matchedSplit[0]) * 3600 +
          parseInt(matchedSplit[1]) * 60 +
          parseInt(matchedSplit[2]);
        content = input.split(HHMMSSmatched[0])[0].trim();
      } else if (pomodoroMatched) {
        let matchedSplit = pomodoroMatched[0].split(/(pomo|ポモ)/);
        estimatedSecond = parseInt(matchedSplit[0]) * 25 * 60;
        content = input.split(pomodoroMatched[0])[0].trim();
      } else if (hmsMatched) {
        // h
        if (input.match(/[^0-9]+([0-9]*[0-9]h)/)) {
          content = input.split(/[0-9]*[0-9]h/)[0];
          estimatedSecond =
            parseInt(input.split(content)[1].split("h")[0]) * 60 * 60;
          if (input.match(/h+[0-5]*[0-9]m/)) {
            estimatedSecond += parseInt(input.split(/h|m/)[1]) * 60;
            if (input.match(/m+[0-5]*[0-9]s/)) {
              estimatedSecond += parseInt(input.split(/m|s/)[1]);
            }
          }
          if (input.match(/h+[0-5]*[0-9]s/)) {
            estimatedSecond += parseInt(input.split(/h|s/)[1]);
          }
        } else if (input.match(/[^0-9]+([0-5]*[0-9]m)/)) {
          content = input.split(/[0-5]*[0-9]m/)[0];
          estimatedSecond =
            parseInt(input.split(content)[1].split("m")[0]) * 60;
          if (input.match(/m+[0-5]*[0-9]s/)) {
            estimatedSecond += parseInt(input.split(/m|s/)[1]);
          }
        } else if (input.match(/[^0-9]+([0-5]*[0-9]s)/)) {
          content = input.split(/[0-5]*[0-9]s/)[0];
          estimatedSecond = parseInt(input.split(content)[1].split("s")[0]);
        }
      }
      return { content: content, estimatedSecond: estimatedSecond };
    };

    /**
     * カテゴリーの入力を反映させます。
     */
    const selectedTags = (category: any) => {
      setCategoryInput(category);
    };

    return (
      <>
        <Downshift
          id="downshift-multiple"
          inputValue={inputValue}
          selectedItem={categoryInput}
        >
          {({ getInputProps }) => {
            const { onBlur, onChange, onFocus, ...inputProps } = getInputProps({
              onKeyDown: handleKeyDown,
            });
            return (
              <div
                style={{
                  paddingTop: helperText !== "" ? "0" : "0.5rem",
                  paddingBottom: helperText !== "" ? "0" : "0.5rem",
                  height: helperText ? "4rem" : "",
                }}
              >
                <TextField
                  error={helperText !== "" ? true : false}
                  fullWidth
                  variant="outlined"
                  name="tags"
                  // @ts-ignore
                  size="small"
                  placeholder="タスクを追加"
                  style={props.style}
                  InputProps={{
                    // @ts-ignore
                    maxLength: "4",
                    startAdornment: categoryInput.map((item) => (
                      <Chip
                        key={item}
                        tabIndex={-1}
                        label={item}
                        className={classes.chip}
                        onDelete={handleDelete(item)}
                      />
                    )),
                    onBlur: () => {
                      // @ts-ignore
                      props.setIsInputFocused(-1);
                    },
                    onChange: (event) => {
                      handleInputChange(event);
                      // @ts-ignore
                      onChange(event);
                    },
                    onFocus: () => {
                      // @ts-ignore
                      props.setIsInputFocused(props.index);
                    },
                  }}
                  helperText={helperText}
                  {...inputProps}
                />
              </div>
            );
          }}
        </Downshift>
        <Tooltip title="タスクを追加">
          <IconButton
            onClick={onAddButtonClick}
            style={{ marginLeft: "1rem", width: "3rem", height: "3rem" }}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      </>
    );
  }
);

export default TaskAddInput;
