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

export default function TagsInput({ ...props }) {
  const classes = useStyles();
  const { selectedTags, placeholder, tags, ...other } = props;
  const [inputValue, setInputValue] = React.useState("");

  useEffect(() => {
    props.setSkillSet(tags);
  }, [tags]);

  useEffect(() => {
    selectedTags(props.skillSet);
  }, [props.skillSet, selectedTags]);

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      const newSelectedItem = [...props.skillSet];
      const duplicatedValues = newSelectedItem.indexOf(
        event.target.value.trim()
      );

      if (duplicatedValues !== -1) {
        setInputValue("");
        return;
      }
      if (!event.target.value.replace(/\s/g, "").length) return;

      newSelectedItem.push(event.target.value.trim());
      props.setSkillSet(newSelectedItem);
      setInputValue("");
    }
    if (
      props.skillSet.length &&
      !inputValue.length &&
      event.key === "Backspace"
    ) {
      props.setSkillSet(props.skillSet.slice(0, props.skillSet.length - 1));
    }
  }
  function handleChange(item) {
    let newSelectedItem = [...props.skillSet];
    if (newSelectedItem.indexOf(item) === -1) {
      newSelectedItem = [...newSelectedItem, item];
    }
    setInputValue("");
    props.setSkillSet(newSelectedItem);
  }

  const handleDelete = (item) => () => {
    const newSelectedItem = [...props.skillSet];
    newSelectedItem.splice(newSelectedItem.indexOf(item), 1);
    props.setSkillSet(newSelectedItem);
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
        selectedItem={props.skillSet}
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
                  startAdornment: props.skillSet.map((item) => (
                    <Chip
                      key={item}
                      tabIndex={-1}
                      label={item}
                      className={classes.chip}
                      onDelete={handleDelete(item)}
                    />
                  )),
                  onBlur,
                  onChange: (event) => {
                    handleInputChange(event);
                    onChange(event);
                  },
                  onFocus,
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
