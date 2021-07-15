// @ts-nocheck
import { Chip, IconButton, TextField, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import "components/home/TaskAddInput.css";
import AddIcon from "@material-ui/icons/Add";
import Downshift from "downshift";
import PropTypes from "prop-types";
import React, { memo, useEffect, useState } from "react";
import { NG_TASK_NAMES, NUMBER_OF_TASKS_MAX } from "utils/constant.ts";
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
const TaskAddInput = memo((props) => {
  const classes = useStyles();
  const [helperText, setHelperText] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [categoryInput, setCategoryInput] = useState([]);
  const {
    placeholder,
    tags,
    todoLists,
    setTodoLists,
    isTagsInputFocused,
    setIsTagsInputFocused,
    updateTodoLists,
    index,
    ...other
  } = props;

  useEffect(() => {
    setCategoryInput(tags);
  }, [tags]);

  useEffect(() => {
    selectedTags(categoryInput);
  }, [categoryInput]);

  /**
   * キーが押されたときの処理です。
   * @param {*} event
   */
  const handleKeyDown = (event) => {
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
          event.target.value.trim()
        );

        if (duplicatedValues !== -1) {
          setInputValue("");
          return;
        }
        if (!event.target.value.replace(/\s/g, "").length) return;

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
  const handleDelete = (item) => () => {
    const newSelectedItem = [...categoryInput];
    newSelectedItem.splice(newSelectedItem.indexOf(item), 1);
    setCategoryInput(newSelectedItem);
  };

  /**
   * 入力された値が変化したときの処理です。
   * @param {*} event
   */
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setHelperText("");
  };

  /**
   * 追加ボタンがクリックされたときの処理です。
   */
  const onAddButtonClick = () => {
    const retrievedInputValue = retrieveEstimatedSecond(inputValue.trim());
    if (validate(retrievedInputValue.content)) {
      props.setTodoLists((todoLists) => {
        Object.values(todoLists)[props.index].items.push({
          id: uuid(),
          category: categoryInput.length > 0 ? categoryInput[0] : "",
          content: retrievedInputValue.content,
          spentSecond: 0,
          estimatedSecond: retrievedInputValue.estimatedSecond,
          isSelected: false,
          achievedThenStop: false,
        });
        props.updateTodoLists(todoLists);
        return { ...todoLists };
      });
      setCategoryInput([]);
      setInputValue("");
    }
  };

  /**
   * 入力された値を検証します。
   */
  const validate = (input) => {
    if (
      Object.values(props.todoLists)[props.index].items.length >
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
  const retrieveEstimatedSecond = (input) => {
    /** HH:MM:SS表記にマッチしているかどうか */
    const HHMMSSmatched = input.match(
      /([0-1]*[0-9]|2[0-3]):[0-5]*[0-9]:[0-5]*[0-9]/
    );
    /** ポモドーロ数表記にマッチしているかどうか */
    const pomodoroMatched = input.match(/[0-9]*[0-9](pomo|ポモ)/);
    if (HHMMSSmatched) {
      let matchedSplit = HHMMSSmatched[0].split(":");
      let estimatedSecond =
        parseInt(matchedSplit[0]) * 3600 +
        parseInt(matchedSplit[1]) * 60 +
        parseInt(matchedSplit[2]);
      return {
        content: input.split(HHMMSSmatched[0])[0],
        estimatedSecond: estimatedSecond,
      };
    } else if (pomodoroMatched) {
      let matchedSplit = pomodoroMatched[0].split(/(pomo|ポモ)/);
      let estimatedSecond = parseInt(matchedSplit[0]) * 25 * 60;
      return {
        content: input.split(pomodoroMatched[0])[0],
        estimatedSecond: estimatedSecond,
      };
    }
    return { content: input, estimatedSecond: 0 };
  };

  /**
   * カテゴリーの入力を反映させます。
   */
  const selectedTags = (category) => {
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
            placeholder,
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
                InputProps={{
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
                    props.setIsTagsInputFocused(-1);
                  },
                  onChange: (event) => {
                    handleInputChange(event);
                    onChange(event);
                  },
                  onFocus: () => {
                    props.setIsTagsInputFocused(props.index);
                  },
                }}
                helperText={helperText}
                {...other}
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
});

TaskAddInput.defaultProps = {
  tags: [],
};
TaskAddInput.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string),
};

export default TaskAddInput;