import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Chip, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Downshift from "downshift";

const useStyles = makeStyles((theme) => ({
  chip: {
    margin: theme.spacing(0.5, 0.25),
  },
}));

/**
 * タグ入力のコンポーネントです。
 */
export default function TagsInput({ ...props }) {
  const classes = useStyles();
  const { selectedTags, placeholder, tags, ...other } = props;
  const [inputValue, setInputValue] = React.useState("");

  useEffect(() => {
    props.setCategoryInput(tags);
  }, [tags]);

  useEffect(() => {
    selectedTags(props.categoryInput);
  }, [props.categoryInput, selectedTags]);

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      const newSelectedItem = [...props.categoryInput];
      const duplicatedValues = newSelectedItem.indexOf(
        event.target.value.trim()
      );

      if (duplicatedValues !== -1) {
        setInputValue("");
        return;
      }
      if (!event.target.value.replace(/\s/g, "").length) return;

      newSelectedItem.push(event.target.value.trim());
      props.setCategoryInput(newSelectedItem);
      setInputValue("");
    }
    if (
      props.categoryInput.length &&
      !inputValue.length &&
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
    setInputValue("");
    props.setCategoryInput(newSelectedItem);
  }

  const handleDelete = (item) => () => {
    const newSelectedItem = [...props.categoryInput];
    newSelectedItem.splice(newSelectedItem.indexOf(item), 1);
    props.setCategoryInput(newSelectedItem);
  };

  function handleInputChange(event) {
    setInputValue(event.target.value);
  }

  return (
    <React.Fragment>
      <Downshift
        id="downshift-multiple"
        inputValue={inputValue}
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
    </React.Fragment>
  );
}
TagsInput.defaultProps = {
  tags: [],
};
TagsInput.propTypes = {
  selectedTags: PropTypes.func.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string),
};
