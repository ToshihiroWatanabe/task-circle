import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import "components/TaskAndTimer/LabelBottomNavigation.css";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import ListAltIcon from "@material-ui/icons/ListAlt";
import PeopleIcon from "@material-ui/icons/People";

const useStyles = makeStyles({
  root: {
    width: "100vw",
    position: "fixed",
    bottom: "0",
    paddingRight: "5rem",
  },
});

/**
 * ボトムナビゲーションのコンポーネントです。
 */
const LabelBottomNavigation = (props) => {
  const classes = useStyles();
  const [value, setValue] = useState("recents");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  /**
   * ToDoリストボタンがクリックされたときの処理です。
   * @param {*} index
   */
  const onListButtonClick = (index) => {
    if (index === 0) {
      document.getElementsByTagName("main")[0].scrollLeft = 0;
    } else {
      const todoListAndRoomWidth =
        document.getElementById("todoListAndRoom").children[0].clientWidth +
        document.getElementById("todoListAndRoom").children[1].clientWidth;
      const todoListLength = Object.values(props.todoLists).length;
      document.getElementsByTagName("main")[0].scrollLeft =
        (todoListAndRoomWidth * index) / (todoListLength + 1) - 10;
    }
  };

  /**
   * ルームボタンがクリックされたときの処理です。
   */
  const onRoomButtonClick = () => {
    const todoListAndRoomWidth =
      document.getElementById("todoListAndRoom").children[0].clientWidth +
      document.getElementById("todoListAndRoom").children[1].clientWidth;
    document.getElementsByTagName("main")[0].scrollLeft = todoListAndRoomWidth;
  };

  return (
    <BottomNavigation
      value={value}
      onChange={handleChange}
      className={classes.root}
    >
      {Object.values(props.todoLists).map((todoList, index) => {
        return (
          <BottomNavigationAction
            key={index}
            label={todoList.name}
            value={"list" + index}
            icon={<ListAltIcon />}
            onClick={() => {
              onListButtonClick(index);
            }}
          />
        );
      })}
      <BottomNavigationAction
        label="ルーム"
        value="room"
        icon={<PeopleIcon />}
        onClick={() => {
          onRoomButtonClick();
        }}
      />
    </BottomNavigation>
  );
};

export default LabelBottomNavigation;
