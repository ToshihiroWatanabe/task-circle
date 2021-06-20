import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Chip, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Downshift from "downshift";

let lastSpacePressed = Date.now();

const useStyles = makeStyles((theme) => ({
  chip: {
    maxWidth: "6.8rem",
    marginLeft: "-0.5rem",
  },
}));

/**
 * タグ入力のコンポーネントです。
 */
export default function TagsInput({ ...props }) {
  const classes = useStyles();
  const { selectedTags, placeholder, tags, ...other } = props;

  useEffect(() => {
    props.setCategoryInput(tags);
  }, [tags]);

  useEffect(() => {
    selectedTags(props.categoryInput);
  }, [props.categoryInput, selectedTags]);

  /**
   * キーが押されたときの処理です。
   * @param {*} event
   * @returns
   */
  function handleKeyDown(event) {
    if (event.keyCode === 32 && props.categoryInput.length === 0) {
      if (Date.now() - lastSpacePressed < 1000) {
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
  }

  function handleChange(item) {
    let newSelectedItem = [...props.categoryInput];
    if (newSelectedItem.indexOf(item) === -1) {
      newSelectedItem = [...newSelectedItem, item];
    }
    props.setInputValue("");
    props.setCategoryInput(newSelectedItem);
  }

  const handleDelete = (item) => () => {
    const newSelectedItem = [...props.categoryInput];
    newSelectedItem.splice(newSelectedItem.indexOf(item), 1);
    props.setCategoryInput(newSelectedItem);
  };

  function handleInputChange(event) {
    props.setInputValue(event.target.value);
  }

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
                    props.setIsTagsInputFocused(false);
                  },
                  onChange: (event) => {
                    handleInputChange(event);
                    onChange(event);
                  },
                  onFocus: () => {
                    props.setIsTagsInputFocused(true);
                  },
                }}
                {...other}
                {...inputProps}
              />
            </div>
          );
        }}
      </Downshift>
    </>
  );
}
TagsInput.defaultProps = {
  tags: [],
};
TagsInput.propTypes = {
  selectedTags: PropTypes.func.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string),
};
