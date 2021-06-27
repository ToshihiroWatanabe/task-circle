import React, { memo, useEffect } from "react";
import PropTypes from "prop-types";
import { Chip, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Downshift from "downshift";

let lastSpacePressed = 0;

const useStyles = makeStyles((theme) => ({
  chip: {
    maxWidth: "6.8rem",
    marginLeft: "-0.5rem",
  },
}));

/**
 * タグ入力可能な入力欄のコンポーネントです。
 */
const TagsInput = memo((props) => {
  const classes = useStyles();
  const {
    selectedTags,
    placeholder,
    tags,
    categoryInput,
    setCategoryInput,
    isTagsInputFocused,
    setIsTagsInputFocused,
    index,
    inputValue,
    setInputValue,
    onAddButtonClick,
    helperText,
    setHelperText,
    ...other
  } = props;

  useEffect(() => {
    props.setCategoryInput(tags);
  }, [tags]);

  useEffect(() => {
    selectedTags(props.categoryInput);
  }, [props.categoryInput, selectedTags]);

  /**
   * キーが押されたときの処理です。
   * @param {*} event
   */
  const handleKeyDown = (event) => {
    // 半角スペースか全角スペースが素早く2回押されるとカテゴリーとして追加する
    if (
      props.categoryInput.length === 0 &&
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
        const newSelectedItem = [...props.categoryInput];
        const duplicatedValues = newSelectedItem.indexOf(
          event.target.value.trim()
        );

        if (duplicatedValues !== -1) {
          props.setInputValue("");
          return;
        }
        if (!event.target.value.replace(/\s/g, "").length) return;

        newSelectedItem.push(event.target.value.trim());
        props.setCategoryInput(newSelectedItem);
        props.setInputValue("");
      } else {
        lastSpacePressed = Date.now();
      }
    } else {
      lastSpacePressed = 0;
    }
    if (event.key === "Enter") {
      props.onAddButtonClick();
    }
    if (
      props.categoryInput.length &&
      !props.inputValue.length &&
      event.key === "Backspace"
    ) {
      props.setCategoryInput(
        props.categoryInput.slice(0, props.categoryInput.length - 1)
      );
    }
  };

  const handleChange = (item) => {
    let newSelectedItem = [...props.categoryInput];
    if (newSelectedItem.indexOf(item) === -1) {
      newSelectedItem = [...newSelectedItem, item];
    }
    props.setInputValue("");
    props.setCategoryInput(newSelectedItem);
  };

  const handleDelete = (item) => () => {
    const newSelectedItem = [...props.categoryInput];
    newSelectedItem.splice(newSelectedItem.indexOf(item), 1);
    props.setCategoryInput(newSelectedItem);
  };

  /**
   * 入力された値が変化したときの処理です。
   * @param {*} event
   */
  const handleInputChange = (event) => {
    props.setInputValue(event.target.value);
    props.setHelperText("");
  };

  return (
    <>
      <Downshift
        id="downshift-multiple"
        inputValue={props.inputValue}
        onChange={handleChange}
        selectedItem={props.categoryInput}
      >
        {({ getInputProps }) => {
          const { onBlur, onChange, onFocus, ...inputProps } = getInputProps({
            onKeyDown: handleKeyDown,
            placeholder,
          });
          return (
            <div>
              <TextField
                InputProps={{
                  maxLength: "4",
                  startAdornment: props.categoryInput.map((item) => (
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
                helperText={props.helperText}
                {...other}
                {...inputProps}
              />
            </div>
          );
        }}
      </Downshift>
    </>
  );
});

TagsInput.defaultProps = {
  tags: [],
};
TagsInput.propTypes = {
  selectedTags: PropTypes.func.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string),
};

export default TagsInput;
